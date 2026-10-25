/**
 * Cliente da API da My Box (VPS, api.myboxoficial.com.br), que substituiu o Supabase.
 * A sessao vai num cookie HttpOnly da API, por isso toda chamada leva credentials.
 */
export const API_URL = ((import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3020').replace(/\/+$/, '')

/** Mensagens para os codigos de erro que a API devolve. */
const MESSAGES: Record<string, string> = {
  credenciais_invalidas: 'E-mail ou senha incorretos.',
  muitas_tentativas: 'Muitas tentativas. Aguarde um minuto e tente de novo.',
  nao_autenticado: 'Sua sessão expirou. Entre de novo.',
  sem_permissao: 'Você não tem permissão para isso.',
  email_ja_cadastrado: 'Esse e-mail já está cadastrado.',
  email_invalido: 'E-mail inválido.',
  senha_curta: 'A senha precisa de pelo menos 8 caracteres.',
  link_invalido: 'Este link expirou ou já foi usado. Peça um novo.',
  senha_atual_incorreta: 'A senha atual está incorreta.',
  arquivo_grande_demais: 'A imagem passa de 5 MB.',
  formato_nao_suportado: 'Use JPG, PNG, WEBP ou GIF.',
}

export class ApiError extends Error {
  status: number
  code: string
  constructor(status: number, code: string) {
    super(MESSAGES[code] ?? 'Não foi possível concluir agora. Tente de novo.')
    this.status = status
    this.code = code
  }
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const isForm = body instanceof FormData
  let res: Response
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      credentials: 'include',
      headers: body && !isForm ? { 'Content-Type': 'application/json' } : undefined,
      body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
    })
  } catch {
    throw new ApiError(0, 'sem_conexao')
  }
  const data = await res.json().catch(() => null)
  if (!res.ok) throw new ApiError(res.status, (data as { error?: string } | null)?.error ?? 'erro')
  return data as T
}

export const api = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, body ?? {}),
  patch: <T>(path: string, body: unknown) => request<T>('PATCH', path, body),
  delete: <T>(path: string) => request<T>('DELETE', path),
}

/** Para telas que so mostram o erro: devolve a mensagem em vez de lancar. */
export async function attempt<T>(promise: Promise<T>): Promise<{ data: T | null; error: string | null }> {
  try {
    return { data: await promise, error: null }
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : 'Erro inesperado' }
  }
}
