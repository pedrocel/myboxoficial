import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="bg-mydark text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h2 className="text-3xl font-bold mb-2">
              MY <span className="text-mygreen">BOX</span>
            </h2>
            <p className="text-gray-400">Academia com conceito de shopping</p>
          </div>
          <div className="flex flex-col md:flex-row gap-8">
            <div>
              <h3 className="text-lg font-bold mb-3">Links Rápidos</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#sobre" className="text-gray-400 hover:text-mygreen transition">
                    Sobre
                  </a>
                </li>
                <li>
                  <a href="#modalidades" className="text-gray-400 hover:text-mygreen transition">
                    Modalidades
                  </a>
                </li>
                <li>
                  <Link to="/unidades" className="text-gray-400 hover:text-mygreen transition">
                    Unidades
                  </Link>
                </li>
                <li>
                  <a href="#investir" className="text-gray-400 hover:text-mygreen transition">
                    Investir
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-3">Contato</h3>
              <ul className="space-y-2">
                <li>
                  <a href="mailto:unidade.mybox@gmail.com" className="text-gray-400 hover:text-mygreen transition">
                    unidade.mybox@gmail.com
                  </a>
                </li>
                <li>
                  <a href="tel:+5519971313300" className="text-gray-400 hover:text-mygreen transition">
                    19 97131-3300
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-3">Redes Sociais</h3>
              <div className="flex space-x-4">
                <a
                  href="https://www.instagram.com/myboxoficial"
                  className="text-gray-400 hover:text-mygreen transition"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-instagram text-xl" />
                </a>
                <a
                  href="https://www.facebook.com/redemybox/"
                  className="text-gray-400 hover:text-mygreen transition"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-facebook text-xl" />
                </a>
                <a
                  href="https://www.youtube.com/@RedeMyBox"
                  className="text-gray-400 hover:text-mygreen transition"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fab fa-youtube text-xl" />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center space-y-2">
          <p className="text-gray-400">&copy; 2025 My Box. Todos os direitos reservados.</p>
          <p className="text-gray-400 text-sm space-x-4">
            <Link to="/termos" className="text-mygreen hover:underline">
              Termos de Uso
            </Link>
            <Link to="/privacidade" className="text-mygreen hover:underline">
              Política de Privacidade
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
