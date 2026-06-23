import { useState, type FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth, roleHomePath } from '../../contexts/AuthContext'

export function LoginPage() {
  const { signIn, user, profile, loading, configured } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (!loading && user && profile) {
    return <Navigate to={roleHomePath(profile.role)} replace />
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    const result = await signIn(email, password)
    if (result.error) setError(result.error)
    setSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-mydark flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="/img/fachada.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-mygreen/30 to-mydark" />
        <div className="relative z-10 p-12 flex flex-col justify-end">
          <h2 className="text-4xl font-black text-white mb-4">Painel My Box</h2>
          <p className="text-white/70 text-lg max-w-md">
            Gerencie sua unidade, acompanhe agendamentos e conecte-se com seus alunos em um só lugar.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-8 transition">
            <i className="fas fa-arrow-left" />
            Voltar ao site
          </Link>

          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <div className="w-14 h-14 rounded-2xl gradient-green flex items-center justify-center text-white font-black text-2xl mb-6">
              M
            </div>
            <h1 className="text-2xl font-black text-mydark mb-1">Entrar</h1>
            <p className="text-gray-500 text-sm mb-8">Acesse o painel da sua unidade ou perfil de aluno</p>

            {!configured && (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
                <p className="font-bold mb-1">Supabase não configurado</p>
                <p>
                  Defina <code className="text-xs">VITE_SUPABASE_URL</code> e{' '}
                  <code className="text-xs">VITE_SUPABASE_PUBLISHABLE_KEY</code> no arquivo{' '}
                  <code className="text-xs">.env</code>.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1.5 w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-mygreen"
                  placeholder="seu@email.com"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Senha</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1.5 w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-mygreen"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm bg-red-50 px-4 py-3 rounded-xl flex items-center gap-2">
                  <i className="fas fa-exclamation-circle" />
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting || !configured}
                className="w-full bg-mygreen hover:bg-green-600 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition shadow-lg shadow-mygreen/25"
              >
                {submitting ? (
                  <i className="fas fa-spinner fa-spin" />
                ) : (
                  'Acessar painel'
                )}
              </button>
            </form>

            <p className="text-center text-xs text-gray-400 mt-6">
              Agendou uma aula? Verifique seu e-mail para o link de acesso.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
