import { Link } from 'react-router-dom'
import { ArrowUpRight, BookOpen, Coffee, Dumbbell, Shirt, Users } from 'lucide-react'
import { SiteLayout } from '../components/site/SiteLayout'
import { stagger } from '../components/site/stagger'

export function NetworkPage() {
  return (
    <SiteLayout>
      <section className="relative isolate flex min-h-[88svh] items-end overflow-hidden bg-night text-foreground lg:min-h-[82svh]">
        <img
          src="/images/recepcao-1600.webp"
          srcSet="/images/recepcao-640.webp 640w, /images/recepcao-1024.webp 1024w, /images/recepcao-1600.webp 1600w"
          sizes="100vw"
          width="1600"
          height="896"
          alt="Projeto da recepção de uma unidade My Box com o leão da marca"
          loading="eager"
          decoding="sync"
          fetchPriority="high"
          className="hero-photo absolute inset-0 -z-10 size-full object-cover"
          style={{ objectPosition: '60% 35%' }}
        />
        <div className="scrim absolute inset-0 -z-10" />
        <div className="shell hero-enter pt-36 pb-14 lg:pb-20">
          <p className="eyebrow" style={stagger(0)}>
            A Rede My Box
          </p>
          <h1 className="display display-lg mt-5 max-w-[18ch]" style={stagger(1)}>
            Desde 2016, sempre à frente do mercado.
          </h1>
          <p className="lede mt-6" style={stagger(2)}>
            Uma revolução no mundo fitness: treinos que viram experiências, unidades que viram comunidades.
          </p>
        </div>
      </section>
      <section className="py-24 lg:py-36">
        <div className="shell">
          <h2 className="display display-lg max-w-[16ch]" data-reveal>
            De uma academia a uma das maiores redes do Brasil.
          </h2>
          <ol className="mt-16 grid gap-12 md:grid-cols-3 md:gap-8 lg:mt-24">
            <li className="relative border-t border-border-strong pt-8" data-reveal style={stagger(0)}>
              <span className="absolute -top-px left-0 h-0.5 w-16 bg-primary" aria-hidden />
              <p className="text-sm font-medium text-brand">Outubro de 2016</p>
              <h3 className="display display-sm mt-4">A primeira My Box</h3>
              <p className="mt-4 max-w-[40ch] text-muted-foreground">
                Daniel Ambiel idealiza uma forma mais acessível de praticar cross training, com metodologia própria, e
                abre a primeira academia da rede.
              </p>
            </li>
            <li className="relative border-t border-border-strong pt-8" data-reveal style={stagger(1)}>
              <span className="absolute -top-px left-0 h-0.5 w-16 bg-primary" aria-hidden />
              <p className="text-sm font-medium text-brand">Em menos de 5 anos</p>
              <h3 className="display display-sm mt-4">Uma das maiores redes do país</h3>
              <p className="mt-4 max-w-[40ch] text-muted-foreground">
                Testamos, validamos e levamos ao mercado um formato que virou tendência: treino com método,
                comunidade e atendimento de excelência.
              </p>
            </li>
            <li className="relative border-t border-border-strong pt-8" data-reveal style={stagger(2)}>
              <span className="absolute -top-px left-0 h-0.5 w-16 bg-primary" aria-hidden />
              <p className="text-sm font-medium text-brand">Hoje</p>
              <h3 className="display display-sm mt-4">92 unidades em 12 estados</h3>
              <p className="mt-4 max-w-[40ch] text-muted-foreground">
                Mais de 50 mil alunos treinando em 67 cidades, com o mesmo método em todas as unidades.
              </p>
            </li>
          </ol>
        </div>
      </section>
      <section id="conceito" className="bg-muted py-24 lg:py-36">
        <div className="shell grid gap-14 lg:grid-cols-12 lg:items-center">
          <figure className="lg:col-span-7" data-reveal>
            <div className="media aspect-[16/10]">
              <img
                src="/images/fachada-2-1307.webp"
                srcSet="/images/fachada-2-640.webp 640w, /images/fachada-2-1024.webp 1024w, /images/fachada-2-1307.webp 1307w"
                sizes="(min-width:1024px) 58vw, 100vw"
                width="1307"
                height="734"
                alt="Projeto de uma unidade My Box com restaurante e quadras ao lado"
                loading="lazy"
                decoding="async"
                fetchPriority="auto"
              />
            </div>
            <figcaption className="mt-3 text-xs text-subtle">
              Projeto arquitetônico: Flavia Rucelle Arquitetura Fitness.
            </figcaption>
          </figure>
          <div className="lg:col-span-5">
            <h2 className="display display-md" data-reveal>
              Mais que um lugar para treinar.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground" data-reveal style={stagger(1)}>
              Transformamos o tempo dedicado à atividade física em uma experiência prazerosa. Aqui as pessoas não apenas
              treinam: elas se sentem à vontade, são atendidas com excelência, tomam um café ou relaxam com um bom
              livro.
            </p>
            <ul className="mt-10 flex flex-wrap gap-2" data-reveal style={stagger(2)}>
              <li className="chip">
                <Dumbbell size={18} className="text-brand" aria-hidden />
                Treino com método
              </li>
              <li className="chip">
                <Coffee size={18} className="text-brand" aria-hidden />
                My Coffee
              </li>
              <li className="chip">
                <BookOpen size={18} className="text-brand" aria-hidden />
                Área de leitura
              </li>
              <li className="chip">
                <Shirt size={18} className="text-brand" aria-hidden />
                Loja de acessórios e roupas
              </li>
              <li className="chip">
                <Users size={18} className="text-brand" aria-hidden />
                Comunidade acolhedora
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section id="fundadores" className="py-24 lg:py-36">
        <div className="shell">
          <h2 className="display display-lg" data-reveal>
            Quem fundou a My Box.
          </h2>
          <div className="mt-16 grid gap-16 md:grid-cols-2 md:gap-10 lg:mt-24 lg:gap-20">
            <article className="" data-reveal style={stagger(0)}>
              <div className="media media-zoom aspect-[4/5]">
                <img
                  src="/images/daniel-ambiel-1066.webp"
                  srcSet="/images/daniel-ambiel-640.webp 640w, /images/daniel-ambiel-1024.webp 1024w, /images/daniel-ambiel-1066.webp 1066w"
                  sizes="(min-width:768px) 45vw, 100vw"
                  width="1066"
                  height="1599"
                  alt="Retrato de Daniel Ambiel"
                  loading="lazy"
                  decoding="async"
                  fetchPriority="auto"
                  className="object-[50%_20%]"
                />
              </div>
              <h3 className="display display-sm mt-8">Daniel Ambiel</h3>
              <p className="mt-1 text-sm font-medium text-brand">Fundador da Rede My Box</p>
              <p className="mt-5 max-w-[52ch] leading-relaxed text-muted-foreground">
                Formado em Educação Física e pós-graduado em Fisiologia do Exercício. Apaixonado pela prática do cross
                training, idealizou uma forma mais acessível para a prática do esporte, com metodologia própria, e abriu
                a primeira academia da Rede My Box em outubro de 2016.
              </p>
            </article>
            <article className="md:mt-32" data-reveal style={stagger(1)}>
              <div className="media media-zoom aspect-[4/5]">
                <img
                  src="/images/gabriela-ambiel-1066.webp"
                  srcSet="/images/gabriela-ambiel-640.webp 640w, /images/gabriela-ambiel-1024.webp 1024w, /images/gabriela-ambiel-1066.webp 1066w"
                  sizes="(min-width:768px) 45vw, 100vw"
                  width="1066"
                  height="1600"
                  alt="Retrato de Gabriela Ambiel"
                  loading="lazy"
                  decoding="async"
                  fetchPriority="auto"
                  className="object-[50%_20%]"
                />
              </div>
              <h3 className="display display-sm mt-8">Gabriela Ambiel</h3>
              <p className="mt-1 text-sm font-medium text-brand">Cofundadora da Rede My Box</p>
              <p className="mt-5 max-w-[52ch] leading-relaxed text-muted-foreground">
                Formada em Direito e Life Coach (Master e Practitioner). Teve a vida transformada pelo cross training.
                Atua também na área de mindset, para uma transformação em todas as áreas da vida, e na orientação
                alimentar e nutricional.
              </p>
            </article>
          </div>
        </div>
      </section>
      <section className="border-t py-24 lg:py-36">
        <div className="shell">
          <p className="eyebrow" data-reveal>
            No que acreditamos
          </p>
          <div className="mt-10">
            <div
              className="grid gap-4 border-b py-10 first:border-t md:grid-cols-12 md:gap-8 lg:py-14"
              data-reveal
              style={stagger(0)}
            >
              <h3 className="display display-md md:col-span-5">Inovação constante</h3>
              <p className="max-w-[52ch] text-lg leading-relaxed text-muted-foreground md:col-span-6 md:col-start-7">
                Desde 2016 a My Box passou por muitas mudanças, sempre à frente do mercado fitness. Testamos antes,
                lançamos depois.
              </p>
            </div>
            <div
              className="grid gap-4 border-b py-10 first:border-t md:grid-cols-12 md:gap-8 lg:py-14"
              data-reveal
              style={stagger(1)}
            >
              <h3 className="display display-md md:col-span-5">Comunidade</h3>
              <p className="max-w-[52ch] text-lg leading-relaxed text-muted-foreground md:col-span-6 md:col-start-7">
                Transformamos unidades em comunidades. Cada pessoa precisa se sentir abraçada pela escolha que fez.
              </p>
            </div>
            <div
              className="grid gap-4 border-b py-10 first:border-t md:grid-cols-12 md:gap-8 lg:py-14"
              data-reveal
              style={stagger(2)}
            >
              <h3 className="display display-md md:col-span-5">Rede cristã</h3>
              <p className="max-w-[52ch] text-lg leading-relaxed text-muted-foreground md:col-span-6 md:col-start-7">
                Acreditamos que nossa marca nasceu no coração de Deus, e honramos com excelência o que Ele nos confiou.
                Nossas ações são guiadas por princípios bíblicos.
              </p>
            </div>
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
          <h2 className="display display-lg max-w-[16ch]">Seu próximo treino começa perto de você.</h2>
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
