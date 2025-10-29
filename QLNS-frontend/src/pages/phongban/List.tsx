import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { PhongBan } from '../../api/phongban'
import { useCreatePhongBan, useDeletePhongBan, usePhongBanList, useUpdatePhongBan } from '../../api/phongban'

function PBForm({ initial, onSubmit, onCancel, submitting }: { initial?: Partial<PhongBan>; onSubmit: (v: Partial<PhongBan>) => void; onCancel: () => void; submitting?: boolean }) {
  const [form, setForm] = useState<Partial<PhongBan>>({
    ten_phongban: initial?.ten_phongban || '',
    dia_diem: initial?.dia_diem || '',
    mo_ta: initial?.mo_ta || '',
  })
  const onChange = (k: keyof PhongBan, v: any) => setForm((s) => ({ ...s, [k]: v }))
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
      <div className="bg-white p-4 rounded shadow w-full max-w-xl">
        <h3 className="text-lg font-semibold mb-3">{initial?.phongban_id ? 'Cập nhật' : 'Thêm'} phòng ban</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Tên phòng ban</label>
            <input className="w-full border rounded px-3 py-2" value={form.ten_phongban||''} onChange={(e)=>onChange('ten_phongban', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Địa điểm</label>
            <input className="w-full border rounded px-3 py-2" value={form.dia_diem||''} onChange={(e)=>onChange('dia_diem', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Mô tả</label>
            <textarea className="w-full border rounded px-3 py-2" value={form.mo_ta||''} onChange={(e)=>onChange('mo_ta', e.target.value)} />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onCancel} className="px-3 py-1.5 rounded border">Hủy</button>
          <button disabled={submitting} onClick={()=>onSubmit(form)} className="px-3 py-1.5 rounded bg-black text-white disabled:opacity-50">Lưu</button>
        </div>
      </div>
    </div>
  )
}

export default function PhongBanList() {
  const [page, setPage] = useState(0)
  const [size] = useState(10)
  const [showForm, setShowForm] = useState<null | Partial<PhongBan>>(null)
  const { data, isLoading, error } = usePhongBanList(page, size)
  const createMut = useCreatePhongBan()
  const updateMut = useUpdatePhongBan()
  const deleteMut = useDeletePhongBan()

  const pageData = data || { content: [], totalElements: 0, totalPages: 0, number: 0, size }

  const onSubmit = async (form: Partial<PhongBan>) => {
    try {
      if ((showForm as any)?.phongban_id) {
        await updateMut.mutateAsync({ id: (showForm as any).phongban_id, body: form })
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
          <h1 className="text-2xl font-bold text-gray-900">Phòng ban</h1>
          <p className="text-sm text-gray-500 mt-1">Chọn phòng ban để xem danh sách nhân viên</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pageData.content.map((pb) => (
              <Link
                key={pb.phongban_id}
                to={`/phongban/${pb.phongban_id}`}
                className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-300"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-xs font-semibold text-gray-400">#{pb.phongban_id}</span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {pb.ten_phongban}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <span>📍</span>
                    <span>{pb.dia_diem}</span>
                  </div>
                  
                  {pb.mo_ta && (
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                      {pb.mo_ta}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-500">Xem chi tiết →</span>
                    <div className="flex gap-1">
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          setShowForm(pb)
                        }}
                        className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Sửa"
                      >
                        📝
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          if (confirm('Xác nhận xóa?')) deleteMut.mutate(pb.phongban_id)
                        }}
                        className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
            
            {pageData.content.length === 0 && (
              <div className="col-span-full text-center py-12">
                <div className="text-6xl mb-4">📂</div>
                <p className="text-gray-500">Chưa có phòng ban nào</p>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow">
            <div className="text-sm text-gray-600">Tổng: <span className="font-semibold">{pageData.totalElements}</span> phòng ban</div>
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
        <PBForm initial={showForm} submitting={createMut.isPending||updateMut.isPending} onSubmit={onSubmit} onCancel={()=>setShowForm(null)} />
      )}
    </div>
  )
}
