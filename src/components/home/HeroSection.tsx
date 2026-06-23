import { Link } from 'react-router-dom'

export function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center">
      <div className="absolute inset-0 z-0">
        <img src="/img/fachada.PNG" className="w-full h-full object-cover" alt="Gym background" />
        <div className="absolute inset-0 bg-black opacity-60" />
      </div>
      <div className="container mx-auto px-4 z-10 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 text-shadow">My Box</h1>
        <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto text-shadow">
          A rede que está mudando a forma como o Brasil treina.
          <br />
          <br />
          Uma revolução no mundo fitness, transformando treinos em experiências, unidades em comunidades e
          movimento em estilo de vida.
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <Link
            to="/unidades"
            className="bg-mygreen hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full transition transform hover:scale-105 shadow-lg"
          >
            Quero treinar em uma unidade
          </Link>
          <a
            href="#investir"
            className="bg-white hover:bg-gray-200 text-mydark font-bold py-3 px-8 rounded-full transition transform hover:scale-105 shadow-lg"
          >
            Quero abrir a minha My Box
          </a>
        </div>
      </div>
    </section>
  )
}
