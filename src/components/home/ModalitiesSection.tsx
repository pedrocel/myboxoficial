const modalities = [
  {
    title: 'MUSCULAÇÃO',
    image:
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    description:
      'Academia de musculação como você nunca presenciou antes! Equipamentos modernos e ambiente motivador para alcançar seus objetivos.',
    delay: 100,
  },
  {
    title: 'CROSS TRAINING',
    image:
      'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1349&q=80',
    description:
      'Temos uma metodologia própria, testada e validada por mais de um milhão de alunos, todas as unidades recebem o mesmo treino diariamente.',
    delay: 200,
  },
  {
    title: 'AULAS COLETIVAS',
    image:
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    description:
      'O objetivo das aulas coletivas é criar comunidade, gerando um ecossistema de opções para que a pessoa se sinta abraçada pela escolha dela.',
    delay: 300,
  },
]

export function ModalitiesSection() {
  return (
    <section id="modalidades" className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-4xl font-bold text-foreground mb-4">MODALIDADES</h2>
          <div className="w-24 h-1 bg-mygreen mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {modalities.map((mod) => (
            <div
              key={mod.title}
              className="rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition group"
              data-aos="fade-up"
              data-aos-delay={mod.delay}
            >
              <div className="relative h-64">
                <img
                  src={mod.image}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  alt={mod.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70" />
                <h3 className="absolute bottom-4 left-4 text-2xl font-bold text-white">{mod.title}</h3>
              </div>
              <div className="p-6 bg-card">
                <p className="text-muted-foreground">{mod.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
