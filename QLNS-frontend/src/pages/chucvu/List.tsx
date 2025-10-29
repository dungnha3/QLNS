import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { ChucVu } from '../../api/chucvu'
import { useChucVuList, useCreateChucVu, useUpdateChucVu, useDeleteChucVu } from '../../api/chucvu'
import { useNhanVienList } from '../../api/nhanvien'

function CVForm({ initial, onSubmit, onCancel, submitting }: { initial?: Partial<ChucVu>; onSubmit: (v: Partial<ChucVu>) => void; onCancel: () => void; submitting?: boolean }) {
  const [form, setForm] = useState<Partial<ChucVu>>({
    ten_chucvu: initial?.ten_chucvu || '',
    mo_ta: initial?.mo_ta || '',
    luong_co_ban: initial?.luong_co_ban || '',
    mucLuongToiThieu: initial?.mucLuongToiThieu || undefined,
    mucLuongToiDa: initial?.mucLuongToiDa || undefined,
  })
  const onChange = (k: keyof ChucVu, v: any) => setForm((s) => ({ ...s, [k]: v }))
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
      <div className="bg-white p-4 rounded shadow w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-3">{initial?.chucvu_id ? 'Cập nhật' : 'Thêm'} chức vụ</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Tên chức vụ *</label>
            <input 
              className="w-full border rounded px-3 py-2" 
              value={form.ten_chucvu||''} 
              onChange={(e)=>onChange('ten_chucvu', e.target.value)}
              placeholder="Ví dụ: Giám đốc, Trưởng phòng, Nhân viên..."
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Mô tả *</label>
            <textarea 
              className="w-full border rounded px-3 py-2" 
              value={form.mo_ta||''} 
              onChange={(e)=>onChange('mo_ta', e.target.value)}
              placeholder="Mô tả chi tiết về chức vụ..."
              rows={3}
              required
            />
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h4 className="font-semibold text-sm mb-2 text-blue-900">💰 Thông tin lương</h4>
            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="block text-sm mb-1">Lương cơ bản *</label>
                <input 
                  type="number"
                  className="w-full border rounded px-3 py-2" 
                  value={form.luong_co_ban||''} 
                  onChange={(e)=>onChange('luong_co_ban', e.target.value)}
                  placeholder="Ví dụ: 15000000"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Lương cơ bản mặc định cho chức vụ này</p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm mb-1">Mức lương tối thiểu</label>
                  <input 
                    type="number"
                    className="w-full border rounded px-3 py-2" 
                    value={form.mucLuongToiThieu??''} 
                    onChange={(e)=>onChange('mucLuongToiThieu', e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="Ví dụ: 10000000"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Mức lương tối đa</label>
                  <input 
                    type="number"
                    className="w-full border rounded px-3 py-2" 
                    value={form.mucLuongToiDa??''} 
                    onChange={(e)=>onChange('mucLuongToiDa', e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="Ví dụ: 20000000"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500">💡 Khoảng lương cho phép điều chỉnh theo năng lực</p>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onCancel} className="px-3 py-1.5 rounded border hover:bg-gray-50 transition-colors">Hủy</button>
          <button disabled={submitting} onClick={()=>onSubmit(form)} className="px-3 py-1.5 rounded bg-black text-white hover:bg-gray-800 disabled:opacity-50 transition-colors">Lưu</button>
        </div>
      </div>
    </div>
  )
}

export default function ChucVuList() {
  const [page, setPage] = useState(0)
  const [size] = useState(10)
  const [showForm, setShowForm] = useState<null | Partial<ChucVu>>(null)
  const [expandedCV, setExpandedCV] = useState<number | null>(null)
  const { data, isLoading, error } = useChucVuList(page, size)
  const { data: nvPage } = useNhanVienList(0, 100, '')
  const createMut = useCreateChucVu()
  const updateMut = useUpdateChucVu()
  const deleteMut = useDeleteChucVu()

  const pageData = data || { content: [], totalElements: 0, totalPages: 0, number: 0, size }
  
  const getNhanViensForChucVu = (chucvuId: number) => {
    return (nvPage?.content || []).filter((nv: any) => nv?.chucVu?.chucvu_id === chucvuId)
  }

  const onSubmit = async (form: Partial<ChucVu>) => {
    try {
      if ((showForm as any)?.chucvu_id) {
        await updateMut.mutateAsync({ id: (showForm as any).chucvu_id, body: form })
      } else {
        await createMut.mutateAsync(form)
      }
      setShowForm(null)
    } catch {}
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chức vụ</h1>
          <p className="text-sm text-gray-500 mt-1">Quản lý các chức vụ và xem nhân viên theo chức vụ</p>
        </div>
        <button 
          onClick={()=>setShowForm({})} 
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-gray-700 transition-colors"
        >
          <span>Thêm mới</span>
        </button>
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
            {pageData.content.map((cv) => {
              const nhanViens = getNhanViensForChucVu(cv.chucvu_id)
              const isExpanded = expandedCV === cv.chucvu_id
              
              return (
                <div key={cv.chucvu_id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                  {/* Chức vụ header */}
                  <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                    <button
                      onClick={() => setExpandedCV(isExpanded ? null : cv.chucvu_id)}
                      className="flex-1 flex items-center gap-4 text-left"
                    >
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{cv.ten_chucvu}</h3>
                        <p className="text-sm text-gray-500">{cv.mo_ta || 'Không có mô tả'}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <div className="flex items-center gap-1">
                            <span className="text-gray-600">💰 Lương CB:</span>
                            <span className="font-semibold text-green-700">
                              {cv.luong_co_ban ? Number(cv.luong_co_ban).toLocaleString('vi-VN') + 'đ' : 'Chưa có'}
                            </span>
                          </div>
                          {(cv.mucLuongToiThieu || cv.mucLuongToiDa) && (
                            <div className="flex items-center gap-1">
                              <span className="text-gray-600">📊 Khoảng:</span>
                              <span className="font-medium text-blue-700">
                                {cv.mucLuongToiThieu ? Number(cv.mucLuongToiThieu).toLocaleString('vi-VN') : '0'}đ
                                {' - '}
                                {cv.mucLuongToiDa ? Number(cv.mucLuongToiDa).toLocaleString('vi-VN') : '∞'}đ
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                          {nhanViens.length} nhân viên
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
                    
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => setShowForm(cv)}
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Sửa"
                      >
                        📝
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Xác nhận xóa chức vụ này?')) deleteMut.mutate(cv.chucvu_id)
                        }}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                  
                  {/* Danh sách nhân viên */}
                  {isExpanded && nhanViens.length > 0 && (
                    <div className="border-t border-gray-200 bg-gray-50">
                      <div className="px-4 py-3">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Danh sách nhân viên</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {nhanViens.map((nv: any) => (
                            <Link
                              key={nv.nhanvien_id}
                              to={`/nhanvien/${nv.nhanvien_id}`}
                              className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-400 hover:shadow-md transition-all"
                            >
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-gray-900 truncate">{nv.ho_ten}</div>
                                <div className="text-xs text-gray-500 truncate">{nv.email}</div>
                              </div>
                              <span className="text-gray-500">→</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
            
            {pageData.content.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl">
                <div className="text-6xl mb-4">🎯</div>
                <p className="text-gray-500">Chưa có chức vụ nào</p>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow">
            <div className="text-sm text-gray-600">Tổng: <span className="font-semibold">{pageData.totalElements}</span> chức vụ</div>
            <div className="flex items-center gap-2">
              <button 
                className="px-3 py-1.5 border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors" 
                disabled={page<=0} 
                onClick={()=>setPage((p)=>p-1)}
              >
                ← Trước
              </button>
              <span className="text-sm px-3">Trang {page+1}/{Math.max(1, pageData.totalPages)}</span>
              <button 
                className="px-3 py-1.5 border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors" 
                disabled={page+1>=pageData.totalPages} 
                onClick={()=>setPage((p)=>p+1)}
              >
                Sau →
              </button>
            </div>
          </div>
        </>
      )}

      {showForm && (
        <CVForm initial={showForm} submitting={createMut.isPending||updateMut.isPending} onSubmit={onSubmit} onCancel={()=>setShowForm(null)} />
      )}
    </div>
  )
}
