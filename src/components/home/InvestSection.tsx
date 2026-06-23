import { FranchiseForm } from './FranchiseForm'

const investCards = [
  {
    icon: 'fa-chart-line',
    title: 'ALTA RENTABILIDADE',
    description:
      'A lucratividade pode chegar até 40% ao mês, tornando o investimento altamente atrativo para empreendedores.',
    delay: 100,
  },
  {
    icon: 'fa-clock',
    title: 'RÁPIDO RETORNO DE INVESTIMENTO',
    description:
      'Tempo estimado de retorno de investimento de aproximadamente 24 meses, ótimo para quem busca um investimento de curto a médio prazo.',
    delay: 200,
  },
  {
    icon: 'fa-expand-alt',
    title: 'MARCA EM EXPANSÃO',
    description:
      'A Rede My Box já possui mais de 100 unidades no Brasil. Isso indica estabilidade e uma boa presença no mercado.',
    delay: 300,
  },
  {
    icon: 'fa-heartbeat',
    title: 'DEMANDA CRESCENTE',
    description:
      'O segmento de fitness e estilo de vida saudável tem apresentado forte crescimento no Brasil, sugerindo uma demanda contínua por serviços relacionados à saúde e bem-estar.',
    delay: 100,
  },
  {
    icon: 'fa-coins',
    title: 'DIVERSIFICAÇÃO DE FONTES DE RECEITA',
    description:
      'Além da mensalidade, a rede oferece oportunidades de ganhos por meio de produtos complementares, como Gympass, My Coffee, acessórios e roupas.',
    delay: 200,
  },
  {
    icon: 'fa-cross',
    title: 'REDE CRISTÃ',
    description:
      'Acreditamos que nossa marca nasceu no coração de Deus, e honramos com excelência o que Ele nos confiou. Nossas ações são guiadas por princípios bíblicos.',
    delay: 300,
  },
]

export function InvestSection() {
  return (
    <section id="investir" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-4xl font-bold text-foreground mb-4">OPORTUNIDADE DE NEGÓCIO</h2>
          <h3 className="text-2xl font-bold text-mygreen mb-6">POR QUE INVESTIR NA REDE MY BOX?</h3>
          <div className="w-24 h-1 bg-mygreen mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {investCards.map((card) => (
            <div
              key={card.title}
              className="bg-card rounded-xl shadow-lg hover:shadow-xl transition overflow-hidden"
              data-aos="fade-up"
              data-aos-delay={card.delay}
            >
              <div className="h-2 gradient-green" />
              <div className="p-6">
                <div className="w-16 h-16 rounded-full gradient-green flex items-center justify-center mb-6 shadow-lg">
                  <i className={`fas ${card.icon} text-white text-2xl`} />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{card.title}</h3>
                <p className="text-muted-foreground">{card.description}</p>
              </div>
            </div>
          ))}
        </div>
        <FranchiseForm />
      </div>
    </section>
  )
}
