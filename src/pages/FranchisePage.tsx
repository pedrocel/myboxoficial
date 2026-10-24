import { ArrowDown, ChartLine, Coins, Cross, Hourglass, Store, TrendingUp } from 'lucide-react'
import { SiteLayout } from '../components/site/SiteLayout'
import { SocialIcon } from '../components/site/SocialIcon'
import { FRANCHISE_WHATSAPP } from '../components/site/site-links'
import { FranchiseForm } from '../components/site/FranchiseForm'
import { stagger } from '../components/site/stagger'

const FRANCHISE_WHATSAPP_URL = `https://wa.me/${FRANCHISE_WHATSAPP}?text=${encodeURIComponent('Olá! Tenho interesse em abrir uma academia My Box.')}`

export function FranchisePage() {
  return (
    <SiteLayout>
      <section className="relative isolate flex min-h-[88svh] items-end overflow-hidden bg-night text-foreground lg:min-h-[82svh]">
        <img
          src="/images/fachada-1-1310.webp"
          srcSet="/images/fachada-1-640.webp 640w, /images/fachada-1-1024.webp 1024w, /images/fachada-1-1310.webp 1310w"
          sizes="100vw"
          width="1310"
          height="735"
          alt="Projeto de fachada de uma unidade My Box à noite"
          loading="eager"
          decoding="sync"
          fetchPriority="high"
          className="hero-photo absolute inset-0 -z-10 size-full object-cover"
          style={{ objectPosition: '72% 50%' }}
        />
        <div className="scrim absolute inset-0 -z-10" />
        <div className="shell hero-enter pt-36 pb-14 lg:pb-20">
          <p className="eyebrow" style={stagger(0)}>
            Franquia My Box
          </p>
          <h1 className="display display-lg mt-5 max-w-[18ch]" style={stagger(1)}>
            Faça parte da família My Box.
          </h1>
          <p className="lede mt-6" style={stagger(2)}>
            Uma marca em expansão, com método validado e várias fontes de receita. Essa é a sua oportunidade.
          </p>
          <div style={stagger(3)}>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a href="#formulario" className="btn">
                Seja franqueado
                <ArrowDown size={18} aria-hidden />
              </a>
              <a href={FRANCHISE_WHATSAPP_URL} target="_blank" rel="noopener" className="btn btn-on-photo">
                <SocialIcon name="whatsapp" size={20} />
                Falar no WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
      <section aria-label="Indicadores da franquia" className="border-b">
        <dl className="shell grid grid-cols-2 gap-px bg-border px-0! lg:grid-cols-4">
          <div className="bg-background px-[clamp(1rem,4vw,3.5rem)] py-10 lg:py-14" data-reveal style={stagger(0)}>
            <dt className="text-sm text-muted-foreground">Lucratividade de até</dt>
            <dd className="display display-md mt-3">40%</dd>
          </div>
          <div className="bg-background px-[clamp(1rem,4vw,3.5rem)] py-10 lg:py-14" data-reveal style={stagger(1)}>
            <dt className="text-sm text-muted-foreground">Retorno estimado</dt>
            <dd className="display display-md mt-3">24 meses</dd>
          </div>
          <div className="bg-background px-[clamp(1rem,4vw,3.5rem)] py-10 lg:py-14" data-reveal style={stagger(2)}>
            <dt className="text-sm text-muted-foreground">Unidades abertas</dt>
            <dd className="display display-md mt-3">92</dd>
          </div>
          <div className="bg-background px-[clamp(1rem,4vw,3.5rem)] py-10 lg:py-14" data-reveal style={stagger(3)}>
            <dt className="text-sm text-muted-foreground">Estados</dt>
            <dd className="display display-md mt-3">12</dd>
          </div>
        </dl>
      </section>
      <section className="py-24 lg:py-36">
        <div className="shell">
          <h2 className="display display-lg max-w-[16ch]" data-reveal>
            Por que investir na Rede My Box?
          </h2>
          <div className="mt-16 grid gap-x-16 md:grid-cols-2 lg:mt-24">
            <div className="flex gap-6 border-t py-10" data-reveal style={stagger(0)}>
              <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/15 text-brand">
                <ChartLine size={26} aria-hidden />
              </span>
              <div>
                <h3 className="display display-sm">Alta rentabilidade</h3>
                <p className="mt-3 max-w-[46ch] leading-relaxed text-muted-foreground">
                  A lucratividade pode chegar a até 40%, o que torna o investimento muito atrativo para empreendedores.
                </p>
              </div>
            </div>
            <div className="flex gap-6 border-t py-10" data-reveal style={stagger(1)}>
              <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/15 text-brand">
                <Hourglass size={26} aria-hidden />
              </span>
              <div>
                <h3 className="display display-sm">Retorno rápido</h3>
                <p className="mt-3 max-w-[46ch] leading-relaxed text-muted-foreground">
                  Tempo estimado de retorno de aproximadamente 24 meses, ideal para quem busca um investimento de curto
                  a médio prazo.
                </p>
              </div>
            </div>
            <div className="flex gap-6 border-t py-10" data-reveal style={stagger(0)}>
              <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/15 text-brand">
                <Store size={26} aria-hidden />
              </span>
              <div>
                <h3 className="display display-sm">Marca em expansão</h3>
                <p className="mt-3 max-w-[46ch] leading-relaxed text-muted-foreground">
                  São 92 unidades em 12 estados, uma presença que traz estabilidade e reconhecimento de marca.
                </p>
              </div>
            </div>
            <div className="flex gap-6 border-t py-10" data-reveal style={stagger(1)}>
              <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/15 text-brand">
                <TrendingUp size={26} aria-hidden />
              </span>
              <div>
                <h3 className="display display-sm">Demanda crescente</h3>
                <p className="mt-3 max-w-[46ch] leading-relaxed text-muted-foreground">
                  O mercado de fitness e vida saudável segue em forte crescimento no Brasil, com demanda contínua por
                  saúde e bem-estar.
                </p>
              </div>
            </div>
            <div className="flex gap-6 border-t py-10" data-reveal style={stagger(0)}>
              <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/15 text-brand">
                <Coins size={26} aria-hidden />
              </span>
              <div>
                <h3 className="display display-sm">Várias fontes de receita</h3>
                <p className="mt-3 max-w-[46ch] leading-relaxed text-muted-foreground">
                  Além da mensalidade, a unidade fatura com Gympass, My Coffee, acessórios e roupas.
                </p>
              </div>
            </div>
            <div className="flex gap-6 border-t py-10" data-reveal style={stagger(1)}>
              <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/15 text-brand">
                <Cross size={26} aria-hidden />
              </span>
              <div>
                <h3 className="display display-sm">Rede cristã</h3>
                <p className="mt-3 max-w-[46ch] leading-relaxed text-muted-foreground">
                  Acreditamos que nossa marca nasceu no coração de Deus e honramos com excelência o que Ele nos confiou.
                  Nossas ações são guiadas por princípios bíblicos.
                </p>
              </div>
            </div>
          </div>
          <p className="mt-6 max-w-3xl text-sm text-subtle">
            Rentabilidade e prazo de retorno são estimativas e variam de acordo com a praça, o investimento e a gestão
            de cada unidade.
          </p>
        </div>
      </section>
      <section className="relative isolate overflow-hidden bg-night py-24 text-foreground lg:py-36">
        <img
          src="/images/fachada-3-1310.webp"
          srcSet="/images/fachada-3-640.webp 640w, /images/fachada-3-1024.webp 1024w, /images/fachada-3-1310.webp 1310w"
          sizes="100vw"
          width="1310"
          height="736"
          alt=""
          loading="lazy"
          decoding="async"
          fetchPriority="auto"
          className="absolute inset-0 -z-10 size-full object-cover opacity-30"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-night via-night/80 to-night" />
        <div className="shell">
          <h2 className="display display-lg max-w-[14ch]" data-reveal>
            Como começar.
          </h2>
          <ol className="mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
            <li className="border-t border-border-strong pt-8" data-reveal style={stagger(0)}>
              <span className="display display-lg text-primary" aria-hidden>
                1
              </span>
              <h3 className="display display-sm mt-6">Envie o seu interesse</h3>
              <p className="mt-3 max-w-[36ch] text-muted-foreground">
                Preencha o formulário com seus dados, cidade e investimento disponível.
              </p>
            </li>
            <li className="border-t border-border-strong pt-8" data-reveal style={stagger(1)}>
              <span className="display display-lg text-primary" aria-hidden>
                2
              </span>
              <h3 className="display display-sm mt-6">Analisamos a sua região</h3>
              <p className="mt-3 max-w-[36ch] text-muted-foreground">
                Nossa equipe de expansão avalia o potencial da praça que você escolheu.
              </p>
            </li>
            <li className="border-t border-border-strong pt-8" data-reveal style={stagger(2)}>
              <span className="display display-lg text-primary" aria-hidden>
                3
              </span>
              <h3 className="display display-sm mt-6">A gente entra em contato</h3>
              <p className="mt-3 max-w-[36ch] text-muted-foreground">
                Você recebe o retorno da equipe para seguir com a conversa sobre o projeto.
              </p>
            </li>
          </ol>
        </div>
        <p className="shell mt-16 text-xs text-subtle">Projetos arquitetônicos: Flavia Rucelle Arquitetura Fitness.</p>
      </section>
      <section id="formulario" className="scroll-mt-24 py-24 lg:py-36">
        <div className="shell grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="display display-lg max-w-[12ch]" data-reveal>
              Quero ser um franqueado.
            </h2>
            <p className="lede mt-6" data-reveal style={stagger(1)}>
              Conte um pouco sobre você e a cidade onde quer abrir a sua My Box. Se preferir, fale agora com a equipe de
              expansão.
            </p>
            <a
              href={FRANCHISE_WHATSAPP_URL}
              target="_blank"
              rel="noopener"
              className="link-arrow mt-8"
              data-reveal
              style={stagger(2)}
            >
              <span className="text-brand">
                <SocialIcon name="whatsapp" size={20} />
              </span>{' '}
              Falar no WhatsApp
            </a>
          </div>
          <div className="lg:col-span-7" data-reveal style={stagger(1)}>
            <FranchiseForm />
          </div>
        </div>
      </section>
    </SiteLayout>
  )
}
