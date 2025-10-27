import { useState } from 'react'
import type { TaiKhoan } from '../../api/taikhoan'
import { useCreateTaiKhoan, useDeleteTaiKhoan, useTaiKhoanList, useUpdateTaiKhoan } from '../../api/taikhoan'

function TKForm({ initial, onSubmit, onCancel, submitting }: { initial?: Partial<TaiKhoan>; onSubmit: (v: Partial<TaiKhoan>) => void; onCancel: () => void; submitting?: boolean }) {
  const [form, setForm] = useState<Partial<TaiKhoan>>({
    ten_dangnhap: initial?.ten_dangnhap || '',
    mat_khau: '', // để trống nếu không đổi
    quyen_han: (initial?.quyen_han as any) || 'EMPLOYEE',
  })
  const onChange = (k: keyof TaiKhoan, v: any) => setForm((s) => ({ ...s, [k]: v }))
  const submit = () => {
    const payload: any = { ten_dangnhap: form.ten_dangnhap, quyen_han: form.quyen_han }
    if (form.mat_khau && form.mat_khau.trim()) payload.mat_khau = form.mat_khau
    onSubmit(payload)
  }
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
      <div className="bg-white p-4 rounded shadow w-full max-w-xl">
        <h3 className="text-lg font-semibold mb-3">{(initial as any)?.taikhoan_id ? 'Cập nhật' : 'Tạo'} tài khoản</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Tên đăng nhập</label>
            <input className="w-full border rounded px-3 py-2" value={form.ten_dangnhap||''} onChange={(e)=>onChange('ten_dangnhap', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Mật khẩu { (initial as any)?.taikhoan_id ? '(để trống nếu không đổi)' : '' }</label>
            <input type="password" className="w-full border rounded px-3 py-2" value={form.mat_khau||''} onChange={(e)=>onChange('mat_khau', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Quyền hạn</label>
            <select className="w-full border rounded px-3 py-2" value={form.quyen_han as any} onChange={(e)=>onChange('quyen_han', e.target.value)}>
              <option value="EMPLOYEE">EMPLOYEE</option>
              <option value="MANAGER">MANAGER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onCancel} className="px-3 py-1.5 rounded border">Hủy</button>
          <button disabled={submitting} onClick={submit} className="px-3 py-1.5 rounded bg-black text-white disabled:opacity-50">Lưu</button>
        </div>
      </div>
    </div>
  )
}

export default function TaiKhoanList() {
  const [page, setPage] = useState(0)
  const [size] = useState(10)
  const [showForm, setShowForm] = useState<null | Partial<TaiKhoan>>(null)
  const { data, isLoading, error } = useTaiKhoanList(page, size)
  const createMut = useCreateTaiKhoan()
  const updateMut = useUpdateTaiKhoan()
  const deleteMut = useDeleteTaiKhoan()

  const pageData = data || { content: [], totalElements: 0, totalPages: 0, number: 0, size }

  const onSubmit = async (form: Partial<TaiKhoan>) => {
    try {
      if ((showForm as any)?.taikhoan_id) {
        await updateMut.mutateAsync({ id: (showForm as any).taikhoan_id, body: form })
      } else {
        await createMut.mutateAsync(form)
      }
      setShowForm(null)
    } catch {}
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Tài khoản</h1>
        <button onClick={()=>setShowForm({})} className="bg-black text-white px-3 py-1.5 rounded">Tạo tài khoản</button>
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
                <th className="p-2">Tên đăng nhập</th>
                <th className="p-2">Quyền hạn</th>
                <th className="p-2 w-40">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {pageData.content.map((tk: any) => (
                <tr key={tk.taikhoan_id} className="border-t">
                  <td className="p-2">{tk.taikhoan_id}</td>
                  <td className="p-2">{tk.ten_dangnhap}</td>
                  <td className="p-2">{tk.quyen_han}</td>
                  <td className="p-2 flex gap-2">
                    <button onClick={()=>setShowForm(tk)} className="px-2 py-1 border rounded">Sửa</button>
                    <button onClick={()=>deleteMut.mutate(tk.taikhoan_id)} className="px-2 py-1 border rounded text-red-600">Xoá</button>
                  </td>
                </tr>
              ))}
              {pageData.content.length === 0 && (
                <tr>
                  <td className="p-3 text-center text-gray-500" colSpan={4}>Không có dữ liệu</td>
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
        <TKForm initial={showForm} submitting={createMut.isPending||updateMut.isPending} onSubmit={onSubmit} onCancel={()=>setShowForm(null)} />
      )}
    </div>
  )
}
