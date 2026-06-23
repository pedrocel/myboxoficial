import { Navigate } from 'react-router-dom'
import { useAuth, roleHomePath } from '../../contexts/AuthContext'

export function PanelRedirectPage() {
  const { profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f]">
        <i className="fas fa-spinner fa-spin text-mygreen text-3xl" />
      </div>
    )
  }

  if (!profile) return <Navigate to="/entrar" replace />
  return <Navigate to={roleHomePath(profile.role)} replace />
}
