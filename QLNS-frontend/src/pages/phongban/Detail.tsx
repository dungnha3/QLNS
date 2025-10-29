import { Link, useParams } from 'react-router-dom'
import { usePhongBanDetail } from '../../api/phongban'
import { useNhanVienList } from '../../api/nhanvien'

export default function PhongBanDetail() {
  const { id } = useParams()
  const pbId = Number(id)
  const { data: pb, isLoading, error } = usePhongBanDetail(pbId)
  // Tải danh sách nhân viên trang đầu (size lớn) rồi lọc theo phòng ban
  const { data: nvPage } = useNhanVienList(0, 100, '')
  const nhanViens = (nvPage?.content || []).filter((x: any) => x?.phongBan?.phongban_id === pbId)

  if (isLoading) return <div>Đang tải...</div>
  if (error || !pb) return <div className="text-red-600">Không tải được phòng ban</div>

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link 
          to="/phongban" 
          className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          ←
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{pb.ten_phongban}</h1>
          <p className="text-sm text-gray-500">Danh sách nhân viên trong phòng ban</p>
        </div>
      </div>

      {/* Thông tin phòng ban */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-xs font-medium text-gray-600 mb-1">Địa điểm</div>
            <div className="font-semibold text-gray-900">{pb.dia_diem}</div>
          </div>
          <div>
            <div className="text-xs font-medium text-gray-600 mb-1">Số lượng</div>
            <div className="font-semibold text-gray-900">{nhanViens.length} nhân viên</div>
          </div>
          <div className="md:col-span-1">
            <div className="text-xs font-medium text-gray-600 mb-1">Mô tả</div>
            <div className="text-sm text-gray-700">{pb.mo_ta || 'Không có mô tả'}</div>
          </div>
        </div>
      </div>

      {/* Danh sách nhân viên */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Danh sách nhân viên ({nhanViens.length})</h2>
        </div>
        
        {nhanViens.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-3">👤</div>
            <p className="text-gray-500">Chưa có nhân viên trong phòng ban này</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left border-b">
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">ID</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">Họ tên</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">Email</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">Chức vụ</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">Giới tính</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {nhanViens.map((nv: any) => (
                  <tr key={nv.nhanvien_id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm">#{nv.nhanvien_id}</td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-gray-900">{nv.ho_ten}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{nv.email}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {nv.chucVu?.ten_chucvu || 'Chưa có'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{nv.gioi_tinh}</td>
                    <td className="px-4 py-3 text-center">
                      <Link
                        to={`/nhanvien/${nv.nhanvien_id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
                      >
                        <span>Chi tiết</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

function Field({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <div className="text-xs text-gray-500">{label}</div>
      <div className="font-medium">{String(value)}</div>
    </div>
  )
}
