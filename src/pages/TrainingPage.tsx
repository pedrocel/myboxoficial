import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, CircleCheck, Clock } from 'lucide-react'
import { SiteLayout } from '../components/site/SiteLayout'
import { stagger } from '../components/site/stagger'

export function TrainingPage() {
  return (
    <SiteLayout>
      <section className="relative isolate flex min-h-[88svh] items-end overflow-hidden bg-night text-foreground lg:min-h-[82svh]">
        <img
          src="/images/interior-1600.webp"
          srcSet="/images/interior-640.webp 640w, /images/interior-1024.webp 1024w, /images/interior-1600.webp 1600w"
          sizes="100vw"
          width="1600"
          height="897"
          alt="Projeto do interior de uma unidade My Box"
          loading="eager"
          decoding="sync"
          fetchPriority="high"
          className="hero-photo absolute inset-0 -z-10 size-full object-cover"
          style={{ objectPosition: '50% 55%' }}
        />
        <div className="scrim absolute inset-0 -z-10" />
        <div className="shell hero-enter pt-36 pb-14 lg:pb-20">
          <p className="eyebrow" style={stagger(0)}>
            Treinos
          </p>
          <h1 className="display display-lg mt-5 max-w-[18ch]" style={stagger(1)}>
            Três formas de treinar. Uma só comunidade.
          </h1>
          <p className="lede mt-6" style={stagger(2)}>
            Escolha o seu ritmo. O método, o cuidado e a energia são os mesmos em qualquer unidade.
          </p>
        </div>
      </section>
      <nav
        aria-label="Seções da página"
        className="sticky top-[68px] z-30 border-b bg-background/85 backdrop-blur-lg lg:top-[76px]"
      >
        <ul className="shell flex gap-2 overflow-x-auto py-3 [scrollbar-width:none]">
          <li>
            <a href="#musculacao" className="chip whitespace-nowrap">
              Musculação
            </a>
          </li>
          <li>
            <a href="#cross-training" className="chip whitespace-nowrap">
              Cross Training
            </a>
          </li>
          <li>
            <a href="#aulas-coletivas" className="chip whitespace-nowrap">
              Aulas coletivas
            </a>
          </li>
          <li>
            <a href="#horarios" className="chip whitespace-nowrap">
              Horários
            </a>
          </li>
        </ul>
      </nav>
      <section id="musculacao" className="scroll-mt-36 py-24 lg:py-36">
        <div className="shell grid items-center gap-14 lg:grid-cols-12">
          <div className="grid grid-cols-5 gap-3 lg:col-span-7" data-reveal>
            <div className="media col-span-3 aspect-[3/4]">
              <img
                src="/images/daniel-box-1024.webp"
                srcSet="/images/daniel-box-640.webp 640w, /images/daniel-box-1024.webp 1024w, /images/daniel-box-1600.webp 1600w"
                sizes="(min-width:1024px) 35vw, 60vw"
                width="1024"
                height="1536"
                alt="Daniel Ambiel no box da My Box, em frente ao mural do leão"
                loading="lazy"
                decoding="async"
                fetchPriority="auto"
              />
            </div>
            <div className="media col-span-2 mt-16 aspect-[3/4]">
              <img
                src="/images/recepcao-1600.webp"
                srcSet="/images/recepcao-640.webp 640w, /images/recepcao-1024.webp 1024w, /images/recepcao-1600.webp 1600w"
                sizes="(min-width:1024px) 22vw, 40vw"
                width="1600"
                height="896"
                alt="Projeto da recepção de uma unidade My Box com o leão da marca"
                loading="lazy"
                decoding="async"
                fetchPriority="auto"
              />
            </div>
          </div>
          <div className="lg:col-span-5">
            <h2 className="display display-lg" data-reveal>
              Musculação
            </h2>
            <p className="lede mt-6" data-reveal style={stagger(1)}>
              Academia de musculação como você nunca viu. Equipamentos modernos e um ambiente motivador para você
              alcançar os seus objetivos.
            </p>
            <ul className="mt-10 grid gap-4" data-reveal style={stagger(2)}>
              <li className="flex items-center gap-3 text-lg">
                <CircleCheck size={22} className="shrink-0 text-brand" aria-hidden />
                Equipamentos modernos
              </li>
              <li className="flex items-center gap-3 text-lg">
                <CircleCheck size={22} className="shrink-0 text-brand" aria-hidden />
                Ambiente que motiva a voltar
              </li>
              <li className="flex items-center gap-3 text-lg">
                <CircleCheck size={22} className="shrink-0 text-brand" aria-hidden />
                Treino focado no seu objetivo
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section id="cross-training" className="relative isolate scroll-mt-36 overflow-hidden bg-night text-foreground">
        <div className="parallax absolute inset-0 -z-10">
          <img
            src="/images/professor-mural-1600.webp"
            srcSet="/images/professor-mural-640.webp 640w, /images/professor-mural-1024.webp 1024w, /images/professor-mural-1600.webp 1600w"
            sizes="100vw"
            width="1600"
            height="1067"
            alt=""
            loading="lazy"
            decoding="async"
            fetchPriority="auto"
            className="size-full object-cover"
          />
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-night via-night/75 to-night/30" />
        <div className="shell grid min-h-[90svh] content-end gap-12 py-24 lg:grid-cols-12 lg:py-32">
          <div className="lg:col-span-8">
            <h2 className="display display-xl" data-reveal>
              Cross Training
            </h2>
            <p className="lede mt-6" data-reveal style={stagger(1)}>
              Metodologia própria, testada e validada por mais de um milhão de alunos. Todas as unidades recebem o mesmo
              treino, todos os dias.
            </p>
          </div>
          <dl
            className="grid grid-cols-2 gap-8 border-t border-border-strong pt-8 lg:col-span-12 lg:grid-cols-3"
            data-reveal
            style={stagger(2)}
          >
            <div>
              <dt className="text-sm text-muted-foreground">Alunos que validaram o método</dt>
              <dd className="display display-md mt-2">1 milhão+</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Treino do dia</dt>
              <dd className="display display-md mt-2">O mesmo na rede toda</dd>
            </div>
            <div className="col-span-2 lg:col-span-1">
              <dt className="text-sm text-muted-foreground">Unidades com o mesmo método</dt>
              <dd className="display display-md mt-2">92</dd>
            </div>
          </dl>
        </div>
      </section>
      <section id="aulas-coletivas" className="scroll-mt-36 py-24 lg:py-36">
        <div className="shell grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5 lg:pt-10">
            <h2 className="display display-lg" data-reveal>
              Aulas coletivas
            </h2>
            <p className="lede mt-6" data-reveal style={stagger(1)}>
              O objetivo das aulas coletivas é criar comunidade: um ecossistema de opções para que cada pessoa se sinta
              abraçada pela escolha que fez.
            </p>
            <Link className="link-arrow mt-10" data-reveal style={stagger(2)} to="/unidades">
              Encontrar unidade <ArrowRight size={18} aria-hidden />
            </Link>
          </div>
          <div className="relative lg:col-span-7" data-reveal style={stagger(1)}>
            <div className="media aspect-[16/11] w-[88%]">
              <img
                src="/images/fachada-2-1307.webp"
                srcSet="/images/fachada-2-640.webp 640w, /images/fachada-2-1024.webp 1024w, /images/fachada-2-1307.webp 1307w"
                sizes="(min-width:1024px) 50vw, 90vw"
                width="1307"
                height="734"
                alt="Projeto de uma unidade My Box"
                loading="lazy"
                decoding="async"
                fetchPriority="auto"
              />
            </div>
            <div className="media absolute right-0 -bottom-12 aspect-square w-[42%] border-8 border-background">
              <img
                src="/images/daniel-box-1024.webp"
                srcSet="/images/daniel-box-640.webp 640w, /images/daniel-box-1024.webp 1024w, /images/daniel-box-1600.webp 1600w"
                sizes="(min-width:1024px) 25vw, 45vw"
                width="1024"
                height="1536"
                alt="Daniel Ambiel no box da My Box, em frente ao mural do leão"
                loading="lazy"
                decoding="async"
                fetchPriority="auto"
              />
            </div>
          </div>
        </div>
      </section>
      <section id="horarios" className="scroll-mt-36 bg-muted py-24 lg:py-36">
        <div className="shell grid items-center gap-14 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <h2 className="display display-lg max-w-[12ch]" data-reveal>
              Treine no seu horário.
            </h2>
            <dl className="mt-12 grid gap-px overflow-hidden rounded-media bg-border" data-reveal style={stagger(1)}>
              <div className="flex items-baseline justify-between gap-6 bg-card px-6 py-6">
                <dt className="text-lg text-muted-foreground">Segunda a sexta</dt>
                <dd className="display display-sm tabular-nums">06h às 23h</dd>
              </div>
              <div className="flex items-baseline justify-between gap-6 bg-card px-6 py-6">
                <dt className="text-lg text-muted-foreground">Sábado</dt>
                <dd className="display display-sm tabular-nums">08h às 18h</dd>
              </div>
              <div className="flex items-baseline justify-between gap-6 bg-card px-6 py-6">
                <dt className="text-lg text-muted-foreground">Domingo</dt>
                <dd className="display display-sm tabular-nums">09h às 15h</dd>
              </div>
            </dl>
            <p className="mt-5 flex items-center gap-2 text-sm text-subtle" data-reveal style={stagger(2)}>
              <Clock size={16} aria-hidden />
              Horário padrão da rede. Confirme o horário e a grade de aulas com a sua unidade.
            </p>
          </div>
          <div className="media aspect-[4/3] lg:col-span-5 lg:col-start-8" data-reveal style={stagger(1)}>
            <img
              src="/images/fachada-1-1310.webp"
              srcSet="/images/fachada-1-640.webp 640w, /images/fachada-1-1024.webp 1024w, /images/fachada-1-1310.webp 1310w"
              sizes="(min-width:1024px) 40vw, 100vw"
              width="1310"
              height="735"
              alt="Projeto de fachada de uma unidade My Box à noite"
              loading="lazy"
              decoding="async"
              fetchPriority="auto"
            />
          </div>
        </div>
      </section>
      <section className="relative isolate overflow-hidden bg-night text-foreground">
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
          className="absolute inset-0 -z-10 size-full object-cover object-[50%_60%] opacity-80"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-night via-night/70 to-transparent" />
        <div className="shell py-28 lg:py-40" data-reveal>
          <h2 className="display display-lg max-w-[16ch]">Escolha a unidade e comece hoje.</h2>
          <p className="lede mt-6">Encontre a unidade My Box mais próxima e fale direto com a equipe pelo WhatsApp.</p>
          <Link className="btn mt-10" to="/unidades">
            Encontrar unidade
            <ArrowUpRight size={18} className="btn-icon" aria-hidden />
          </Link>
        </div>
      </section>
    </SiteLayout>
  )
}
