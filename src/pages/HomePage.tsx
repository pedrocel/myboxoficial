import { useState, type CSSProperties, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, BookOpen, Coffee, Dumbbell, Flame, Search, Shirt, Users } from 'lucide-react'
import { SiteLayout } from '../components/site/SiteLayout'
import { useUnits } from '../hooks/useUnits'
import { getUnitCities, groupUnitsByState, pluralUnits } from '../lib/units'
import { stagger } from '../components/site/stagger'

const MODALIDADES = [
  {
    to: '/treinos#musculacao',
    Icon: Dumbbell,
    title: 'Musculação',
    text: 'Equipamentos modernos e acompanhamento para você evoluir no seu ritmo.',
  },
  {
    to: '/treinos#cross-training',
    Icon: Flame,
    title: 'Cross Training',
    text: 'Metodologia própria: o treino do dia é o mesmo em todas as unidades da rede.',
  },
  {
    to: '/treinos#aulas-coletivas',
    Icon: Users,
    title: 'Aulas coletivas',
    text: 'Turmas para treinar junto, criar amizade e manter a constância.',
  },
]

const DIFERENCIAIS = [
  { Icon: Dumbbell, title: 'Treino com método', text: 'Programação pensada pela rede e aplicada por professores em cada unidade.' },
  { Icon: Coffee, title: 'My Coffee', text: 'Um café de qualidade para antes ou depois do treino.' },
  { Icon: BookOpen, title: 'Espaço de leitura', text: 'Um canto para desacelerar e ficar mais um pouco.' },
  { Icon: Shirt, title: 'Loja My Box', text: 'Roupas e acessórios da marca, na unidade e online.' },
]

const FUNDADORES = [
  {
    name: 'Daniel Ambiel',
    role: 'Fundador',
    photo: 'daniel-ambiel',
    text: 'Professor de Educação Física e pós-graduado em Fisiologia do Exercício. Criou a metodologia da rede e abriu a primeira My Box em 2016.',
  },
  {
    name: 'Gabriela Ambiel',
    role: 'Cofundadora',
    photo: 'gabriela-ambiel',
    text: 'Formada em Direito e Life Coach. Cuida da cultura da rede e de tudo o que faz cada aluno se sentir em casa.',
  },
]

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
      <section className="hero-split relative isolate overflow-hidden bg-night text-foreground">
        <div className="shell grid items-center gap-12 pt-32 pb-16 lg:min-h-[100svh] lg:grid-cols-12 lg:pt-28 lg:pb-20">
          <div className="hero-enter lg:col-span-6">
            <p className="eyebrow" style={stagger(0)}>
              Rede My Box · desde 2016
            </p>
            <h1 className="display display-xl mt-6 max-w-[12ch]" style={stagger(1)}>
              Treino de verdade, <span className="text-brand">perto de você.</span>
            </h1>
            <p className="lede mt-6" style={stagger(2)}>
              Cross training, musculação e aulas coletivas com o mesmo método em {stats.units} unidades pelo Brasil.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row" style={stagger(3)}>
              <Link className="btn" to="/unidades">
                Encontrar unidade
                <ArrowUpRight size={18} className="btn-icon" aria-hidden />
              </Link>
              <Link className="btn btn-ghost" to="/franquia">
                Seja franqueado
              </Link>
            </div>
            <dl className="mt-14 grid max-w-lg grid-cols-3 gap-6 border-t border-border-strong pt-8" style={stagger(4)}>
              <div>
                <dt className="text-xs tracking-wide text-muted-foreground uppercase">Unidades</dt>
                <dd className="display display-md mt-1">{stats.units}</dd>
              </div>
              <div>
                <dt className="text-xs tracking-wide text-muted-foreground uppercase">Estados</dt>
                <dd className="display display-md mt-1">{stats.states}</dd>
              </div>
              <div>
                <dt className="text-xs tracking-wide text-muted-foreground uppercase">Alunos</dt>
                <dd className="display display-md mt-1">
                  50<span className="text-brand">mil+</span>
                </dd>
              </div>
            </dl>
          </div>
          <div className="relative lg:col-span-5 lg:col-start-8" data-reveal>
            <div className="media aspect-[4/5] shadow-2xl">
              <img
                src="/images/daniel-box-1024.webp"
                srcSet="/images/daniel-box-640.webp 640w, /images/daniel-box-1024.webp 1024w, /images/daniel-box-1600.webp 1600w"
                sizes="(min-width:1024px) 40vw, 100vw"
                width="1024"
                height="1536"
                alt="Daniel Ambiel, fundador da My Box, sentado num caixote em frente ao mural do leão"
                loading="eager"
                fetchPriority="high"
                className="hero-photo object-[50%_30%]"
              />
            </div>
            <div className="badge-card absolute -bottom-6 -left-4 sm:-left-8">
              <span className="display display-md text-primary-foreground">2016</span>
              <span className="text-sm font-semibold text-primary-foreground/80">a primeira My Box</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32">
        <div className="shell">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="eyebrow" data-reveal>
                Modalidades
              </p>
              <h2 className="display display-lg mt-5 max-w-[16ch]" data-reveal style={stagger(1)}>
                Escolha como você quer treinar.
              </h2>
            </div>
            <Link className="link-arrow" data-reveal style={stagger(2)} to="/treinos">
              Ver todos os treinos <ArrowRight size={18} aria-hidden />
            </Link>
          </div>
          <ol className="mt-14 grid gap-4 md:grid-cols-3">
            {MODALIDADES.map(({ to, Icon, title, text }, i) => (
              <li key={title} data-reveal style={stagger(i)}>
                <Link to={to} className="feature-card group">
                  <div className="flex items-start justify-between">
                    <span className="icon-tile">
                      <Icon size={26} aria-hidden />
                    </span>
                    <span className="display display-md text-border-strong">0{i + 1}</span>
                  </div>
                  <h3 className="display display-md mt-10">{title}</h3>
                  <p className="mt-3 text-muted-foreground">{text}</p>
                  <span className="mt-8 inline-flex items-center gap-2 font-semibold text-brand">
                    Saiba mais
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden />
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-muted py-24 lg:py-32">
        <div className="shell grid items-center gap-14 lg:grid-cols-12">
          <div className="media aspect-[4/3] lg:col-span-6" data-reveal>
            <img
              src="/images/interior-1600.webp"
              srcSet="/images/interior-640.webp 640w, /images/interior-1024.webp 1024w, /images/interior-1600.webp 1600w"
              sizes="(min-width:1024px) 50vw, 100vw"
              width="1600"
              height="897"
              alt="Projeto do interior de uma unidade My Box, com pista e área de musculação"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <p className="eyebrow" data-reveal>
              Na sua unidade
            </p>
            <h2 className="display display-lg mt-5" data-reveal style={stagger(1)}>
              Mais que um lugar para treinar.
            </h2>
            <ul className="mt-10 grid gap-6 sm:grid-cols-2">
              {DIFERENCIAIS.map(({ Icon, title, text }, i) => (
                <li key={title} data-reveal style={stagger(i)}>
                  <span className="icon-tile icon-tile-sm">
                    <Icon size={20} aria-hidden />
                  </span>
                  <h3 className="mt-4 text-lg font-bold">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-24 lg:py-32">
        <div className="shell grid items-center gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow" data-reveal>
              Nosso método
            </p>
            <h2 className="display display-lg mt-5" data-reveal style={stagger(1)}>
              Um treino só. Todas as unidades.
            </h2>
            <p className="lede mt-6" data-reveal style={stagger(2)}>
              A programação sai da rede e chega igual a cada My Box, todos os dias. Testada e validada por mais de um
              milhão de alunos.
            </p>
            <Link className="link-arrow mt-10" data-reveal style={stagger(3)} to="/treinos">
              Como funciona <ArrowRight size={18} aria-hidden />
            </Link>
          </div>
          <div className="media aspect-[3/2] lg:col-span-6 lg:col-start-7" data-reveal style={stagger(1)}>
            <img
              src="/images/professor-mural-1600.webp"
              srcSet="/images/professor-mural-640.webp 640w, /images/professor-mural-1024.webp 1024w, /images/professor-mural-1600.webp 1600w"
              sizes="(min-width:1024px) 50vw, 100vw"
              width="1600"
              height="1067"
              alt="Professor da My Box em frente ao mural do leão"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </section>

      <section className="border-t py-24 lg:py-32">
        <div className="shell">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="eyebrow" data-reveal>
                Quem está por trás
              </p>
              <h2 className="display display-lg mt-5" data-reveal style={stagger(1)}>
                Daniel e Gabi.
              </h2>
            </div>
            <Link className="link-arrow" data-reveal style={stagger(2)} to="/a-rede">
              Conheça a história da rede <ArrowRight size={18} aria-hidden />
            </Link>
          </div>
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {FUNDADORES.map((f, i) => (
              <article key={f.name} className="founder-card" data-reveal style={stagger(i)}>
                <div className="media aspect-square sm:aspect-auto sm:h-full">
                  <img
                    src={`/images/${f.photo}-1024.webp`}
                    srcSet={`/images/${f.photo}-640.webp 640w, /images/${f.photo}-1024.webp 1024w`}
                    sizes="(min-width:768px) 22vw, 100vw"
                    width="1024"
                    height="1536"
                    alt={`Retrato de ${f.name}`}
                    loading="lazy"
                    decoding="async"
                    className="object-[50%_20%]"
                  />
                </div>
                <div className="flex flex-col justify-end p-6 sm:p-8">
                  <p className="text-sm font-semibold tracking-wide text-brand uppercase">{f.role}</p>
                  <h3 className="display display-md mt-2">{f.name}</h3>
                  <p className="mt-4 leading-relaxed text-muted-foreground">{f.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="marquee overflow-hidden bg-primary py-6 text-primary-foreground" aria-label={`Cidades com My Box: ${cities.join(', ')}`}>
        <div className="marquee-track flex w-max items-center" style={{ '--marquee-duration': '140s' } as CSSProperties} aria-hidden>
          {[...cities, ...cities].map((city, i) => (
            <span key={i} className="display display-sm flex items-center gap-8 pr-8 whitespace-nowrap">
              {city}
              <span className="size-1.5 rounded-full bg-primary-foreground/50" />
            </span>
          ))}
        </div>
      </section>

      <section className="py-24 lg:py-32">
        <div className="shell grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow" data-reveal>
              Unidades
            </p>
            <h2 className="display display-lg mt-5 max-w-[12ch]" data-reveal style={stagger(1)}>
              Tem My Box perto de você?
            </h2>
            <form role="search" className="mt-10" data-reveal style={stagger(2)} onSubmit={handleSearch}>
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
                  className="absolute top-1.5 right-1.5 inline-flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground"
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
                    <span className="text-lg font-semibold transition-colors group-hover:text-brand">{state.name}</span>
                    <span className="text-sm text-subtle tabular-nums">{pluralUnits(state.units.length)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="pb-24 lg:pb-32">
        <div className="shell">
          <div className="cta-panel theme-night relative isolate overflow-hidden text-foreground">
            <img
              src="/images/fachada-1-1310.webp"
              srcSet="/images/fachada-1-640.webp 640w, /images/fachada-1-1024.webp 1024w, /images/fachada-1-1310.webp 1310w"
              sizes="100vw"
              width="1310"
              height="735"
              alt="Projeto de fachada de uma unidade My Box à noite"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 -z-10 size-full object-cover object-[70%_50%]"
            />
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-night via-night/85 to-night/20" />
            <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-12 lg:p-16">
              <div className="lg:col-span-7">
                <p className="eyebrow" data-reveal>
                  Franquia My Box
                </p>
                <h2 className="display display-lg mt-5 max-w-[14ch]" data-reveal style={stagger(1)}>
                  Leve a My Box para a sua cidade.
                </h2>
                <dl className="mt-10 grid max-w-md grid-cols-2 gap-8" data-reveal style={stagger(2)}>
                  <div>
                    <dt className="text-sm text-muted-foreground">Retorno estimado</dt>
                    <dd className="display display-md mt-1">24 meses</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Lucratividade de até</dt>
                    <dd className="display display-md mt-1">40%</dd>
                  </div>
                </dl>
                <Link className="btn mt-10" data-reveal style={stagger(3)} to="/franquia">
                  Quero ser franqueado
                  <ArrowUpRight size={18} className="btn-icon" aria-hidden />
                </Link>
              </div>
            </div>
          </div>
          <p className="mt-3 text-xs text-subtle">Projeto arquitetônico: Flavia Rucelle Arquitetura Fitness.</p>
        </div>
      </section>
    </SiteLayout>
  )
}
