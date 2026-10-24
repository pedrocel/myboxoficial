import { Link } from 'react-router-dom'
import { ArrowUpRight, Dumbbell, Handshake, Mail } from 'lucide-react'
import { SiteLayout } from '../components/site/SiteLayout'
import { stagger } from '../components/site/stagger'

export function ContactPage() {
  return (
    <SiteLayout solidHeader>
      <section className="pt-16 pb-24 lg:pt-24 lg:pb-36">
        <div className="shell">
          <h1 className="display display-xl max-w-[12ch]" data-reveal>
            Fale com a My Box.
          </h1>
          <p className="lede mt-6" data-reveal style={stagger(1)}>
            Escolha o assunto e a gente leva você até a pessoa certa.
          </p>
          <div className="mt-16 grid gap-3 lg:mt-24 lg:grid-cols-3">
            <Link
              className="group relative flex min-h-[22rem] flex-col justify-between overflow-hidden rounded-media p-8 transition-colors lg:p-10 bg-primary text-primary-foreground"
              data-reveal
              style={stagger(0)}
              to="/unidades"
            >
              <span className="inline-flex size-14 items-center justify-center rounded-full bg-night/10">
                <Dumbbell size={26} aria-hidden />
              </span>
              <div>
                <h2 className="display display-sm">Quero treinar</h2>
                <p className="mt-3 max-w-[36ch] text-primary-foreground/80">
                  Cada unidade atende direto pelo WhatsApp. Encontre a mais perto de você e fale com a equipe.
                </p>
                <span className="mt-8 inline-flex items-center gap-2 font-semibold">
                  Encontrar unidade
                  <ArrowUpRight
                    size={18}
                    className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
                    aria-hidden
                  />
                </span>
              </div>
            </Link>
            <Link
              className="group relative flex min-h-[22rem] flex-col justify-between overflow-hidden rounded-media p-8 transition-colors lg:p-10 border bg-card hover:border-primary"
              data-reveal
              style={stagger(1)}
              to="/franquia"
            >
              <span className="inline-flex size-14 items-center justify-center rounded-full bg-primary/15 text-brand">
                <Handshake size={26} aria-hidden />
              </span>
              <div>
                <h2 className="display display-sm">Quero abrir uma My Box</h2>
                <p className="mt-3 max-w-[36ch] text-muted-foreground">
                  Fale com a equipe de expansão e conheça o modelo de franquia da rede.
                </p>
                <span className="mt-8 inline-flex items-center gap-2 font-semibold">
                  Seja franqueado
                  <ArrowUpRight
                    size={18}
                    className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
                    aria-hidden
                  />
                </span>
              </div>
            </Link>
            <a
              href="mailto:unidade.mybox@gmail.com"
              className="group relative flex min-h-[22rem] flex-col justify-between overflow-hidden rounded-media p-8 transition-colors lg:p-10 border bg-card hover:border-primary"
              data-reveal
              style={stagger(2)}
            >
              <span className="inline-flex size-14 items-center justify-center rounded-full bg-primary/15 text-brand">
                <Mail size={26} aria-hidden />
              </span>
              <div>
                <h2 className="display display-sm">Outros assuntos</h2>
                <p className="mt-3 max-w-[36ch] text-muted-foreground">
                  Parcerias, imprensa ou dúvidas gerais sobre a rede.
                </p>
                <span className="mt-8 inline-flex items-center gap-2 font-semibold">
                  Enviar e-mail
                  <ArrowUpRight
                    size={18}
                    className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
                    aria-hidden
                  />
                </span>
              </div>
            </a>
          </div>
          <div className="mt-20 grid gap-10 border-t pt-12 md:grid-cols-3" data-reveal>
            <div>
              <h2 className="text-sm font-medium text-subtle">E-mail da rede</h2>
              <a href="mailto:unidade.mybox@gmail.com" className="link-arrow mt-3 text-lg break-all">
                unidade.mybox@gmail.com
              </a>
            </div>
            <div>
              <h2 className="text-sm font-medium text-subtle">Redes sociais</h2>
              <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-lg">
                <li>
                  <a
                    href="https://www.instagram.com/myboxoficial"
                    target="_blank"
                    rel="noopener"
                    className="link-arrow"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="https://www.facebook.com/redemybox/" target="_blank" rel="noopener" className="link-arrow">
                    Facebook
                  </a>
                </li>
                <li>
                  <a href="https://www.youtube.com/@RedeMyBox" target="_blank" rel="noopener" className="link-arrow">
                    YouTube
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-sm font-medium text-subtle">Alunos e unidades</h2>
              <Link to="/entrar" className="link-arrow mt-3 text-lg">
                Acessar o painel
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
