import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { NhanVien } from '../../api/nhanvien'
import { useCreateNhanVien, useDeleteNhanVien, useNhanVienList, useUpdateNhanVien } from '../../api/nhanvien'

function NVForm({ initial, onSubmit, onCancel, submitting }: { initial?: Partial<NhanVien>; onSubmit: (v: Partial<NhanVien>) => void; onCancel: () => void; submitting?: boolean }) {
  const [form, setForm] = useState<Partial<NhanVien>>({
    ho_ten: initial?.ho_ten || '',
    email: initial?.email || '',
    gioi_tinh: (initial?.gioi_tinh as any) || 'Nam',
    dia_chi: initial?.dia_chi || '',
    ngay_sinh: initial?.ngay_sinh || '',
    ngay_vao_lam: initial?.ngay_vao_lam || '',
    so_dien_thoai: initial?.so_dien_thoai || '',
    cccd: initial?.cccd || '',
    trangThai: initial?.trangThai || 'DANG_LAM_VIEC',
  })
  const onChange = (k: keyof NhanVien, v: any) => setForm((s) => ({ ...s, [k]: v }))
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
      <div className="bg-white p-4 rounded shadow w-full max-w-2xl">
        <h3 className="text-lg font-semibold mb-3">{initial?.nhanvien_id ? 'Cập nhật' : 'Thêm'} nhân viên</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1">Họ tên</label>
            <input className="w-full border rounded px-3 py-2" value={form.ho_ten||''} onChange={(e)=>onChange('ho_ten', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input type="email" className="w-full border rounded px-3 py-2" value={form.email||''} onChange={(e)=>onChange('email', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Giới tính</label>
            <select className="w-full border rounded px-3 py-2" value={form.gioi_tinh as any} onChange={(e)=>onChange('gioi_tinh', e.target.value as any)}>
              <option>Nam</option>
              <option>Nữ</option>
              <option>Khác</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">SĐT</label>
            <input className="w-full border rounded px-3 py-2" value={form.so_dien_thoai||''} onChange={(e)=>onChange('so_dien_thoai', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">CCCD</label>
            <input className="w-full border rounded px-3 py-2" value={form.cccd||''} onChange={(e)=>onChange('cccd', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Trạng thái</label>
            <select className="w-full border rounded px-3 py-2" value={form.trangThai||'DANG_LAM_VIEC'} onChange={(e)=>onChange('trangThai', e.target.value)}>
              <option value="DANG_LAM_VIEC">Đang làm việc</option>
              <option value="NGHI_VIEC">Nghỉ việc</option>
              <option value="TAM_NGHI">Tạm nghỉ</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Ngày sinh</label>
            <input type="date" className="w-full border rounded px-3 py-2" value={form.ngay_sinh||''} onChange={(e)=>onChange('ngay_sinh', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Ngày vào làm</label>
            <input type="date" className="w-full border rounded px-3 py-2" value={form.ngay_vao_lam||''} onChange={(e)=>onChange('ngay_vao_lam', e.target.value)} />
          </div>
          <div className="col-span-2">
            <label className="block text-sm mb-1">Địa chỉ</label>
            <input className="w-full border rounded px-3 py-2" value={form.dia_chi||''} onChange={(e)=>onChange('dia_chi', e.target.value)} />
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

export default function NhanVienList() {
  const [page, setPage] = useState(0)
  const [size] = useState(10)
  const [q, setQ] = useState('')
  const [showForm, setShowForm] = useState<null | Partial<NhanVien>>(null)
  const { data, isLoading, error } = useNhanVienList(page, size, q)
  const createMut = useCreateNhanVien()
  const updateMut = useUpdateNhanVien()
  const deleteMut = useDeleteNhanVien()

  const pageData = data || { content: [], totalElements: 0, totalPages: 0, number: 0, size }

  const onSubmit = async (form: Partial<NhanVien>) => {
    try {
      const payload: any = {
        ...form,
      }
      if (payload.so_dien_thoai !== undefined && String(payload.so_dien_thoai).trim() === '') delete payload.so_dien_thoai
      if (payload.cccd !== undefined && String(payload.cccd).trim() === '') delete payload.cccd
      if (payload.trangThai !== undefined && String(payload.trangThai).trim() === '') delete payload.trangThai
      // ensure required date fields are strings in YYYY-MM-DD format
      if (payload.ngay_sinh) payload.ngay_sinh = String(payload.ngay_sinh)
      if (payload.ngay_vao_lam) payload.ngay_vao_lam = String(payload.ngay_vao_lam)

      if ((showForm as any)?.nhanvien_id) {
        await updateMut.mutateAsync({ id: (showForm as any).nhanvien_id, body: payload })
      } else {
        await createMut.mutateAsync(payload)
      }
      setShowForm(null)
    } catch {}
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Nhân viên</h1>
        <button onClick={()=>setShowForm({})} className="bg-black text-white px-3 py-1.5 rounded">Thêm mới</button>
      </div>
      <div className="flex gap-2">
        <input placeholder="Tìm theo tên/email" className="border rounded px-3 py-2 w-80" value={q} onChange={(e)=>{ setQ(e.target.value); setPage(0) }} />
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
                <th className="p-2">Họ tên</th>
                <th className="p-2">Email</th>
                <th className="p-2">Giới tính</th>
                <th className="p-2">Trạng thái</th>
                <th className="p-2 w-40">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {pageData.content.map((nv) => (
                <tr key={nv.nhanvien_id} className="border-t">
                  <td className="p-2">{nv.nhanvien_id}</td>
                  <td className="p-2">{nv.ho_ten}</td>
                  <td className="p-2">{nv.email}</td>
                  <td className="p-2">{nv.gioi_tinh}</td>
                  <td className="p-2">{nv.trangThai || '-'}</td>
                  <td className="p-2 flex gap-2">
                    <Link to={`/nhanvien/${nv.nhanvien_id}`} className="px-2 py-1 border rounded">Chi tiết</Link>
                    <button onClick={()=>setShowForm(nv)} className="px-2 py-1 border rounded">Sửa</button>
                    <button onClick={()=>deleteMut.mutate(nv.nhanvien_id)} className="px-2 py-1 border rounded text-red-600">Xoá</button>
                  </td>
                </tr>
              ))}
              {pageData.content.length === 0 && (
                <tr>
                  <td className="p-3 text-center text-gray-500" colSpan={6}>Không có dữ liệu</td>
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
        <NVForm initial={showForm} submitting={createMut.isPending||updateMut.isPending} onSubmit={onSubmit} onCancel={()=>setShowForm(null)} />
      )}
    </div>
  )
}
