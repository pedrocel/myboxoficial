import { useState, type CSSProperties, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, BookOpen, Coffee, Search, Shirt } from 'lucide-react'
import { SiteLayout } from '../components/site/SiteLayout'
import { useUnits } from '../hooks/useUnits'
import { getUnitCities, groupUnitsByState, pluralUnits } from '../lib/units'
import { stagger } from '../components/site/stagger'

export function HomePage() {
  const { units } = useUnits()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const states = groupUnitsByState(units)
  const cities = getUnitCities(units)
  // Enquanto a lista carrega, mostra os numeros publicados da rede.
  const stats = units.length ? { units: units.length, states: states.length } : { units: 92, states: 12 }

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    const termo = query.trim()
    navigate(termo ? `/unidades?q=${encodeURIComponent(termo)}` : '/unidades')
  }

  return (
    <SiteLayout>
      <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-night text-foreground">
        <img
          src="/images/hero-barbell-1600.webp"
          srcSet="/images/hero-barbell-640.webp 640w, /images/hero-barbell-1024.webp 1024w, /images/hero-barbell-1600.webp 1600w, /images/hero-barbell-2400.webp 2400w"
          sizes="100vw"
          width="2400"
          height="1602"
          alt="Atleta segurando uma barra olímpica em um box de treino"
          loading="eager"
          decoding="sync"
          fetchPriority="high"
          className="hero-photo absolute inset-0 -z-10 size-full object-cover object-[62%_35%]"
        />
        <div className="scrim absolute inset-0 -z-10" />
        <div className="shell hero-enter pt-32 pb-14 lg:pb-24">
          <p className="eyebrow" style={stagger(0)}>
            Desde 2016
          </p>
          <h1 className="display mt-5 max-w-[19ch] text-[clamp(2.6rem,5.6vw,5.6rem)]" style={stagger(1)}>
            Mudando a forma como o Brasil treina.
          </h1>
          <p className="lede mt-6" style={stagger(2)}>
            Cross training, musculação e aulas coletivas em uma academia com conceito de shopping.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row" style={stagger(3)}>
            <Link className="btn" to="/unidades">
              Encontrar unidade
              <ArrowUpRight size={18} className="btn-icon" aria-hidden />
            </Link>
            <Link className="btn btn-on-photo" to="/franquia">
              Seja franqueado
            </Link>
          </div>
        </div>
      </section>
      <section className="border-b" aria-label="A rede em números">
        <dl className="shell grid grid-cols-2 gap-px bg-border px-0! lg:grid-cols-4">
          <div className="bg-background px-[clamp(1rem,4vw,3.5rem)] py-10 lg:py-14" data-reveal style={stagger(0)}>
            <dt className="text-sm text-muted-foreground">unidades abertas</dt>
            <dd className="display display-lg mt-3">
              <span>{stats.units}</span>
              <span className="text-brand" />
            </dd>
          </div>
          <div className="bg-background px-[clamp(1rem,4vw,3.5rem)] py-10 lg:py-14" data-reveal style={stagger(1)}>
            <dt className="text-sm text-muted-foreground">estados brasileiros</dt>
            <dd className="display display-lg mt-3">
              <span>{stats.states}</span>
              <span className="text-brand" />
            </dd>
          </div>
          <div className="bg-background px-[clamp(1rem,4vw,3.5rem)] py-10 lg:py-14" data-reveal style={stagger(2)}>
            <dt className="text-sm text-muted-foreground">alunos treinando</dt>
            <dd className="display display-lg mt-3">
              <span>50</span>
              <span className="text-brand"> mil+</span>
            </dd>
          </div>
          <div className="bg-background px-[clamp(1rem,4vw,3.5rem)] py-10 lg:py-14" data-reveal style={stagger(3)}>
            <dt className="text-sm text-muted-foreground">ano da primeira unidade</dt>
            <dd className="display display-lg mt-3">
              2016
              <span className="text-brand" />
            </dd>
          </div>
        </dl>
      </section>
      <section className="py-24 lg:py-36">
        <div className="shell">
          <h2 className="display display-lg max-w-[15ch]" data-reveal>
            Uma academia com conceito de shopping.
          </h2>
          <p className="lede mt-6" data-reveal style={stagger(1)}>
            Aqui você treina, toma um bom café, relaxa com um livro e encontra a sua comunidade. Tudo no mesmo lugar,
            com atendimento de excelência.
          </p>
          <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4 lg:grid-rows-[minmax(17rem,auto)_minmax(17rem,auto)]">
            <Link
              className="media media-zoom theme-night group relative isolate min-h-[26rem] text-foreground sm:col-span-2 lg:row-span-2 lg:min-h-0"
              data-reveal
              to="/treinos"
            >
              <img
                src="/images/group-barbells-1600.webp"
                srcSet="/images/group-barbells-640.webp 640w, /images/group-barbells-1024.webp 1024w, /images/group-barbells-1600.webp 1600w, /images/group-barbells-2400.webp 2400w"
                sizes="(min-width:1024px) 50vw, 100vw"
                width="2400"
                height="1401"
                alt="Turma treinando com barras em uma aula"
                loading="lazy"
                decoding="async"
                fetchPriority="auto"
                className="absolute inset-0 -z-10"
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-night/90 via-night/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-7 lg:p-10">
                <div>
                  <h3 className="display display-md">Treino com método</h3>
                  <p className="mt-3 max-w-[38ch] text-muted-foreground">
                    Cross training, musculação e aulas coletivas, guiados por uma metodologia própria.
                  </p>
                </div>
                <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform duration-500 group-hover:rotate-45">
                  <ArrowUpRight size={20} aria-hidden />
                </span>
              </div>
            </Link>
            <div
              className="media theme-night relative isolate min-h-[17rem] text-foreground sm:col-span-2"
              data-reveal
              style={stagger(1)}
            >
              <img
                src="/images/coffee-1600.webp"
                srcSet="/images/coffee-640.webp 640w, /images/coffee-1024.webp 1024w, /images/coffee-1600.webp 1600w, /images/coffee-2400.webp 2400w"
                sizes="(min-width:1024px) 50vw, 100vw"
                width="2400"
                height="1600"
                alt="Duas xícaras de café com arte no leite"
                loading="lazy"
                decoding="async"
                fetchPriority="auto"
                className="absolute inset-0 -z-10"
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-night/85 via-night/40 to-transparent" />
              <div className="flex h-full flex-col justify-end p-7">
                <Coffee size={28} className="text-brand" aria-hidden />
                <h3 className="display display-sm mt-4">My Coffee</h3>
                <p className="mt-2 max-w-[30ch] text-muted-foreground">
                  Café de qualidade para antes ou depois do treino.
                </p>
              </div>
            </div>
            <div
              className="media theme-night relative isolate min-h-[17rem] text-foreground"
              data-reveal
              style={stagger(2)}
            >
              <img
                src="/images/books-1600.webp"
                srcSet="/images/books-640.webp 640w, /images/books-1024.webp 1024w, /images/books-1600.webp 1600w, /images/books-2400.webp 2400w"
                sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw"
                width="2400"
                height="1407"
                alt="Estante cheia de livros"
                loading="lazy"
                decoding="async"
                fetchPriority="auto"
                className="absolute inset-0 -z-10"
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-night/90 to-night/20" />
              <div className="flex h-full flex-col justify-end p-7">
                <BookOpen size={28} className="text-brand" aria-hidden />
                <h3 className="display display-sm mt-4">Área de leitura</h3>
                <p className="mt-2 text-muted-foreground">Um espaço para relaxar e se inspirar.</p>
              </div>
            </div>
            <a
              href="https://www.lojamybox.com/"
              target="_blank"
              rel="noopener"
              className="group relative flex min-h-[17rem] flex-col justify-between overflow-hidden rounded-media bg-primary p-7 text-primary-foreground"
              data-reveal
              style={stagger(3)}
            >
              <span
                className="logo-mark pointer-events-none absolute -right-10 -bottom-6 w-64 text-night opacity-10"
                aria-hidden
              />
              <Shirt size={28} aria-hidden />
              <div>
                <h3 className="display display-sm">Loja My Box</h3>
                <p className="mt-2">Acessórios e roupas exclusivas.</p>
                <span className="mt-5 inline-flex items-center gap-2 font-semibold">
                  Visitar a loja
                  <ArrowUpRight
                    size={16}
                    className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1"
                    aria-hidden
                  />
                </span>
              </div>
            </a>
          </div>
        </div>
      </section>
      <section className="bg-muted py-24 lg:py-36">
        <div className="shell">
          <h2 className="display display-lg" data-reveal>
            Três formas de treinar.
          </h2>
          <div
            className="accordion mt-14 flex flex-col gap-3 lg:mt-20 lg:h-[38rem] lg:flex-row"
            data-reveal
            style={stagger(1)}
          >
            <Link
              className="panel media theme-night group relative isolate min-h-[24rem] text-foreground lg:min-h-0 lg:flex-1"
              to="/treinos#musculacao"
            >
              <img
                src="/images/muscle-curl-1600.webp"
                srcSet="/images/muscle-curl-640.webp 640w, /images/muscle-curl-1024.webp 1024w, /images/muscle-curl-1600.webp 1600w, /images/muscle-curl-2400.webp 2400w"
                sizes="(min-width:1024px) 60vw, 100vw"
                width="2400"
                height="1600"
                alt=""
                loading="lazy"
                decoding="async"
                fetchPriority="auto"
                className="absolute inset-0 -z-10 transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-105"
                style={{ objectPosition: '50% 30%' }}
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-night/95 via-night/35 to-night/5" />
              <div className="absolute inset-x-0 bottom-0 p-7 lg:p-9">
                <h3 className="display display-md">Musculação</h3>
                <div className="panel-body">
                  <p className="mt-3 max-w-[40ch] text-muted-foreground">
                    Academia de musculação como você nunca viu. Equipamentos modernos e um ambiente que motiva.
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 font-semibold text-brand">
                    Saiba mais <ArrowRight size={16} aria-hidden />
                  </span>
                </div>
              </div>
            </Link>
            <Link
              className="panel media theme-night group relative isolate min-h-[24rem] text-foreground lg:min-h-0 lg:flex-1"
              to="/treinos#cross-training"
            >
              <img
                src="/images/cross-ropes-1600.webp"
                srcSet="/images/cross-ropes-640.webp 640w, /images/cross-ropes-1024.webp 1024w, /images/cross-ropes-1600.webp 1600w, /images/cross-ropes-2400.webp 2400w"
                sizes="(min-width:1024px) 60vw, 100vw"
                width="2400"
                height="3593"
                alt=""
                loading="lazy"
                decoding="async"
                fetchPriority="auto"
                className="absolute inset-0 -z-10 transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-105"
                style={{ objectPosition: '50% 50%' }}
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-night/95 via-night/35 to-night/5" />
              <div className="absolute inset-x-0 bottom-0 p-7 lg:p-9">
                <h3 className="display display-md">Cross Training</h3>
                <div className="panel-body">
                  <p className="mt-3 max-w-[40ch] text-muted-foreground">
                    Metodologia própria e o mesmo treino do dia em todas as unidades da rede.
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 font-semibold text-brand">
                    Saiba mais <ArrowRight size={16} aria-hidden />
                  </span>
                </div>
              </div>
            </Link>
            <Link
              className="panel media theme-night group relative isolate min-h-[24rem] text-foreground lg:min-h-0 lg:flex-1"
              to="/treinos#aulas-coletivas"
            >
              <img
                src="/images/group-mats-1600.webp"
                srcSet="/images/group-mats-640.webp 640w, /images/group-mats-1024.webp 1024w, /images/group-mats-1600.webp 1600w, /images/group-mats-2400.webp 2400w"
                sizes="(min-width:1024px) 60vw, 100vw"
                width="2400"
                height="1600"
                alt=""
                loading="lazy"
                decoding="async"
                fetchPriority="auto"
                className="absolute inset-0 -z-10 transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-105"
                style={{ objectPosition: '40% 50%' }}
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-night/95 via-night/35 to-night/5" />
              <div className="absolute inset-x-0 bottom-0 p-7 lg:p-9">
                <h3 className="display display-md">Aulas coletivas</h3>
                <div className="panel-body">
                  <p className="mt-3 max-w-[40ch] text-muted-foreground">
                    Aulas pensadas para criar comunidade, com opções para cada pessoa se sentir em casa.
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 font-semibold text-brand">
                    Saiba mais <ArrowRight size={16} aria-hidden />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>
      <section className="py-24 lg:py-36">
        <div className="shell grid items-center gap-14 lg:grid-cols-12">
          <div className="lg:col-span-6 xl:col-span-5">
            <h2 className="display display-lg" data-reveal>
              O mesmo treino. Em todas as unidades. Todos os dias.
            </h2>
            <p className="lede mt-8" data-reveal style={stagger(1)}>
              Uma metodologia própria, testada e validada por mais de um milhão de alunos. Você treina com a mesma
              qualidade em qualquer My Box do país.
            </p>
            <Link className="link-arrow mt-10" data-reveal style={stagger(2)} to="/treinos">
              Conheça os treinos <ArrowRight size={18} aria-hidden />
            </Link>
          </div>
          <div className="media parallax aspect-[4/5] lg:col-span-6 lg:col-start-7" data-reveal style={stagger(1)}>
            <img
              src="/images/cross-overhead-1600.webp"
              srcSet="/images/cross-overhead-640.webp 640w, /images/cross-overhead-1024.webp 1024w, /images/cross-overhead-1600.webp 1600w, /images/cross-overhead-2400.webp 2400w"
              sizes="(min-width:1024px) 50vw, 100vw"
              width="2400"
              height="1602"
              alt="Atleta erguendo uma barra acima da cabeça"
              loading="lazy"
              decoding="async"
              fetchPriority="auto"
            />
          </div>
        </div>
      </section>
      <section
        className="marquee overflow-hidden border-y py-8"
        aria-label={`Cidades com My Box: ${cities.join(', ')}`}
      >
        <div
          className="marquee-track flex w-max items-center"
          style={{ '--marquee-duration': '140s' } as CSSProperties}
          aria-hidden
        >
          {[...cities, ...cities].map((city, i) => (
            <span key={i} className="display display-sm flex items-center gap-8 pr-8 whitespace-nowrap text-subtle">
              {city}
              <span className="size-2 rotate-45 bg-primary" />
            </span>
          ))}
        </div>
      </section>
      <section className="py-24 lg:py-36">
        <div className="shell grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="display display-lg max-w-[12ch]" data-reveal>
              E aí, onde você quer treinar?
            </h2>
            <form role="search" className="mt-10" data-reveal style={stagger(1)} onSubmit={handleSearch}>
              <label htmlFor="home-search" className="text-sm font-medium text-muted-foreground">
                Cidade, bairro ou nome da unidade
              </label>
              <div className="relative mt-3">
                <input
                  id="home-search"
                  type="search"
                  className="input pr-16"
                  placeholder="Ex.: Ribeirão Preto"
                  autoComplete="off"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute top-1.5 right-1.5 inline-flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground"
                  aria-label="Buscar unidade"
                >
                  <Search size={18} aria-hidden />
                </button>
              </div>
            </form>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <ul className="grid gap-x-10 sm:grid-cols-2" data-reveal style={stagger(2)}>
              {states.map((state) => (
                <li key={state.uf}>
                  <Link
                    className="group flex items-baseline justify-between gap-4 border-b py-4 transition-colors hover:border-primary"
                    to={`/unidades?uf=${state.uf}`}
                  >
                    <span className="text-lg font-medium transition-colors group-hover:text-brand">{state.name}</span>
                    <span className="text-sm text-subtle tabular-nums">{pluralUnits(state.units.length)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <section className="relative isolate overflow-hidden bg-night text-foreground">
        <img
          src="/images/fachada-1-1310.webp"
          srcSet="/images/fachada-1-640.webp 640w, /images/fachada-1-1024.webp 1024w, /images/fachada-1-1310.webp 1310w"
          sizes="100vw"
          width="1310"
          height="735"
          alt="Projeto de fachada de uma unidade My Box à noite"
          loading="lazy"
          decoding="async"
          fetchPriority="auto"
          className="absolute inset-0 -z-10 size-full object-cover object-[70%_50%]"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-night via-night/80 to-night/10" />
        <div className="shell grid gap-12 py-28 lg:grid-cols-12 lg:py-40">
          <div className="lg:col-span-7">
            <p className="eyebrow" data-reveal>
              Oportunidade de negócio
            </p>
            <h2 className="display display-lg mt-5 max-w-[14ch]" data-reveal style={stagger(1)}>
              Faça parte da família My Box.
            </h2>
            <p className="lede mt-6" data-reveal style={stagger(2)}>
              O sucesso da rede está se multiplicando, e essa é a sua oportunidade de fazer parte dessa história.
            </p>
            <dl className="mt-12 grid max-w-xl grid-cols-2 gap-8" data-reveal style={stagger(3)}>
              <div className="border-t border-border-strong pt-5">
                <dt className="text-sm text-muted-foreground">Retorno estimado</dt>
                <dd className="display display-md mt-2">24 meses</dd>
              </div>
              <div className="border-t border-border-strong pt-5">
                <dt className="text-sm text-muted-foreground">Lucratividade de até</dt>
                <dd className="display display-md mt-2">40%</dd>
              </div>
            </dl>
            <Link className="btn mt-12" data-reveal style={stagger(4)} to="/franquia">
              Seja franqueado
              <ArrowUpRight size={18} className="btn-icon" aria-hidden />
            </Link>
          </div>
        </div>
        <p className="shell pb-6 text-xs text-subtle">Projeto arquitetônico: Flavia Rucelle Arquitetura Fitness.</p>
      </section>
    </SiteLayout>
  )
}
