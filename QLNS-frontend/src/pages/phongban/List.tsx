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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Phòng ban</h1>
        <button onClick={()=>setShowForm({})} className="bg-black text-white px-3 py-1.5 rounded">Thêm mới</button>
      </div>
      {isLoading ? (
        <div>Đang tải...</div>
      ) : error ? (
        <div className="text-red-600">Lỗi tải dữ liệu</div>
      ) : (
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="p-2">ID</th>
                <th className="p-2">Tên phòng ban</th>
                <th className="p-2">Địa điểm</th>
                <th className="p-2">Số lượng NV</th>
                <th className="p-2 w-40">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {pageData.content.map((pb) => (
                <tr key={pb.phongban_id} className="border-t">
                  <td className="p-2">{pb.phongban_id}</td>
                  <td className="p-2">{pb.ten_phongban}</td>
                  <td className="p-2">{pb.dia_diem}</td>
                  <td className="p-2">{pb.soLuongNhanVien ?? '-'}</td>
                  <td className="p-2 flex gap-2">
                    <Link to={`/phongban/${pb.phongban_id}`} className="px-2 py-1 border rounded">Chi tiết</Link>
                    <button onClick={()=>setShowForm(pb)} className="px-2 py-1 border rounded">Sửa</button>
                    <button onClick={()=>deleteMut.mutate(pb.phongban_id)} className="px-2 py-1 border rounded text-red-600">Xoá</button>
                  </td>
                </tr>
              ))}
              {pageData.content.length === 0 && (
                <tr>
                  <td className="p-3 text-center text-gray-500" colSpan={5}>Không có dữ liệu</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex items-center justify-between">
        <div>Tổng: {pageData.totalElements}</div>
        <div className="flex items-center gap-2">
          <button className="px-2 py-1 border rounded" disabled={page<=0} onClick={()=>setPage((p)=>p-1)}>Trước</button>
          <span>Trang {page+1}/{Math.max(1, pageData.totalPages)}</span>
          <button className="px-2 py-1 border rounded" disabled={page+1>=pageData.totalPages} onClick={()=>setPage((p)=>p+1)}>Sau</button>
        </div>
      </div>

      {showForm && (
        <PBForm initial={showForm} submitting={createMut.isPending||updateMut.isPending} onSubmit={onSubmit} onCancel={()=>setShowForm(null)} />
      )}
    </div>
  )
}
