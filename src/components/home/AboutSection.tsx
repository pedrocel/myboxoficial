export function AboutSection() {
  return (
    <section id="sobre" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-4xl font-bold text-mydark mb-4">O QUE É A MY BOX?</h2>
          <div className="w-24 h-1 bg-mygreen mx-auto" />
        </div>
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2" data-aos="fade-right">
            <img src="/img/fachada2.PNG" className="rounded-lg shadow-xl w-full" alt="My Box Gym" />
          </div>
          <div className="md:w-1/2" data-aos="fade-left">
            <p className="text-lg text-gray-700 mb-6">
              Desde 2016, a <span className="text-mygreen font-semibold">MyBox</span> atua no segmento de
              atividades físicas, sempre à frente do mercado. Ao longo desses anos, passou por diversas
              mudanças e, em menos de 5 anos,{' '}
              <span className="text-mygreen font-semibold">
                tornou-se uma das maiores redes de academias do Brasil
              </span>
              .
            </p>
            <p className="text-lg text-gray-700 mb-6">
              Em 2025, iniciamos uma nova fase:{' '}
              <span className="text-mygreen italic font-semibold">uma verdadeira inovação no mundo fitness</span>.
              Testamos, validamos e lançamos para o mercado uma tendência que{' '}
              <span className="text-mygreen font-semibold">promete transformar os próximos anos!</span>
            </p>
            <div className="flex items-center gap-4 mt-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center gradient-green shadow-lg">
                <i className="fas fa-dumbbell text-white text-2xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-mydark">Inovação Constante</h3>
                <p className="text-gray-600">Sempre à frente do mercado fitness</p>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center gradient-green shadow-lg">
                <i className="fas fa-users text-white text-2xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-mydark">Comunidade</h3>
                <p className="text-gray-600">Mais de 50.000 alunos em todo o Brasil</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
