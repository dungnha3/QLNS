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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Phòng ban #{pb.phongban_id} - {pb.ten_phongban}</h1>
        <Link to="/phongban" className="text-sm text-blue-600">Quay lại danh sách</Link>
      </div>

      <div className="bg-white p-4 rounded shadow grid grid-cols-2 gap-3">
        <Field label="Tên phòng ban" value={pb.ten_phongban} />
        <Field label="Địa điểm" value={pb.dia_diem} />
        <div className="col-span-2">
          <Field label="Mô tả" value={pb.mo_ta || '-'} />
        </div>
        <Field label="Số lượng nhân viên" value={pb.soLuongNhanVien ?? nhanViens.length} />
      </div>

      <div className="bg-white rounded shadow overflow-x-auto">
        <div className="px-4 py-3 font-medium">Nhân viên trong phòng</div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="p-2">ID</th>
              <th className="p-2">Họ tên</th>
              <th className="p-2">Email</th>
              <th className="p-2">Giới tính</th>
            </tr>
          </thead>
          <tbody>
            {nhanViens.map((nv: any) => (
              <tr key={nv.nhanvien_id} className="border-t">
                <td className="p-2">{nv.nhanvien_id}</td>
                <td className="p-2">{nv.ho_ten}</td>
                <td className="p-2">{nv.email}</td>
                <td className="p-2">{nv.gioi_tinh}</td>
              </tr>
            ))}
            {nhanViens.length === 0 && (
              <tr>
                <td className="p-3 text-center text-gray-500" colSpan={4}>Chưa có nhân viên thuộc phòng này</td>
              </tr>
            )}
          </tbody>
        </table>
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
