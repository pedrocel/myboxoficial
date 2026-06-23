type Props = {
  icon: string
  label: string
  value: string | number
  trend?: string
  color?: 'green' | 'gold' | 'dark' | 'blue'
}

const COLORS = {
  green: 'from-mygreen/20 to-mygreen/5 text-mygreen',
  gold: 'from-mygold/20 to-mygold/5 text-amber-600',
  dark: 'from-mydark/20 to-mydark/5 text-mydark',
  blue: 'from-blue-500/20 to-blue-500/5 text-blue-600',
}

export function StatCard({ icon, label, value, trend, color = 'green' }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${COLORS[color]} flex items-center justify-center mb-4`}>
        <i className={`fas ${icon} text-lg`} />
      </div>
      <p className="text-3xl font-black text-mydark">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
      {trend && <p className="text-xs text-mygreen font-semibold mt-2">{trend}</p>}
    </div>
  )
}
