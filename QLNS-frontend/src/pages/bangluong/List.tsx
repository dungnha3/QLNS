import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { BangLuong } from '../../api/bangluong'
import { useBangLuongList, useCreateBangLuong, useDeleteBangLuong, useUpdateBangLuong } from '../../api/bangluong'
import { useChucVuList } from '../../api/chucvu'
import { useAuthStore } from '../../stores/auth'
import { TinhLuongModal } from './TinhLuongModal'

function BLForm({ initial, onSubmit, onCancel, submitting }: { initial?: Partial<BangLuong>; onSubmit: (v: Partial<BangLuong>) => void; onCancel: () => void; submitting?: boolean }) {
  const [form, setForm] = useState<Partial<BangLuong>>({
    nhanVien: typeof initial?.nhanVien === 'number' ? initial?.nhanVien : (initial?.nhanVien as any)?.nhanvien_id || undefined,
    thang: initial?.thang || new Date().getMonth() + 1,
    nam: initial?.nam || new Date().getFullYear(),
    luong_co_ban: initial?.luong_co_ban || 0,
    phu_cap: initial?.phu_cap || 0,
    khau_tru: initial?.khau_tru || 0,
    trangThai: initial?.trangThai || 'CHO_DUYET',
  })
  const onChange = (k: keyof BangLuong, v: any) => setForm((s) => ({ ...s, [k]: v }))
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-xl w-full max-w-2xl">
        <h3 className="text-lg font-semibold mb-3">{(initial as any)?.bangluong_id ? 'Cập nhật' : 'Thêm'} bảng lương</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-3">
            <label className="block text-sm mb-1">Nhân viên ID</label>
            <input type="number" className="w-full border rounded px-3 py-2" value={(form.nhanVien as any)??''} onChange={(e)=>onChange('nhanVien', Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-sm mb-1">Tháng</label>
            <select className="w-full border rounded px-3 py-2" value={form.thang as any} onChange={(e)=>onChange('thang', Number(e.target.value))}>
              {Array.from({ length: 12 }).map((_, i)=> <option key={i+1} value={i+1}>Tháng {i+1}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Năm</label>
            <input type="number" className="w-full border rounded px-3 py-2" value={form.nam as any} onChange={(e)=>onChange('nam', Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-sm mb-1">Lương cơ bản</label>
            <input type="number" className="w-full border rounded px-3 py-2" value={form.luong_co_ban as any} onChange={(e)=>onChange('luong_co_ban', Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-sm mb-1">Phụ cấp</label>
            <input type="number" className="w-full border rounded px-3 py-2" value={form.phu_cap as any} onChange={(e)=>onChange('phu_cap', Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-sm mb-1">Khấu trừ</label>
            <input type="number" className="w-full border rounded px-3 py-2" value={form.khau_tru as any} onChange={(e)=>onChange('khau_tru', Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-sm mb-1">Trạng thái</label>
            <select className="w-full border rounded px-3 py-2" value={form.trangThai as any} onChange={(e)=>onChange('trangThai', e.target.value)}>
              <option value="CHO_DUYET">Chờ duyệt</option>
              <option value="DA_DUYET">Đã duyệt</option>
              <option value="DA_THANH_TOAN">Đã thanh toán</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onCancel} className="px-3 py-1.5 rounded-lg border hover:bg-gray-50 transition-colors">Hủy</button>
          <button disabled={submitting} onClick={()=>onSubmit(form)} className="px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors">Lưu</button>
        </div>
      </div>
    </div>
  )
}

export default function BangLuongList() {
  const [page, setPage] = useState(0)
  const [size] = useState(100) // Lấy tất cả để group
  const [trangThai, setTrangThai] = useState<string>('')
  const [showForm, setShowForm] = useState<null | Partial<BangLuong>>(null)
  const [showAuto, setShowAuto] = useState(false)
  const [expandedChucVu, setExpandedChucVu] = useState<number | null>(null)
  const { data, isLoading, error } = useBangLuongList(page, size, trangThai || undefined)
  const { data: chucVuData } = useChucVuList(0, 100)
  const createMut = useCreateBangLuong()
  const updateMut = useUpdateBangLuong()
  const deleteMut = useDeleteBangLuong()
  const { user } = useAuthStore()
  const isEmployee = user?.role === 'EMPLOYEE'

  const pageData = data || { content: [], totalElements: 0, totalPages: 0, number: 0, size }
  const chucVus = chucVuData?.content || []
  const filteredContent = useMemo(() => {
    if (!isEmployee) return pageData.content
    const myId = user?.nhanVienId
    return (pageData.content || []).filter((bl: any) => (bl.nhanVien?.nhanvien_id ?? bl.nhanVien) === myId)
  }, [isEmployee, pageData, user])
  
  // Group bảng lương theo chức vụ
  const bangLuongByChucVu = useMemo(() => {
    const grouped: Record<number, any[]> = {}
    filteredContent.forEach((bl: any) => {
      const chucvuId = bl.nhanVien?.chucVu?.chucvu_id
      if (chucvuId) {
        if (!grouped[chucvuId]) grouped[chucvuId] = []
        grouped[chucvuId].push(bl)
      }
    })
    return grouped
  }, [filteredContent])

  const onSubmit = async (form: Partial<BangLuong>) => {
    try {
      const payload: any = { ...form, nhanVien: form.nhanVien }
      if ((showForm as any)?.bangluong_id) {
        await updateMut.mutateAsync({ id: (showForm as any).bangluong_id, body: payload })
      } else {
        await createMut.mutateAsync(payload)
      }
      setShowForm(null)
    } catch {}
  }
  
  const getTrangThaiLabel = (tt?: string) => {
    switch (tt) {
      case 'CHO_DUYET': return 'Chờ duyệt'
      case 'DA_DUYET': return 'Đã duyệt'
      case 'DA_THANH_TOAN': return 'Đã thanh toán'
      default: return tt
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bảng lương</h1>
          <p className="text-sm text-gray-500 mt-1">Quản lý lương theo chức vụ</p>
        </div>
        {!isEmployee && (
          <button onClick={()=>setShowAuto(true)} className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2.5 rounded-lg font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all">
            <span>⚡</span>
            <span>Tính lương tự động</span>
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 bg-white p-4 rounded-lg shadow">
        <select className="border border-gray-300 rounded-lg px-3 py-2" value={trangThai} onChange={(e)=>{ setTrangThai(e.target.value); setPage(0) }}>
          <option value="">Tất cả trạng thái</option>
          <option value="CHO_DUYET">Chờ duyệt</option>
          <option value="DA_DUYET">Đã duyệt</option>
          <option value="DA_THANH_TOAN">Đã thanh toán</option>
        </select>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-gray-500">Đang tải...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">Lỗi tải dữ liệu</div>
      ) : (
        <div className="space-y-3">
          {chucVus.map((cv: any) => {
            const bangLuongs = bangLuongByChucVu[cv.chucvu_id] || []
            if (bangLuongs.length === 0) return null
            
            const isExpanded = expandedChucVu === cv.chucvu_id
            const cvTotal = bangLuongs.reduce((s, bl: any) => s + (Number(bl.thuc_lanh) || 0), 0)
            
            return (
              <div key={cv.chucvu_id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                {/* Header */}
                <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                  <button
                    onClick={() => setExpandedChucVu(isExpanded ? null : cv.chucvu_id)}
                    className="flex-1 flex items-center gap-4 text-left"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                      <span className="text-white text-xl">💰</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">{cv.ten_chucvu}</h3>
                      <p className="text-sm text-gray-500">{cv.mo_ta || cv.ten_chucvu}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                        {bangLuongs.length} bảng lương
                      </div>
                      <div className="text-sm font-semibold text-green-600">
                        {cvTotal.toLocaleString('vi-VN')}đ
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
                
                {/* Danh sách bảng lương */}
                {isExpanded && (
                  <div className="border-t border-gray-200 bg-gray-50">
                    <div className="overflow-x-auto p-4">
                      <div className="space-y-3">
                        {bangLuongs.map((bl: any) => (
                          <div key={bl.bangluong_id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <Link
                                  to={`/nhanvien/${bl.nhanVien?.nhanvien_id}`}
                                  className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                                >
                                  {bl.nhanVien?.ho_ten || '-'}
                                </Link>
                                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                  {bl.thang}/{bl.nam}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  bl.trangThai === 'DA_THANH_TOAN' ? 'bg-green-100 text-green-700' :
                                  bl.trangThai === 'DA_DUYET' ? 'bg-blue-100 text-blue-700' :
                                  'bg-yellow-100 text-yellow-700'
                                }`}>
                                  {getTrangThaiLabel(bl.trangThai)}
                                </span>
                                {!isEmployee && (
                                  <div className="flex gap-1">
                                    <button
                                      onClick={() => setShowForm(bl)}
                                      className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors"
                                      title="Sửa"
                                    >
                                      📝
                                    </button>
                                    {bl.trangThai !== 'DA_DUYET' && bl.trangThai !== 'DA_THANH_TOAN' && (
                                      <button
                                        onClick={() => updateMut.mutate({ id: bl.bangluong_id, body: { trangThai: 'DA_DUYET' } })}
                                        className="p-1.5 hover:bg-green-50 rounded-lg transition-colors"
                                        title="Duyệt"
                                      >
                                        ✅
                                      </button>
                                    )}
                                    {bl.trangThai === 'DA_DUYET' && (
                                      <button
                                        onClick={() => updateMut.mutate({ id: bl.bangluong_id, body: { trangThai: 'DA_THANH_TOAN' } })}
                                        className="p-1.5 hover:bg-green-50 rounded-lg transition-colors"
                                        title="Thanh toán"
                                      >
                                        💸
                                      </button>
                                    )}
                                    <button
                                      onClick={() => {
                                        if (confirm('Xác nhận xóa bảng lương này?')) deleteMut.mutate(bl.bangluong_id)
                                      }}
                                      className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                                      title="Xóa"
                                    >
                                      🗑️
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-3">
                              <div>
                                <span className="text-gray-500">Lương cơ bản:</span>
                                <span className="ml-2 font-semibold text-gray-900">{Number(bl.luong_co_ban)?.toLocaleString('vi-VN') || 0}đ</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Phụ cấp:</span>
                                <span className="ml-2 font-semibold text-green-600">+{Number(bl.phu_cap)?.toLocaleString('vi-VN') || 0}đ</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Khấu trừ:</span>
                                <span className="ml-2 font-semibold text-red-600">-{Number(bl.khau_tru)?.toLocaleString('vi-VN') || 0}đ</span>
                              </div>
                              <div className="md:col-span-1">
                                <span className="text-gray-500 font-medium">Thực lãnh:</span>
                                <span className="ml-2 font-bold text-xl text-blue-600">{Number(bl.thuc_lanh)?.toLocaleString('vi-VN') || 0}đ</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
          
          {filteredContent.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl">
              <div className="text-6xl mb-4">💰</div>
              <p className="text-gray-500">Chưa có bảng lương nào</p>
            </div>
          )}
        </div>
      )}

      {showForm && (
        <BLForm initial={showForm} submitting={createMut.isPending||updateMut.isPending} onSubmit={onSubmit} onCancel={()=>setShowForm(null)} />
      )}

      {showAuto && (
        <TinhLuongModal
          onClose={() => setShowAuto(false)}
          onSuccess={() => setShowAuto(false)}
        />
      )}
    </div>
  )
}
