import { useState } from 'react'
import { Link } from 'react-router-dom'

export function UnitsListHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="bg-card sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-foreground text-2xl font-bold flex items-center">
          <span className="text-mygreen mr-1">MY</span> BOX
        </Link>
        <button
          type="button"
          className="lg:hidden text-foreground p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          <i className={`fas ${mobileOpen ? 'fa-times' : 'fa-bars'} text-xl`} />
        </button>
      </div>
      {mobileOpen && (
        <div className="lg:hidden bg-card border-t border-border">
          <div className="container mx-auto px-4 py-3 flex flex-col space-y-3">
            <Link to="/#sobre" className="text-foreground hover:text-mygreen transition py-2" onClick={() => setMobileOpen(false)}>
              Sobre
            </Link>
            <Link to="/unidades" className="text-mygreen font-medium py-2" onClick={() => setMobileOpen(false)}>
              Unidades
            </Link>
            <Link to="/#investir" className="text-foreground hover:text-mygreen transition py-2" onClick={() => setMobileOpen(false)}>
              Investir
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
