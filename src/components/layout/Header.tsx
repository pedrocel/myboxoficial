import { useState } from 'react'
import { Link } from 'react-router-dom'

const navLinks = [
  { href: '#sobre', label: 'Sobre' },
  { href: '#conceito', label: 'Conceito' },
  { href: '#modalidades', label: 'Modalidades' },
  { href: '#fundadores', label: 'Fundadores' },
  { to: '/unidades', label: 'Unidades' },
  { href: '#investir', label: 'Investir' },
  { href: '#formulario', label: 'Contato' },
]

const externalLinks = [
  { href: 'https://www.lojamybox.com/', label: 'Loja' },
  { to: '/entrar', label: 'Painel' },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  const closeMobile = () => setMobileOpen(false)

  return (
    <header className="bg-mydark sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-white text-3xl font-bold">
          MY BOX
        </Link>

        <nav className="hidden md:flex space-x-8">
          {navLinks.map((link) =>
            link.to ? (
              <Link key={link.label} to={link.to} className="text-white hover:text-mygreen transition">
                {link.label}
              </Link>
            ) : (
              <a key={link.label} href={link.href} className="text-white hover:text-mygreen transition">
                {link.label}
              </a>
            ),
          )}
          {externalLinks.map((link) =>
            'to' in link && link.to ? (
              <Link key={link.label} to={link.to} className="text-white hover:text-mygreen transition">
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className="text-white hover:text-mygreen transition"
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label}
              </a>
            ),
          )}
        </nav>

        <button
          type="button"
          className="md:hidden text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          <i className={`fas ${mobileOpen ? 'fa-times' : 'fa-bars'} text-2xl`} />
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-mydark border-t border-gray-700">
          <div className="container mx-auto px-4 py-3 flex flex-col space-y-3">
            {navLinks.map((link) =>
              link.to ? (
                <Link
                  key={link.label}
                  to={link.to}
                  className="text-white hover:text-mygreen transition"
                  onClick={closeMobile}
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-white hover:text-mygreen transition"
                  onClick={closeMobile}
                >
                  {link.label}
                </a>
              ),
            )}
            <a
              href="https://www.lojamybox.com/"
              className="text-white hover:text-mygreen transition"
              onClick={closeMobile}
            >
              Loja
            </a>
            <Link
              to="/entrar"
              className="text-white hover:text-mygreen transition"
              onClick={closeMobile}
            >
              Painel
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
