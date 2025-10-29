import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { HopDong } from '../../api/hopdong'
import { useCreateHopDong, useDeleteHopDong, useHopDongList, useUpdateHopDong } from '../../api/hopdong'
import { usePhongBanList } from '../../api/phongban'
import { useAuthStore } from '../../stores/auth'
import { NhanVienSelect } from '../../components/NhanVienSelect'
import { useNhanVienDetail, useNhanVienWithoutContract } from '../../api/nhanvien'

function HDForm({ initial, onSubmit, onCancel, submitting, isNewContract }: { initial?: Partial<HopDong>; onSubmit: (v: Partial<HopDong>) => void; onCancel: () => void; submitting?: boolean; isNewContract?: boolean }) {
  const [form, setForm] = useState<Partial<HopDong>>({
    loai_hopdong: (initial?.loai_hopdong as any) || 'CHINH_THUC',
    ngay_batdau: initial?.ngay_batdau || '',
    ngay_ketthuc: initial?.ngay_ketthuc || '',
    ngay_ky: initial?.ngay_ky || new Date().toISOString().split('T')[0],
    luongCoBan: initial?.luongCoBan || undefined,
    trangThai: (initial?.trangThai as any) || 'CON_HIEU_LUC',
    ghiChu: initial?.ghiChu || '',
    nhanVien: typeof initial?.nhanVien === 'number' ? initial?.nhanVien : (initial?.nhanVien as any)?.nhanvien_id || undefined,
  })
  const [voThoiHan, setVoThoiHan] = useState(!initial?.ngay_ketthuc)
  const onChange = (k: keyof HopDong, v: any) => setForm((s) => ({ ...s, [k]: v }))
  
  // Load danh sách nhân viên chưa có hợp đồng (chỉ khi tạo mới)
  const { data: nhanViensWithoutContract } = useNhanVienWithoutContract()
  
  // Load thông tin nhân viên khi chọn
  const nhanVienId = typeof form.nhanVien === 'number' ? form.nhanVien : (form.nhanVien as any)?.nhanvien_id
  const { data: selectedEmployee } = useNhanVienDetail(nhanVienId)
  
  // Auto-fill lương từ chức vụ nếu chưa có
  useEffect(() => {
    if (selectedEmployee && !initial?.hopdong_id && !form.luongCoBan) {
      const luongChucVu = selectedEmployee.chucVu?.luong_co_ban
      if (luongChucVu) {
        setForm(s => ({ ...s, luongCoBan: Number(luongChucVu) }))
      }
    }
  }, [selectedEmployee, initial, form.luongCoBan])
  return (
    <div className="modal-backdrop">
      <div className="modal-panel max-w-2xl">
        <h3 className="text-lg font-semibold mb-3">{(initial as any)?.hopdong_id ? 'Cập nhật' : 'Thêm'} hợp đồng</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1">Loại hợp đồng</label>
            <select className="input" value={form.loai_hopdong as any} onChange={(e)=>onChange('loai_hopdong', e.target.value as any)}>
              <option value="THU_VIEC">Thử việc</option>
              <option value="CHINH_THUC">Chính thức</option>
              <option value="HOP_TAC_VIEN">Hợp tác viên</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Lương cơ bản</label>
            <input type="number" className="input" value={form.luongCoBan??''} onChange={(e)=>onChange('luongCoBan', Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-sm mb-1">Ngày ký</label>
            <input type="date" className="input" value={form.ngay_ky||''} onChange={(e)=>onChange('ngay_ky', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Ngày bắt đầu</label>
            <input type="date" className="input" value={form.ngay_batdau||''} onChange={(e)=>onChange('ngay_batdau', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Ngày kết thúc</label>
            <div className="space-y-2">
              <input 
                type="date" 
                className="input" 
                value={form.ngay_ketthuc||''} 
                onChange={(e)=>onChange('ngay_ketthuc', e.target.value)}
                disabled={voThoiHan}
              />
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={voThoiHan}
                  onChange={(e) => {
                    setVoThoiHan(e.target.checked)
                    if (e.target.checked) {
                      onChange('ngay_ketthuc', '')
                    }
                  }}
                  className="rounded"
                />
                <span className="text-gray-700">∞ Vô thời hạn</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">Trạng thái</label>
            <select className="input" value={form.trangThai as any} onChange={(e)=>onChange('trangThai', e.target.value)}>
              <option value="CON_HIEU_LUC">Còn hiệu lực</option>
              <option value="HET_HAN">Hết hạn</option>
              <option value="HUY">Hủy</option>
            </select>
          </div>
          <div className="col-span-2">
            {isNewContract ? (
              <div>
                <label className="block text-sm mb-1">Nhân viên (chưa có hợp đồng) *</label>
                <select 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={nhanVienId || ''}
                  onChange={(e) => onChange('nhanVien', e.target.value ? Number(e.target.value) : null)}
                  required
                >
                  <option value="">-- Chọn nhân viên --</option>
                  {(nhanViensWithoutContract || []).map(nv => (
                    <option key={nv.nhanvien_id} value={nv.nhanvien_id}>
                      {nv.ho_ten} - {nv.email}
                    </option>
                  ))}
                </select>
                {nhanViensWithoutContract && nhanViensWithoutContract.length === 0 && (
                  <p className="text-sm text-amber-600 mt-1">⚠️ Tất cả nhân viên đã có hợp đồng</p>
                )}
              </div>
            ) : (
              <NhanVienSelect
                value={nhanVienId}
                onChange={(id) => onChange('nhanVien', id)}
                label="Nhân viên *"
                required
                disabled={!!(initial as any)?.hopdong_id}
              />
            )}
          </div>
          
          {/* Hiển thị thông tin nhân viên */}
          {selectedEmployee && (
            <div className="col-span-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h4 className="font-semibold text-sm mb-2 text-blue-900">👤 Thông tin nhân viên</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Họ tên:</span>
                  <span className="ml-2 font-medium">{selectedEmployee.ho_ten}</span>
                </div>
                <div>
                  <span className="text-gray-600">Email:</span>
                  <span className="ml-2 font-medium">{selectedEmployee.email}</span>
                </div>
                <div>
                  <span className="text-gray-600">SĐT:</span>
                  <span className="ml-2 font-medium">{selectedEmployee.so_dien_thoai || 'Chưa có'}</span>
                </div>
                <div>
                  <span className="text-gray-600">CCCD:</span>
                  <span className="ml-2 font-medium">{selectedEmployee.cccd || 'Chưa có'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Phòng ban:</span>
                  <span className="ml-2 font-medium">{selectedEmployee.phongBan?.ten_phongban || 'Chưa có'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Chức vụ:</span>
                  <span className="ml-2 font-medium">{selectedEmployee.chucVu?.ten_chucvu || 'Chưa có'}</span>
                </div>
                {selectedEmployee.chucVu?.luong_co_ban && (
                  <div className="col-span-2">
                    <span className="text-gray-600">Lương cơ bản chức vụ:</span>
                    <span className="ml-2 font-semibold text-green-700">
                      {Number(selectedEmployee.chucVu.luong_co_ban).toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="col-span-2">
            <label className="block text-sm mb-1">Ghi chú</label>
            <textarea className="input" value={form.ghiChu||''} onChange={(e)=>onChange('ghiChu', e.target.value)} />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onCancel} className="btn-ghost">Hủy</button>
          <button disabled={submitting} onClick={()=>onSubmit(form)} className="btn-primary disabled:opacity-50">Lưu</button>
        </div>
      </div>
    </div>
  )
}

function daysUntil(dateStr?: string | null) {
  if (!dateStr) return Infinity
  const now = new Date()
  const target = new Date(dateStr as string)
  const diff = Math.ceil((+target - +now) / (1000*60*60*24))
  return diff
}

export default function HopDongList() {
  const [size] = useState(100) // Lấy tất cả để group
  const [showForm, setShowForm] = useState<null | Partial<HopDong>>(null)
  const [expandedPhongBan, setExpandedPhongBan] = useState<number | null>(null)
  const { data, isLoading, error } = useHopDongList(0, size)
  const { data: phongBanData } = usePhongBanList(0, 100)
  const createMut = useCreateHopDong()
  const updateMut = useUpdateHopDong()
  const deleteMut = useDeleteHopDong()
  const { user } = useAuthStore()

  const pageData = data || { content: [], totalElements: 0, totalPages: 0, number: 0, size }
  const phongBans = phongBanData?.content || []
  const isEmployee = useMemo(()=> user?.role === 'EMPLOYEE', [user?.role])
  const filteredContent = useMemo(() => {
    if (!isEmployee) return pageData.content
    const myId = user?.nhanVienId
    return (pageData.content || []).filter((hd: any) => (hd.nhanVien?.nhanvien_id ?? hd.nhanVien) === myId)
  }, [isEmployee, pageData, user])
  
  // Group hợp đồng theo phòng ban
  const hopDongByPhongBan = useMemo(() => {
    const grouped: Record<number, any[]> = {}
    filteredContent.forEach((hd: any) => {
      const phongbanId = hd.nhanVien?.phongBan?.phongban_id
      if (phongbanId) {
        if (!grouped[phongbanId]) grouped[phongbanId] = []
        grouped[phongbanId].push(hd)
      }
    })
    return grouped
  }, [filteredContent])

  const onSubmit = async (form: Partial<HopDong>) => {
    try {
      const payload: any = {
        ...form,
        nhanVien:
          typeof form.nhanVien === 'number'
            ? form.nhanVien
            : (form.nhanVien as any)?.nhanvien_id,
      }
      if ((showForm as any)?.hopdong_id) {
        await updateMut.mutateAsync({ id: (showForm as any).hopdong_id, body: payload })
      } else {
        await createMut.mutateAsync(payload)
      }
      setShowForm(null)
    } catch {}
  }

  

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
      default: return tt
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hợp đồng lao động</h1>
          <p className="text-sm text-gray-500 mt-1">Quản lý hợp đồng theo phòng ban</p>
        </div>
        {!isEmployee && (
          <button 
            onClick={()=>setShowForm({ isNewContract: true } as any)} 
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            <span>➕ Thêm hợp đồng</span>
          </button>
        )}
      </div>
      
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-gray-500">Đang tải...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">Lỗi tải dữ liệu</div>
      ) : (
        <>
          <div className="space-y-3">
            {phongBans.map((pb: any) => {
              const hopDongs = hopDongByPhongBan[pb.phongban_id] || []
              if (hopDongs.length === 0) return null
              
              const isExpanded = expandedPhongBan === pb.phongban_id
              
              return (
                <div key={pb.phongban_id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                  {/* Header */}
                  <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                    <button
                      onClick={() => setExpandedPhongBan(isExpanded ? null : pb.phongban_id)}
                      className="flex-1 flex items-center gap-4 text-left"
                    >
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{pb.ten_phongban}</h3>
                        <p className="text-sm text-gray-500">Địa điểm: {pb.dia_diem}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                          {hopDongs.length} hợp đồng
                        </div>
                        <svg
                          className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>
                  </div>
                  
                  {/* Danh sách hợp đồng */}
                  {isExpanded && (
                    <div className="border-t border-gray-200 bg-gray-50">
                      <div className="p-4 space-y-3">
                        {hopDongs.map((hd: any) => {
                          const days = daysUntil(hd.ngay_ketthuc)
                          const isExpiring = hd.ngay_ketthuc && days <= 30 && days > 0
                          const isExpired = hd.ngay_ketthuc && days <= 0
                          
                          return (
                            <div key={hd.hopdong_id} className={`bg-white rounded-lg border p-4 hover:shadow-md transition-all ${
                              isExpired ? 'border-red-300 bg-red-50' : 
                              isExpiring ? 'border-yellow-300 bg-yellow-50' : 
                              'border-gray-200'
                            }`}>
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <Link
                                      to={`/nhanvien/${hd.nhanVien?.nhanvien_id}`}
                                      className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                                    >
                                      {hd.nhanVien?.ho_ten || 'Không rõ'}
                                    </Link>
                                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                                      {hd.nhanVien?.chucVu?.ten_chucvu || 'Chưa có chức vụ'}
                                    </span>
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
                                        {hd.luongCoBan?.toLocaleString('vi-VN')}đ
                                      </span>
                                    </div>
                                  </div>
                                  
                                  {hd.ghiChu && (
                                    <p className="text-sm text-gray-600 mt-2">📝 {hd.ghiChu}</p>
                                  )}
                                  
                                  {isExpiring && (
                                    <div className="mt-2 flex items-center gap-2 text-xs text-yellow-700 bg-yellow-100 px-2 py-1 rounded">
                                      <span>⚠️</span>
                                      <span>Sắp hết hạn trong {days} ngày</span>
                                    </div>
                                  )}
                                  {isExpired && (
                                    <div className="mt-2 flex items-center gap-2 text-xs text-red-700 bg-red-100 px-2 py-1 rounded">
                                      <span>❌</span>
                                      <span>Đã hết hạn</span>
                                    </div>
                                  )}
                                </div>
                                
                                {!isEmployee && (
                                  <div className="flex gap-2 ml-4">
                                    <button
                                      onClick={() => setShowForm(hd)}
                                      className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                      title="Sửa"
                                    >
                                      📝
                                    </button>
                                    <button
                                      onClick={() => {
                                        if (confirm('Xác nhận xóa hợp đồng này?')) deleteMut.mutate(hd.hopdong_id)
                                      }}
                                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                      title="Xóa"
                                    >
                                      🗑️
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
            
            {filteredContent.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl">
                <div className="text-6xl mb-4">📋</div>
                <p className="text-gray-500">Chưa có hợp đồng nào</p>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow">
            <div className="text-sm text-gray-600">
              Tổng: <span className="font-semibold">{filteredContent.length}</span> hợp đồng
            </div>
          </div>
        </>
      )}

      {showForm && (
        <HDForm 
          initial={showForm} 
          submitting={createMut.isPending||updateMut.isPending} 
          onSubmit={onSubmit} 
          onCancel={()=>setShowForm(null)}
          isNewContract={(showForm as any)?.isNewContract}
        />
      )}
    </div>
  )
}
