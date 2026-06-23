import { Link } from 'react-router-dom'

export function UnitsCTASection() {
  return (
    <section id="unidades" className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-4xl font-bold text-foreground mb-4">FAÇA PARTE DA FAMÍLIA MY BOX</h2>
          <div className="w-24 h-1 bg-mygreen mx-auto mb-6" />
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            O sucesso da Rede My Box está se multiplicando e essa é a sua oportunidade de fazer parte dessa
            história!
          </p>
        </div>
        <div className="flex flex-col md:flex-row justify-center items-center gap-12 mb-16">
          <div className="md:w-1/3 text-center" data-aos="fade-up" data-aos-delay="100">
            <div className="w-24 h-24 rounded-full gradient-green flex items-center justify-center mx-auto mb-6 shadow-lg">
              <i className="fas fa-map-marker-alt text-white text-4xl" />
            </div>
            <h3 className="text-3xl font-bold text-foreground mb-2">+ 100</h3>
            <p className="text-lg text-muted-foreground">unidades pelo Brasil</p>
          </div>
          <div className="md:w-1/3 text-center" data-aos="fade-up" data-aos-delay="200">
            <div className="w-24 h-24 rounded-full gradient-green flex items-center justify-center mx-auto mb-6 shadow-lg">
              <i className="fas fa-users text-white text-4xl" />
            </div>
            <h3 className="text-3xl font-bold text-foreground mb-2">+ 50.000</h3>
            <p className="text-lg text-muted-foreground">alunos por todo o Brasil</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-center gap-8" data-aos="fade-up">
          <Link
            to="/unidades"
            className="bg-mygreen hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full transition transform hover:scale-105 flex items-center justify-center shadow-lg"
          >
            <i className="fas fa-map-marker-alt mr-2" /> ENCONTRE UMA UNIDADE PARA TREINAR
          </Link>
          <a
            href="#formulario"
            className="bg-mydark hover:bg-gray-800 text-white font-bold py-3 px-8 rounded-full transition transform hover:scale-105 flex items-center justify-center shadow-lg"
          >
            <i className="fas fa-store mr-2" /> QUERO ABRIR UMA UNIDADE
          </a>
        </div>
      </div>
    </section>
  )
}
