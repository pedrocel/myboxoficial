import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/panel/ProtectedRoute'
import { HomePage } from './pages/HomePage'
import { UnitsListPage } from './pages/UnitsListPage'
import { UnitDetailPage } from './pages/UnitDetailPage'
import { ComingSoonPage } from './pages/ComingSoonPage'
import { LoginPage } from './pages/auth/LoginPage'
import { PanelRedirectPage } from './pages/panel/PanelRedirectPage'
import { MetaPixel } from './components/analytics/MetaPixel'

const UnitsPreviewPage = lazy(() =>
  import('./pages/UnitsPreviewPage').then((m) => ({ default: m.UnitsPreviewPage })),
)
const UnitDetailPreviewPage = lazy(() =>
  import('./pages/UnitDetailPreviewPage').then((m) => ({ default: m.UnitDetailPreviewPage })),
)
const AdminDashboardPage = lazy(() =>
  import('./pages/panel/admin/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage })),
)
const AdminUnitsPage = lazy(() =>
  import('./pages/panel/admin/AdminUnitsPage').then((m) => ({ default: m.AdminUnitsPage })),
)
const AdminBookingsPage = lazy(() =>
  import('./pages/panel/admin/AdminBookingsPage').then((m) => ({ default: m.AdminBookingsPage })),
)
const AdminUnitDetailPage = lazy(() =>
  import('./pages/panel/admin/AdminUnitDetailPage').then((m) => ({ default: m.AdminUnitDetailPage })),
)
const AdminUserDetailPage = lazy(() =>
  import('./pages/panel/admin/AdminUserDetailPage').then((m) => ({ default: m.AdminUserDetailPage })),
)
const OwnerDashboardPage = lazy(() =>
  import('./pages/panel/owner/OwnerDashboardPage').then((m) => ({ default: m.OwnerDashboardPage })),
)
const OwnerBookingsPage = lazy(() =>
  import('./pages/panel/owner/OwnerBookingsPage').then((m) => ({ default: m.OwnerBookingsPage })),
)
const OwnerStudentsPage = lazy(() =>
  import('./pages/panel/owner/OwnerStudentsPage').then((m) => ({ default: m.OwnerStudentsPage })),
)
const OwnerVisitsPage = lazy(() =>
  import('./pages/panel/owner/OwnerVisitsPage').then((m) => ({ default: m.OwnerVisitsPage })),
)
const AdminUsersPage = lazy(() =>
  import('./pages/panel/admin/AdminUsersPage').then((m) => ({ default: m.AdminUsersPage })),
)
const OwnerPersonalizePage = lazy(() =>
  import('./pages/panel/owner/OwnerPersonalizePage').then((m) => ({ default: m.OwnerPersonalizePage })),
)
const StudentDashboardPage = lazy(() =>
  import('./pages/panel/student/StudentDashboardPage').then((m) => ({ default: m.StudentDashboardPage })),
)
const StudentBookingsPage = lazy(() =>
  import('./pages/panel/student/StudentBookingsPage').then((m) => ({ default: m.StudentBookingsPage })),
)
const StudentProfilePage = lazy(() =>
  import('./pages/panel/student/StudentProfilePage').then((m) => ({ default: m.StudentProfilePage })),
)

const fallback = (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <i className="fas fa-spinner fa-spin text-mygreen text-3xl" />
  </div>
)

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <MetaPixel />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/unidades" element={<UnitsListPage />} />
          <Route
            path="/unidades-preview"
            element={
              <Suspense fallback={fallback}>
                <UnitsPreviewPage />
              </Suspense>
            }
          />
          <Route
            path="/unidades-preview/:slug"
            element={
              <Suspense fallback={fallback}>
                <UnitDetailPreviewPage />
              </Suspense>
            }
          />
          <Route path="/unidades/:slug" element={<UnitDetailPage />} />
          <Route path="/entrar" element={<LoginPage />} />
          <Route path="/painel" element={<PanelRedirectPage />} />

          <Route element={<ProtectedRoute roles={['admin']} />}>
            <Route
              path="/painel/admin"
              element={
                <Suspense fallback={fallback}>
                  <AdminDashboardPage />
                </Suspense>
              }
            />
            <Route
              path="/painel/admin/unidades"
              element={
                <Suspense fallback={fallback}>
                  <AdminUnitsPage />
                </Suspense>
              }
            />
            <Route
              path="/painel/admin/unidades/:slug"
              element={
                <Suspense fallback={fallback}>
                  <AdminUnitDetailPage />
                </Suspense>
              }
            />
            <Route
              path="/painel/admin/agendamentos"
              element={
                <Suspense fallback={fallback}>
                  <AdminBookingsPage />
                </Suspense>
              }
            />
            <Route
              path="/painel/admin/usuarios"
              element={
                <Suspense fallback={fallback}>
                  <AdminUsersPage />
                </Suspense>
              }
            />
            <Route
              path="/painel/admin/usuarios/:id"
              element={
                <Suspense fallback={fallback}>
                  <AdminUserDetailPage />
                </Suspense>
              }
            />
          </Route>

          <Route element={<ProtectedRoute roles={['owner']} />}>
            <Route
              path="/painel/unidade"
              element={
                <Suspense fallback={fallback}>
                  <OwnerDashboardPage />
                </Suspense>
              }
            />
            <Route
              path="/painel/unidade/personalizar"
              element={
                <Suspense fallback={fallback}>
                  <OwnerPersonalizePage />
                </Suspense>
              }
            />
            <Route
              path="/painel/unidade/agendamentos"
              element={
                <Suspense fallback={fallback}>
                  <OwnerBookingsPage />
                </Suspense>
              }
            />
            <Route
              path="/painel/unidade/alunos"
              element={
                <Suspense fallback={fallback}>
                  <OwnerStudentsPage />
                </Suspense>
              }
            />
            <Route
              path="/painel/unidade/visitas"
              element={
                <Suspense fallback={fallback}>
                  <OwnerVisitsPage />
                </Suspense>
              }
            />
            <Route
              path="/painel/unidade/editar"
              element={
                <Suspense fallback={fallback}>
                  <OwnerPersonalizePage />
                </Suspense>
              }
            />
          </Route>

          <Route element={<ProtectedRoute roles={['student']} />}>
            <Route
              path="/painel/aluno"
              element={
                <Suspense fallback={fallback}>
                  <StudentDashboardPage />
                </Suspense>
              }
            />
            <Route
              path="/painel/aluno/agendamentos"
              element={
                <Suspense fallback={fallback}>
                  <StudentBookingsPage />
                </Suspense>
              }
            />
            <Route
              path="/painel/aluno/perfil"
              element={
                <Suspense fallback={fallback}>
                  <StudentProfilePage />
                </Suspense>
              }
            />
          </Route>

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
    </AuthProvider>
  )
}
