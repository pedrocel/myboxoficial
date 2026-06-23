import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { UnitsListPage } from './pages/UnitsListPage'
import { UnitDetailPage } from './pages/UnitDetailPage'
import { ComingSoonPage } from './pages/ComingSoonPage'
import { MetaPixel } from './components/analytics/MetaPixel'

const UnitsPreviewPage = lazy(() =>
  import('./pages/UnitsPreviewPage').then((m) => ({ default: m.UnitsPreviewPage })),
)

export default function App() {
  return (
    <BrowserRouter>
      <MetaPixel />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/unidades" element={<UnitsListPage />} />
        <Route
          path="/unidades-preview"
          element={
            <Suspense
              fallback={
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                  <i className="fas fa-spinner fa-spin text-mygreen text-3xl" />
                </div>
              }
            >
              <UnitsPreviewPage />
            </Suspense>
          }
        />
        <Route path="/unidades/:slug" element={<UnitDetailPage />} />
        <Route
          path="/termos"
          element={
            <ComingSoonPage title="Termos de Uso" description="Conteúdo dos termos de uso será migrado em breve." />
          }
        />
        <Route
          path="/privacidade"
          element={
            <ComingSoonPage
              title="Política de Privacidade"
              description="Conteúdo da política de privacidade será migrado em breve."
            />
          }
        />
        <Route
          path="*"
          element={<ComingSoonPage title="Página não encontrada" description="A página que você procura não existe." />}
        />
      </Routes>
    </BrowserRouter>
  )
}
