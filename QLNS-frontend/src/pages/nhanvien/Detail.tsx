import { useParams, Link } from 'react-router-dom'
import { useNhanVienDetail, useUpdateNhanVien } from '../../api/nhanvien'
import { useHopDongList } from '../../api/hopdong'
import { useChamCongList } from '../../api/chamcong'
import { useBangLuongList } from '../../api/bangluong'
import { useNghiPhepList } from '../../api/nghiphep'
import { useState } from 'react'
import { useAuthStore } from '../../stores/auth'
import { NhanVienEditModal } from '../../components/NhanVienEditModal'

const tabs = ['Thông tin','HĐ','Chấm công','Lương','Nghỉ phép'] as const

type TabKey = typeof tabs[number]

export default function NhanVienDetail() {
  const { id } = useParams()
  const nvId = Number(id)
  const { user } = useAuthStore()
  const { data, isLoading, error } = useNhanVienDetail(nvId)
  const [tab, setTab] = useState<TabKey>('Thông tin')
  const [showEditModal, setShowEditModal] = useState(false)
  const updateMut = useUpdateNhanVien()
  
  // Fetch related data
  const { data: hopDongData } = useHopDongList(0, 100)
  const { data: chamCongData } = useChamCongList(0, 100, nvId as any, new Date().getMonth()+1, new Date().getFullYear())
  const { data: bangLuongData } = useBangLuongList(0, 100)
  const { data: nghiPhepData } = useNghiPhepList(0, 100)
  
  // Filter data for this employee
  const hopDongs = (hopDongData?.content || []).filter((hd: any) => (hd.nhanVien?.nhanvien_id ?? hd.nhanVien) === nvId)
  const chamCongs = (chamCongData?.content || []).filter((cc: any) => (cc.nhanVien?.nhanvien_id ?? cc.nhanVien) === nvId)
  const bangLuongs = (bangLuongData?.content || []).filter((bl: any) => (bl.nhanVien?.nhanvien_id ?? bl.nhanVien) === nvId)
  const nghiPheps = (nghiPhepData?.content || []).filter((np: any) => (np.nhanVien?.nhanvien_id ?? np.nhanVien) === nvId)

  const isEmployee = user?.role === 'EMPLOYEE'
  const showBackButton = !isEmployee
  const canEdit = !isEmployee // Only ADMIN and MANAGER can edit
  
  const handleUpdate = async (formData: any) => {
    try {
      await updateMut.mutateAsync({ id: nvId, body: formData })
      setShowEditModal(false)
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Cập nhật thất bại')
    }
  }

  if (isLoading) return <div className="text-center py-12">Đang tải...</div>
  if (error || !data) return <div className="text-red-600">Không tải được dữ liệu</div>

  const getLoaiLabel = (loai?: string) => {
    switch (loai) {
      case 'THU_VIEC': return 'Thử việc'
      case 'CHINH_THUC': return 'Chính thức'
      case 'HOP_TAC_VIEN': return 'Hợp tác viên'
      default: return loai
    }
  }
  
  const getTrangThaiLabel = (tt?: string) => {
    switch (tt) {
      case 'CON_HIEU_LUC': return 'Còn hiệu lực'
      case 'HET_HAN': return 'Hết hạn'
      case 'HUY': return 'Hủy'
      case 'CHO_DUYET': return 'Chờ duyệt'
      case 'DA_DUYET': return 'Đã duyệt'
      case 'TU_CHOI': return 'Từ chối'
      case 'DA_THANH_TOAN': return 'Đã thanh toán'
      default: return tt
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nhân viên #{data.nhanvien_id} - {data.ho_ten}</h1>
          <p className="text-sm text-gray-500 mt-1">{isEmployee ? 'Hồ sơ của tôi' : 'Thông tin chi tiết nhân viên'}</p>
        </div>
        <div className="flex items-center gap-3">
          {canEdit && (
            <button 
              onClick={() => setShowEditModal(true)}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Sửa thông tin
            </button>
          )}
          {showBackButton && (
            <Link to="/nhanvien" className="text-sm text-blue-600 hover:underline">← Quay lại danh sách</Link>
          )}
        </div>
      </div>
      
      {showEditModal && (
        <NhanVienEditModal
          initial={data}
          onSubmit={handleUpdate}
          onCancel={() => setShowEditModal(false)}
          submitting={updateMut.isPending}
        />
      )}
      
      <div className="border-b">
        <div className="flex gap-2">
          {tabs.map((t) => (
            <button 
              key={t} 
              onClick={()=>setTab(t)} 
              className={`px-4 py-2 font-medium transition-colors ${
                tab===t 
                  ? 'border-b-2 border-blue-600 text-blue-600' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {tab === 'Thông tin' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-bold mb-4">Thông tin cá nhân</h2>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Họ tên" value={data.ho_ten} />
              <Field label="Email" value={data.email} />
              <Field label="Giới tính" value={data.gioi_tinh} />
              <Field label="SĐT" value={data.so_dien_thoai || '-'} />
              <Field label="CCCD" value={data.cccd || '-'} />
              <Field label="Ngày sinh" value={data.ngay_sinh} />
              <Field label="Ngày vào làm" value={data.ngay_vao_lam} />
              <Field label="Trạng thái" value={data.trangThai || '-'} />
              <div className="col-span-2"><Field label="Địa chỉ" value={data.dia_chi} /></div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-bold mb-4">Thông tin công việc</h2>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Phòng ban" value={(data as any).phongBan?.ten_phongban || 'Chưa có'} />
              <Field label="Chức vụ" value={(data as any).chucVu?.ten_chucvu || 'Chưa có'} />
              <Field label="Địa điểm làm việc" value={(data as any).phongBan?.dia_diem || '-'} />
              <Field label="Lương cơ bản" value={(data as any).chucVu?.luong_co_ban ? Number((data as any).chucVu.luong_co_ban).toLocaleString('vi-VN') + 'đ' : '-'} />
            </div>
          </div>
        </div>
      )}

      {tab === 'HĐ' && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-bold mb-4">Hợp đồng lao động</h2>
          {hopDongs.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Chưa có hợp đồng nào</p>
          ) : (
            <div className="space-y-4">
              {hopDongs.map((hd: any) => (
                <div key={hd.hopdong_id} className="border rounded-lg p-4 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          hd.loai_hopdong === 'CHINH_THUC' ? 'bg-blue-100 text-blue-700' :
                          hd.loai_hopdong === 'THU_VIEC' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {getLoaiLabel(hd.loai_hopdong)}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          hd.trangThai === 'CON_HIEU_LUC' ? 'bg-green-100 text-green-700' :
                          hd.trangThai === 'HET_HAN' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {getTrangThaiLabel(hd.trangThai)}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div>
                          <span className="text-gray-500">📅 Ngày ký:</span>
                          <span className="ml-1 font-medium">{hd.ngay_ky}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">▶️ Bắt đầu:</span>
                          <span className="ml-1 font-medium">{hd.ngay_batdau}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">⏹️ Kết thúc:</span>
                          <span className="ml-1 font-medium">{hd.ngay_ketthuc || 'Không thời hạn'}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">💰 Lương:</span>
                          <span className="ml-1 font-medium text-green-600">
                            {Number(hd.luongCoBan)?.toLocaleString('vi-VN')}đ
                          </span>
                        </div>
                      </div>
                      {hd.ghiChu && (
                        <p className="text-sm text-gray-600 mt-2">📝 {hd.ghiChu}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'Chấm công' && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-bold mb-4">Lịch chấm công</h2>
          {chamCongs.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Chưa có dữ liệu chấm công</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-4 py-3 font-semibold text-gray-700">Ngày</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Giờ vào</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Giờ ra</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Loại ca</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Tổng giờ</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {chamCongs.map((cc: any) => (
                    <tr key={cc.chamcong_id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-900">{cc.ngay_lam}</td>
                      <td className="px-4 py-3">{cc.gio_vao}</td>
                      <td className="px-4 py-3">{cc.gio_ra}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          cc.loaiCa === 'FULL' ? 'bg-blue-100 text-blue-700' :
                          cc.loaiCa === 'SANG' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {cc.loaiCa || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-semibold">{cc.tongGioLam?.toFixed(2) ?? '-'}h</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          cc.trangThai === 'DUNG_GIO' ? 'bg-green-100 text-green-700' :
                          cc.trangThai === 'DI_MUON' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {cc.trangThai || '-'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === 'Lương' && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-bold mb-4">Lịch sử lương</h2>
          {bangLuongs.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Chưa có bảng lương nào</p>
          ) : (
            <div className="space-y-4">
              {bangLuongs.map((bl: any) => (
                <div key={bl.bangluong_id} className="border rounded-lg p-4 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                        {bl.thang}/{bl.nam}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        bl.trangThai === 'DA_THANH_TOAN' ? 'bg-green-100 text-green-700' :
                        bl.trangThai === 'DA_DUYET' ? 'bg-blue-100 text-blue-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {getTrangThaiLabel(bl.trangThai)}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {Number(bl.thuc_lanh)?.toLocaleString('vi-VN') || 0}đ
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Lương cơ bản:</span>
                      <span className="ml-2 font-semibold">{Number(bl.luong_co_ban)?.toLocaleString('vi-VN') || 0}đ</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Phụ cấp:</span>
                      <span className="ml-2 font-semibold text-green-600">+{Number(bl.phu_cap)?.toLocaleString('vi-VN') || 0}đ</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Khấu trừ:</span>
                      <span className="ml-2 font-semibold text-red-600">-{Number(bl.khau_tru)?.toLocaleString('vi-VN') || 0}đ</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Thưởng:</span>
                      <span className="ml-2 font-semibold text-green-600">+{Number(bl.thuong)?.toLocaleString('vi-VN') || 0}đ</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'Nghỉ phép' && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-bold mb-4">Đơn nghỉ phép</h2>
          {nghiPheps.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Chưa có đơn nghỉ phép nào</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-4 py-3 font-semibold text-gray-700">Từ ngày</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Đến ngày</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Loại</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Số ngày</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Lý do</th>
                    <th className="px-4 py-3 font-semibold text-gray-700">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {nghiPheps.map((np: any) => (
                    <tr key={np.nghiphep_id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">{np.tu_ngay}</td>
                      <td className="px-4 py-3">{np.den_ngay}</td>
                      <td className="px-4 py-3">{np.loaiNghi || '-'}</td>
                      <td className="px-4 py-3">{np.soNgayNghi || '-'} ngày</td>
                      <td className="px-4 py-3">{np.lyDo || '-'}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          np.trangThai === 'DA_DUYET' ? 'bg-green-100 text-green-700' :
                          np.trangThai === 'TU_CHOI' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {getTrangThaiLabel(np.trangThai)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function Field({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="font-semibold text-gray-900">{String(value)}</div>
    </div>
  )
}



