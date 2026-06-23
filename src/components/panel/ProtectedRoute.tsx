import { Navigate, Outlet } from 'react-router-dom'
import { useAuth, roleHomePath } from '../../contexts/AuthContext'
import type { UserRole } from '../../types/database'

type Props = {
  roles?: UserRole[]
}

export function ProtectedRoute({ roles }: Props) {
  const { user, profile, loading, configured } = useAuth()

  if (!configured) {
    return <Navigate to="/entrar" replace />
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f]">
        <i className="fas fa-spinner fa-spin text-mygreen text-3xl" />
      </div>
    )
  }

  if (!user || !profile) {
    return <Navigate to="/entrar" replace />
  }

  if (roles && !roles.includes(profile.role)) {
    return <Navigate to={roleHomePath(profile.role)} replace />
  }

  return <Outlet />
}
