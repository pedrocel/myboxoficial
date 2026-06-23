import { Link } from 'react-router-dom'

export function UnitsListFooter() {
  return (
    <footer className="bg-mydark text-white py-12 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-center mb-8">
          <Link to="/" className="text-white text-3xl font-bold flex items-center">
            <span className="text-mygreen mr-1">MY</span> BOX
          </Link>
        </div>
        <div className="text-center mb-8">
          <p className="text-gray-400">Seja a My Box Fit</p>
        </div>
        <div className="flex justify-center space-x-4 mb-8">
          <a href="https://www.facebook.com/redemybox/" className="text-gray-400 hover:text-mygreen transition text-xl" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-facebook" />
          </a>
          <a href="https://www.instagram.com/myboxoficial" className="text-gray-400 hover:text-mygreen transition text-xl" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-instagram" />
          </a>
          <a href="https://www.youtube.com/@RedeMyBox" className="text-gray-400 hover:text-mygreen transition text-xl" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-youtube" />
          </a>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400 text-sm">&copy; 2025 My Box. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
