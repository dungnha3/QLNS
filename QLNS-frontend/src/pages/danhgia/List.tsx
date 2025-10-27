import { useMemo, useState } from 'react'
import type { DanhGia } from '../../api/danhgia'
import { useCreateDanhGia, useDeleteDanhGia, useDanhGiaList, useUpdateDanhGia } from '../../api/danhgia'
import { useAuthStore } from '../../stores/auth'

function DGForm({ initial, onSubmit, onCancel, submitting }: { initial?: Partial<DanhGia>; onSubmit: (v: Partial<DanhGia>) => void; onCancel: () => void; submitting?: boolean }) {
  const [form, setForm] = useState<Partial<DanhGia>>({
    nhanVien: typeof initial?.nhanVien === 'number' ? initial?.nhanVien : (initial?.nhanVien as any)?.nhanvien_id || undefined,
    nguoiDanhGia: typeof initial?.nguoiDanhGia === 'number' ? initial?.nguoiDanhGia : (initial?.nguoiDanhGia as any)?.nhanvien_id || undefined,
    kyDanhGia: initial?.kyDanhGia || new Date().toISOString().slice(0,10),
    loaiDanhGia: initial?.loaiDanhGia || 'NAM',
    diemChuyenMon: initial?.diemChuyenMon || 8,
    diemThaiDo: initial?.diemThaiDo || 8,
    diemKyNang: initial?.diemKyNang || 8,
    nhanXet: initial?.nhanXet || '',
    mucTieuKeTiep: initial?.mucTieuKeTiep || '',
  })
  const onChange = (k: keyof DanhGia, v: any) => setForm((s) => ({ ...s, [k]: v }))
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
      <div className="bg-white p-4 rounded shadow w-full max-w-2xl">
        <h3 className="text-lg font-semibold mb-3">{(initial as any)?.danhgia_id ? 'Cập nhật' : 'Tạo'} đánh giá</h3>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-sm mb-1">Nhân viên ID</label>
            <input type="number" className="w-full border rounded px-3 py-2" value={(form.nhanVien as any)??''} onChange={(e)=>onChange('nhanVien', Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-sm mb-1">Người đánh giá ID</label>
            <input type="number" className="w-full border rounded px-3 py-2" value={(form.nguoiDanhGia as any)??''} onChange={(e)=>onChange('nguoiDanhGia', Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-sm mb-1">Kỳ đánh giá</label>
            <input type="date" className="w-full border rounded px-3 py-2" value={form.kyDanhGia as any} onChange={(e)=>onChange('kyDanhGia', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Loại</label>
            <select className="w-full border rounded px-3 py-2" value={form.loaiDanhGia as any} onChange={(e)=>onChange('loaiDanhGia', e.target.value)}>
              <option value="THANG">Tháng</option>
              <option value="QUY">Quý</option>
              <option value="NAM">Năm</option>
              <option value="THU_VIEC">Thử việc</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Điểm chuyên môn</label>
            <input type="number" className="w-full border rounded px-3 py-2" value={form.diemChuyenMon as any} onChange={(e)=>onChange('diemChuyenMon', Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-sm mb-1">Điểm thái độ</label>
            <input type="number" className="w-full border rounded px-3 py-2" value={form.diemThaiDo as any} onChange={(e)=>onChange('diemThaiDo', Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-sm mb-1">Điểm kỹ năng</label>
            <input type="number" className="w-full border rounded px-3 py-2" value={form.diemKyNang as any} onChange={(e)=>onChange('diemKyNang', Number(e.target.value))} />
          </div>
          <div className="col-span-3">
            <label className="block text-sm mb-1">Nhận xét</label>
            <textarea className="w-full border rounded px-3 py-2" value={form.nhanXet||''} onChange={(e)=>onChange('nhanXet', e.target.value)} />
          </div>
          <div className="col-span-3">
            <label className="block text-sm mb-1">Mục tiêu kế tiếp</label>
            <textarea className="w-full border rounded px-3 py-2" value={form.mucTieuKeTiep||''} onChange={(e)=>onChange('mucTieuKeTiep', e.target.value)} />
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

export default function DanhGiaList() {
  const [page, setPage] = useState(0)
  const [size] = useState(10)
  const [showForm, setShowForm] = useState<null | Partial<DanhGia>>(null)
  const { data, isLoading, error } = useDanhGiaList(page, size)
  const createMut = useCreateDanhGia()
  const updateMut = useUpdateDanhGia()
  const deleteMut = useDeleteDanhGia()
  const { user } = useAuthStore()

  const pageData = data || { content: [], totalElements: 0, totalPages: 0, number: 0, size }
  const isEmployee = user?.role === 'EMPLOYEE'

  const content = useMemo(() => {
    if (!isEmployee) return pageData.content
    // EMPLOYEE chỉ xem đánh giá của mình
    return (pageData.content || []).filter((dg: any) => dg.nhanVien?.nhanvien_id === (user as any)?.nhanVienId)
  }, [isEmployee, pageData, user])

  const onSubmit = async (form: Partial<DanhGia>) => {
    try {
      const payload: any = { ...form, nhanVien: form.nhanVien, nguoiDanhGia: form.nguoiDanhGia }
      if ((showForm as any)?.danhgia_id) {
        await updateMut.mutateAsync({ id: (showForm as any).danhgia_id, body: payload })
      } else {
        await createMut.mutateAsync(payload)
      }
      setShowForm(null)
    } catch {}
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Đánh giá</h1>
        {!isEmployee && (
          <button onClick={()=>setShowForm({})} className="bg-black text-white px-3 py-1.5 rounded">Thêm mới</button>
        )}
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
                <th className="p-2">Nhân viên</th>
                <th className="p-2">Người đánh giá</th>
                <th className="p-2">Kỳ</th>
                <th className="p-2">Loại</th>
                <th className="p-2">Điểm TB</th>
                <th className="p-2">Xếp loại</th>
                {!isEmployee && <th className="p-2 w-40">Hành động</th>}
              </tr>
            </thead>
            <tbody>
              {content.map((dg: any) => (
                <tr key={dg.danhgia_id} className="border-t">
                  <td className="p-2">{dg.danhgia_id}</td>
                  <td className="p-2">{dg.nhanVien?.ho_ten || dg.nhanVien?.nhanvien_id || '-'}</td>
                  <td className="p-2">{dg.nguoiDanhGia?.ho_ten || dg.nguoiDanhGia?.nhanvien_id || '-'}</td>
                  <td className="p-2">{dg.kyDanhGia}</td>
                  <td className="p-2">{dg.loaiDanhGia || '-'}</td>
                  <td className="p-2">{dg.diemTrungBinh?.toFixed ? dg.diemTrungBinh.toFixed(2) : (dg.diemTrungBinh ?? '-')}</td>
                  <td className="p-2">{dg.xepLoai || '-'}</td>
                  {!isEmployee && (
                    <td className="p-2 flex gap-2">
                      <button onClick={()=>setShowForm(dg)} className="px-2 py-1 border rounded">Sửa</button>
                      <button onClick={()=>deleteMut.mutate(dg.danhgia_id)} className="px-2 py-1 border rounded text-red-600">Xoá</button>
                    </td>
                  )}
                </tr>
              ))}
              {content.length === 0 && (
                <tr>
                  <td className="p-3 text-center text-gray-500" colSpan={isEmployee?7:8}>Không có dữ liệu</td>
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
        <DGForm initial={showForm} submitting={createMut.isPending||updateMut.isPending} onSubmit={onSubmit} onCancel={()=>setShowForm(null)} />
      )}
    </div>
  )
}
