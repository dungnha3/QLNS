import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '../stores/auth'
import api from '../api/client'

export default function Dashboard() {
  const { user } = useAuthStore()
  const { data, isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const res = await api.get('/api/dashboard/tong-quan')
      return res.data
    },
    refetchOnWindowFocus: false,
  })

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-4 w-1/2 bg-gray-200 rounded mb-3" />
            <div className="h-8 w-1/3 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="card border-l-4 border-red-500 bg-red-50">
        <div className="flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <div className="flex-1">
            <div className="font-semibold text-red-900 mb-2">Không tải được dữ liệu Dashboard</div>
            <button onClick={() => refetch()} className="btn-danger text-sm">
              🔄 Thử lại
            </button>
          </div>
        </div>
      </div>
    )
  }

  const d = (data as any) || {}

  const cards = (
    user?.role === 'EMPLOYEE'
      ? [
          { label: 'Đơn nghỉ phép chờ', value: d.donNghiPhepChoXuLy },
          { label: 'Bảng lương chờ', value: d.bangLuongChoXuLy },
          { label: 'HĐ hết hạn (30 ngày)', value: d.hopDongHetHan },
        ]
      : [
          { label: 'Tổng nhân viên', value: d.tongNhanVien },
          { label: 'Đơn nghỉ phép chờ', value: d.donNghiPhepChoXuLy },
          { label: 'Bảng lương chờ', value: d.bangLuongChoXuLy },
          { label: 'HĐ hết hạn (30 ngày)', value: d.hopDongHetHan },
        ]
  )

  const cardIcons: Record<string, string> = {
    'Tổng nhân viên': '👥',
    'Đơn nghỉ phép chờ': '📋',
    'Bảng lương chờ': '💰',
    'HĐ hết hạn (30 ngày)': '📄',
  }

  const cardColors: Record<string, string> = {
    'Tổng nhân viên': 'from-blue-500 to-blue-600',
    'Đơn nghỉ phép chờ': 'from-amber-500 to-amber-600',
    'Bảng lương chờ': 'from-green-500 to-green-600',
    'HĐ hết hạn (30 ngày)': 'from-red-500 to-red-600',
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((c) => (
          <div key={c.label} className="card hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cardColors[c.label] || 'from-gray-500 to-gray-600'} flex items-center justify-center shadow-lg`}>
                <span className="text-2xl">{cardIcons[c.label] || '📊'}</span>
              </div>
              {isFetching && (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary-600 border-t-transparent" />
              )}
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600">{c.label}</p>
              <p className="text-3xl font-bold text-gray-900">
                {c.value ?? '-'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
