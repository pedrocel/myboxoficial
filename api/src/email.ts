import type { Config } from './config.ts'

/*
 * E-mails da rede My Box. Layout em tabela com estilos inline (o que Gmail, Outlook e
 * Apple Mail entendem), fundo escuro com o logo branco, faixa em verde da marca e um
 * rodape com a rede. Todo texto dinamico passa por escape().
 */

export type Email = { to: string; subject: string; html: string; text: string }
export type SendEmail = (email: Email) => Promise<void>

export function createMailer(config: Config): SendEmail {
  return async (email) => {
    if (!config.resendApiKey) {
      // Sem chave (local/testes): o link aparece no log para dar para testar.
      console.log(`[email] para ${email.to}: ${email.subject}\n${email.text}`)
      return
    }
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${config.resendApiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: config.emailFrom, to: [email.to], subject: email.subject, html: email.html, text: email.text }),
      signal: AbortSignal.timeout(10_000),
    })
    if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`)
  }
}

const escape = (value: string) =>
  value.replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]!)

type Theme = { accent: string; accentText: string; label: string }
const THEMES: Record<'painel' | 'games', Theme> = {
  painel: { accent: '#16a34a', accentText: '#ffffff', label: 'Painel My Box' },
  games: { accent: '#a3e635', accentText: '#06140b', label: 'My Box Games' },
}

const LOGO = 'https://myboxoficial.com.br/mybox-logo-white.png'
const FONT = "'Helvetica Neue',Helvetica,Arial,sans-serif"

/** Moldura comum: cabecalho escuro com logo, cartao branco, faixa da rede e rodape. */
function layout(opts: { theme: Theme; preheader: string; title: string; body: string; button: { label: string; url: string }; after?: string }) {
  const { theme } = opts
  return `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only"><title>${escape(opts.title)}</title></head>
<body style="margin:0;padding:0;background:#eef2ef;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escape(opts.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef2ef;">
<tr><td align="center" style="padding:32px 12px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">
    <tr><td style="background:#020f08;border-radius:16px 16px 0 0;padding:36px 40px 30px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
        <td><img src="${LOGO}" width="132" height="53" alt="My Box" style="display:block;border:0;"></td>
        <td align="right" style="font-family:${FONT};font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${theme.accent};">${theme.label}</td>
      </tr></table>
    </td></tr>
    <tr><td style="background:${theme.accent};height:6px;line-height:6px;font-size:0;">&nbsp;</td></tr>
    <tr><td style="background:#ffffff;padding:44px 40px 36px;font-family:${FONT};color:#1f2a24;">
      <h1 style="margin:0 0 18px;font-size:28px;line-height:1.15;font-weight:800;letter-spacing:-0.5px;color:#020f08;">${escape(opts.title)}</h1>
      ${opts.body}
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:32px 0 8px;"><tr>
        <td style="background:${theme.accent};border-radius:999px;">
          <a href="${opts.button.url}" style="display:inline-block;padding:16px 34px;font-family:${FONT};font-size:16px;font-weight:700;color:${theme.accentText};text-decoration:none;">${escape(opts.button.label)} &rarr;</a>
        </td>
      </tr></table>
      ${opts.after ?? ''}
    </td></tr>
    <tr><td style="background:#020f08;padding:30px 40px;font-family:${FONT};">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
        <td width="33%" style="color:#ffffff;font-size:26px;font-weight:800;">92<span style="color:${theme.accent};">+</span><div style="font-size:12px;font-weight:400;color:#9fb3a7;">unidades</div></td>
        <td width="33%" style="color:#ffffff;font-size:26px;font-weight:800;">12<div style="font-size:12px;font-weight:400;color:#9fb3a7;">estados</div></td>
        <td width="34%" style="color:#ffffff;font-size:26px;font-weight:800;">50<span style="color:${theme.accent};"> mil+</span><div style="font-size:12px;font-weight:400;color:#9fb3a7;">alunos treinando</div></td>
      </tr></table>
      <p style="margin:22px 0 0;font-size:14px;line-height:1.5;color:#c9d6ce;">Desde 2016 mudando a forma como o Brasil treina — cross training, musculação e aulas coletivas numa academia com conceito de shopping.</p>
    </td></tr>
    <tr><td align="center" style="padding:24px 20px 0;font-family:${FONT};font-size:12px;line-height:1.6;color:#6b7c72;">
      <a href="https://myboxoficial.com.br" style="color:#16a34a;text-decoration:none;font-weight:700;">myboxoficial.com.br</a> &nbsp;·&nbsp;
      <a href="https://myboxoficial.com.br/unidades" style="color:#6b7c72;text-decoration:none;">Unidades</a> &nbsp;·&nbsp;
      <a href="https://games.myboxoficial.com.br" style="color:#6b7c72;text-decoration:none;">My Box Games</a><br>
      Você recebeu este e-mail porque alguém pediu acesso com este endereço. Se não foi você, é só ignorar.<br>
      © ${new Date().getFullYear()} My Box. Todos os direitos reservados.
    </td></tr>
  </table>
</td></tr></table>
</body></html>`
}

const p = (html: string) => `<p style="margin:0 0 14px;font-size:16px;line-height:1.6;color:#3b4a41;">${html}</p>`

/** E-mail do link para criar (primeiro acesso) ou redefinir a senha. */
export function passwordEmail(opts: {
  to: string
  name: string | null
  unitName: string | null
  firstAccess: boolean
  app: 'painel' | 'games'
  url: string
  hours: number
}): Email {
  const theme = THEMES[opts.app]
  const first = (opts.name ?? '').trim().split(/\s+/)[0]
  const hello = first ? `Olá, ${escape(first)}!` : 'Olá!'
  const where = opts.app === 'games' ? 'no My Box Games' : 'no Painel My Box'

  const title = opts.firstAccess ? 'Crie sua senha e comece agora' : 'Redefina sua senha'
  const intro = opts.firstAccess
    ? opts.unitName
      ? `Seu acesso como responsável pela <strong>${escape(opts.unitName)}</strong> ${where} está pronto. Falta só criar a sua senha.`
      : `Seu acesso ${where} está pronto. Falta só criar a sua senha.`
    : `Recebemos um pedido para redefinir a senha da sua conta ${where}.`

  const perks =
    opts.firstAccess && opts.unitName && opts.app === 'painel'
      ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:22px 0 4px;background:#f3f7f4;border-radius:12px;">
          <tr><td style="padding:20px 22px;font-family:${FONT};font-size:14px;line-height:1.7;color:#3b4a41;">
            <strong style="color:#020f08;">No painel você vai:</strong><br>
            &#10003;&nbsp; atualizar fotos, horários e modalidades da sua página<br>
            &#10003;&nbsp; acompanhar os agendamentos de aula experimental<br>
            &#10003;&nbsp; ser anfitrião da sua unidade no My Box Games
          </td></tr></table>`
      : ''

  const after = p(
    `<span style="font-size:13px;color:#6b7c72;">O link vale por ${opts.hours} horas e só pode ser usado uma vez. Se o botão não abrir, copie e cole este endereço no navegador:<br><a href="${opts.url}" style="color:#16a34a;word-break:break-all;">${escape(opts.url)}</a></span>`,
  )

  return {
    to: opts.to,
    subject: opts.firstAccess ? `${opts.app === 'games' ? 'My Box Games' : 'My Box'}: crie sua senha de acesso` : 'My Box: redefinição de senha',
    html: layout({
      theme,
      preheader: opts.firstAccess ? 'Seu acesso está pronto. Falta só criar a senha.' : 'Use o link para criar uma nova senha.',
      title,
      body: p(hello) + p(intro) + perks,
      button: { label: opts.firstAccess ? 'Criar minha senha' : 'Redefinir senha', url: opts.url },
      after,
    }),
    text: `${hello.replace(/&#39;/g, "'")}\n\n${intro.replace(/<[^>]+>/g, '')}\n\n${opts.firstAccess ? 'Criar senha' : 'Redefinir senha'}: ${opts.url}\n\nO link vale por ${opts.hours} horas.\n\nMy Box · myboxoficial.com.br`,
  }
}
