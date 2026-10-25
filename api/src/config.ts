/** Tudo que muda entre local e producao vem do ambiente (.env no servidor). */
export type Config = {
  port: number
  host: string
  databasePath: string
  storageDir: string
  /** Endereco publico da API, usado nos links das imagens enviadas. */
  publicBaseUrl: string
  /** Sites que podem chamar a API com o cookie de sessao. */
  allowedOrigins: string[]
  /** Segredo compartilhado com a landing de franquia para gravar leads. */
  leadApiToken: string
  /** Envio de e-mail pelo Resend (dominio myboxoficial.com.br verificado). Vazio: so registra no log. */
  resendApiKey: string
  /** Chave geral de envio. Desligada (padrao), nenhum e-mail sai: so vai para o log. */
  emailEnabled: boolean
  emailFrom: string
  /** Enderecos dos sites usados nos links dos e-mails. */
  siteUrl: string
  gamesUrl: string
  secureCookies: boolean
  trustProxy: boolean
}

function required(name: string): string {
  const value = process.env[name]?.trim()
  if (!value) throw new Error(`Defina ${name} no .env`)
  return value
}

export function loadConfig(): Config {
  const production = process.env.NODE_ENV === 'production'
  const leadApiToken = production ? required('LEAD_API_TOKEN') : (process.env.LEAD_API_TOKEN ?? 'dev-lead-token')
  if (production && leadApiToken.length < 32) throw new Error('LEAD_API_TOKEN precisa de 32+ caracteres')

  return {
    port: Number(process.env.PORT ?? 3020),
    host: process.env.HOST ?? '127.0.0.1',
    databasePath: process.env.DATABASE_PATH ?? './data/mybox.db',
    storageDir: process.env.STORAGE_DIR ?? './data/files',
    publicBaseUrl: (process.env.PUBLIC_BASE_URL ?? 'http://localhost:3020').replace(/\/+$/, ''),
    allowedOrigins: (process.env.ALLOWED_ORIGINS ?? 'http://localhost:5183')
      .split(',')
      .map((o) => o.trim())
      .filter(Boolean)
      // O My Box Games (web) sempre chama a API, sem depender do .env do servidor.
      .concat('https://games.myboxoficial.com.br', 'http://localhost:8081'),
    leadApiToken,
    resendApiKey: process.env.RESEND_API_KEY?.trim() ?? '',
    emailEnabled: process.env.EMAIL_ENABLED === 'true',
    emailFrom: process.env.EMAIL_FROM ?? 'My Box <nao-responda@myboxoficial.com.br>',
    siteUrl: (process.env.SITE_URL ?? (production ? 'https://myboxoficial.com.br' : 'http://localhost:5183')).replace(/\/+$/, ''),
    gamesUrl: (process.env.GAMES_URL ?? (production ? 'https://games.myboxoficial.com.br' : 'http://localhost:8091')).replace(/\/+$/, ''),
    secureCookies: production,
    trustProxy: process.env.TRUST_PROXY === 'true',
  }
}
