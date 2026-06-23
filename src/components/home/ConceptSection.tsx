const conceptCards = [
  { icon: 'fa-coffee', title: 'My Coffee', description: 'Café de qualidade para antes ou depois do treino' },
  { icon: 'fa-book', title: 'Área de Leitura', description: 'Espaço para relaxar e se inspirar' },
  { icon: 'fa-tshirt', title: 'Loja', description: 'Acessórios e roupas exclusivas' },
  { icon: 'fa-heart', title: 'Comunidade', description: 'Ambiente acolhedor e motivador' },
]

export function ConceptSection() {
  return (
    <section id="conceito" className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-4xl font-bold text-mydark mb-4">ACADEMIA COM CONCEITO DE SHOPPING</h2>
          <div className="w-24 h-1 bg-mygreen mx-auto" />
        </div>
        <div className="flex flex-col md:flex-row-reverse items-center gap-12">
          <div className="md:w-1/2" data-aos="fade-left">
            <img src="/img/fachada3.PNG" className="rounded-lg shadow-xl w-full" alt="My Box Concept" />
          </div>
          <div className="md:w-1/2" data-aos="fade-right">
            <p className="text-lg text-gray-700 mb-6">
              A MyBox é uma verdadeira revolução no mundo fitness, transformando o tempo dedicado à atividade
              física em uma experiência prazerosa. Com um formato inovador, oferecemos um espaço onde as
              pessoas não apenas treinam, mas também se sentem à vontade, são atendidas com excelência,
              desfrutam de um café ou relaxam com um bom livro, tudo em um ambiente agradável e acolhedor.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              {conceptCards.map((card) => (
                <div key={card.title} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center gradient-green mb-4 shadow-lg">
                    <i className={`fas ${card.icon} text-white text-xl`} />
                  </div>
                  <h3 className="text-xl font-bold text-mydark mb-2">{card.title}</h3>
                  <p className="text-gray-600">{card.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
