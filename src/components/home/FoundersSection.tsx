const founders = [
  {
    name: 'Daniel Ambiel',
    role: 'Fundador da Rede My Box',
    image: '/img/daniel.jpeg',
    bio: 'Formado em Educação Física e pós-graduado em Fisiologia do Exercício. Apaixonado pela prática do Cross Training, Daniel idealizou uma forma mais acessível para a prática do esporte, uma metodologia própria, iniciando assim a primeira academia da Rede My Box, em Outubro de 2016.',
    delay: 100,
  },
  {
    name: 'Gabriela Ambiel',
    role: 'Co-fundadora da Rede My Box',
    image: '/img/gabi.jpeg',
    bio: 'Formada em Direito e Life Coach (Master e Practitioner). Teve a sua vida transformada pela prática do Cross Training. Focada também, na área do mindset para uma transformação em todas as áreas da vida, e tem as melhores indicações alimentares e nutricionais.',
    delay: 200,
  },
]

export function FoundersSection() {
  return (
    <section id="fundadores" className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-4xl font-bold text-mydark mb-4">FUNDADORES</h2>
          <div className="w-24 h-1 bg-mygreen mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {founders.map((founder) => (
            <div
              key={founder.name}
              className="bg-white rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition"
              data-aos="fade-up"
              data-aos-delay={founder.delay}
            >
              <div className="flex flex-col md:flex-row">
                <div className="md:w-2/5">
                  <img src={founder.image} className="w-full h-full object-cover min-h-[200px]" alt={founder.name} />
                </div>
                <div className="md:w-3/5 p-6">
                  <h3 className="text-2xl font-bold text-mydark mb-2">{founder.name}</h3>
                  <p className="text-mygreen font-semibold mb-4">{founder.role}</p>
                  <p className="text-gray-700 mb-4">{founder.bio}</p>
                  <div className="flex space-x-3">
                    <a href="#" className="text-mydark hover:text-mygreen transition" aria-label="Instagram">
                      <i className="fab fa-instagram text-xl" />
                    </a>
                    <a href="#" className="text-mydark hover:text-mygreen transition" aria-label="LinkedIn">
                      <i className="fab fa-linkedin text-xl" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
