import { useQuery } from '@tanstack/react-query'
import api from '../api/client'

export default function Dashboard() {
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white p-4 rounded shadow animate-pulse">
            <div className="h-4 w-1/2 bg-gray-200 rounded mb-3" />
            <div className="h-8 w-1/3 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
        <div className="font-medium mb-2">Không tải được dữ liệu Dashboard</div>
        <button onClick={() => refetch()} className="bg-red-600 text-white px-3 py-1.5 rounded">
          Thử lại
        </button>
      </div>
    )
  }

  const d = (data as any) || {}

  const cards = [
    { label: 'Tổng nhân viên', value: d.tongNhanVien },
    { label: 'Đơn nghỉ phép chờ', value: d.donNghiPhepChoXuLy },
    { label: 'Bảng lương chờ', value: d.bangLuongChoXuLy },
    { label: 'HĐ hết hạn (30 ngày)', value: d.hopDongHetHan },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div key={c.label} className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">{c.label}</div>
          <div className="text-2xl font-semibold flex items-center gap-2">
            {c.value ?? '-'}
            {isFetching && <span className="text-xs text-gray-400">(đang cập nhật)</span>}
          </div>
        </div>
      ))}
    </div>
  )
}
