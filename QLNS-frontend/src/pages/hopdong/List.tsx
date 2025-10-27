import { useState, useMemo } from 'react'
import type { HopDong } from '../../api/hopdong'
import { useCreateHopDong, useDeleteHopDong, useHopDongList, useUpdateHopDong } from '../../api/hopdong'
import { useAuthStore } from '../../stores/auth'

function HDForm({ initial, onSubmit, onCancel, submitting }: { initial?: Partial<HopDong>; onSubmit: (v: Partial<HopDong>) => void; onCancel: () => void; submitting?: boolean }) {
  const [form, setForm] = useState<Partial<HopDong>>({
    loai_hopdong: (initial?.loai_hopdong as any) || 'CHINH_THUC',
    ngay_batdau: initial?.ngay_batdau || '',
    ngay_ketthuc: initial?.ngay_ketthuc || '',
    ngay_ky: initial?.ngay_ky || '',
    luongCoBan: initial?.luongCoBan || undefined,
    trangThai: (initial?.trangThai as any) || 'CON_HIEU_LUC',
    ghiChu: initial?.ghiChu || '',
    nhanVien: typeof initial?.nhanVien === 'number' ? initial?.nhanVien : (initial?.nhanVien as any)?.nhanvien_id || undefined,
  })
  const onChange = (k: keyof HopDong, v: any) => setForm((s) => ({ ...s, [k]: v }))
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
      <div className="bg-white p-4 rounded shadow w-full max-w-2xl">
        <h3 className="text-lg font-semibold mb-3">{(initial as any)?.hopdong_id ? 'Cập nhật' : 'Thêm'} hợp đồng</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1">Loại hợp đồng</label>
            <select className="w-full border rounded px-3 py-2" value={form.loai_hopdong as any} onChange={(e)=>onChange('loai_hopdong', e.target.value as any)}>
              <option value="THU_VIEC">Thử việc</option>
              <option value="CHINH_THUC">Chính thức</option>
              <option value="HOP_TAC_VIEN">Hợp tác viên</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Lương cơ bản</label>
            <input type="number" className="w-full border rounded px-3 py-2" value={form.luongCoBan??''} onChange={(e)=>onChange('luongCoBan', Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-sm mb-1">Ngày ký</label>
            <input type="date" className="w-full border rounded px-3 py-2" value={form.ngay_ky||''} onChange={(e)=>onChange('ngay_ky', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Ngày bắt đầu</label>
            <input type="date" className="w-full border rounded px-3 py-2" value={form.ngay_batdau||''} onChange={(e)=>onChange('ngay_batdau', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Ngày kết thúc</label>
            <input type="date" className="w-full border rounded px-3 py-2" value={form.ngay_ketthuc||''} onChange={(e)=>onChange('ngay_ketthuc', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Trạng thái</label>
            <select className="w-full border rounded px-3 py-2" value={form.trangThai as any} onChange={(e)=>onChange('trangThai', e.target.value)}>
              <option value="CON_HIEU_LUC">Còn hiệu lực</option>
              <option value="HET_HAN">Hết hạn</option>
              <option value="HUY">Hủy</option>
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-sm mb-1">Nhân viên ID</label>
            <input type="number" className="w-full border rounded px-3 py-2" value={(form.nhanVien as any)??''} onChange={(e)=>onChange('nhanVien', Number(e.target.value))} />
            <p className="text-xs text-gray-500 mt-1">Nhập ID nhân viên liên kết hợp đồng.</p>
          </div>
          <div className="col-span-2">
            <label className="block text-sm mb-1">Ghi chú</label>
            <textarea className="w-full border rounded px-3 py-2" value={form.ghiChu||''} onChange={(e)=>onChange('ghiChu', e.target.value)} />
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

function daysUntil(dateStr?: string | null) {
  if (!dateStr) return Infinity
  const now = new Date()
  const target = new Date(dateStr as string)
  const diff = Math.ceil((+target - +now) / (1000*60*60*24))
  return diff
}

export default function HopDongList() {
  const [page, setPage] = useState(0)
  const [size] = useState(10)
  const [showForm, setShowForm] = useState<null | Partial<HopDong>>(null)
  const { data, isLoading, error } = useHopDongList(page, size)
  const createMut = useCreateHopDong()
  const updateMut = useUpdateHopDong()
  const deleteMut = useDeleteHopDong()
  const { user } = useAuthStore()

  const pageData = data || { content: [], totalElements: 0, totalPages: 0, number: 0, size }
  const isEmployee = useMemo(()=> user?.role === 'EMPLOYEE', [user?.role])
  const filteredContent = useMemo(() => {
    if (!isEmployee) return pageData.content
    const myId = user?.nhanVienId
    return (pageData.content || []).filter((hd: any) => (hd.nhanVien?.nhanvien_id ?? hd.nhanVien) === myId)
  }, [isEmployee, pageData, user])

  const onSubmit = async (form: Partial<HopDong>) => {
    try {
      const payload: any = {
        ...form,
        nhanVien:
          typeof form.nhanVien === 'number'
            ? { nhanvien_id: form.nhanVien }
            : (form.nhanVien as any),
      }
      if ((showForm as any)?.hopdong_id) {
        await updateMut.mutateAsync({ id: (showForm as any).hopdong_id, body: payload })
      } else {
        await createMut.mutateAsync(payload)
      }
      setShowForm(null)
    } catch {}
  }

  

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Hợp đồng</h1>
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
                <th className="p-2">Loại</th>
                <th className="p-2">Ngày ký</th>
                <th className="p-2">Bắt đầu</th>
                <th className="p-2">Kết thúc</th>
                <th className="p-2">Lương CB</th>
                <th className="p-2">Trạng thái</th>
                {!isEmployee && <th className="p-2 w-40">Hành động</th>}
              </tr>
            </thead>
            <tbody>
              {filteredContent.map((hd: any) => {
                const days = daysUntil(hd.ngay_ketthuc)
                const bg = days <= 0 ? 'bg-red-50' : days <= 30 ? 'bg-yellow-50' : ''
                return (
                  <tr key={hd.hopdong_id} className={`border-t ${bg}`}>
                    <td className="p-2">{hd.hopdong_id}</td>
                    <td className="p-2">{hd.nhanVien?.ho_ten || hd.nhanVien?.nhanvien_id || '-'}</td>
                    <td className="p-2">{hd.loai_hopdong}</td>
                    <td className="p-2">{hd.ngay_ky}</td>
                    <td className="p-2">{hd.ngay_batdau}</td>
                    <td className="p-2">{hd.ngay_ketthuc || '-'}</td>
                    <td className="p-2">{hd.luongCoBan ?? '-'}</td>
                    <td className="p-2">{hd.trangThai || '-'}</td>
                    {!isEmployee && (
                      <td className="p-2 flex gap-2">
                        <button onClick={()=>setShowForm(hd)} className="px-2 py-1 border rounded">Sửa</button>
                        <button onClick={()=>deleteMut.mutate(hd.hopdong_id)} className="px-2 py-1 border rounded text-red-600">Xoá</button>
                      </td>
                    )}
                  </tr>
                )
              })}
              {filteredContent.length === 0 && (
                <tr>
                  <td className="p-3 text-center text-gray-500" colSpan={isEmployee?8:9}>Không có dữ liệu</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex items-center justify-between">
        <div>Tổng: {isEmployee ? filteredContent.length : pageData.totalElements}</div>
        <div className="flex items-center gap-2">
          <button className="px-2 py-1 border rounded" disabled={page<=0} onClick={()=>setPage((p)=>p-1)}>Trước</button>
          <span>Trang {page+1}/{Math.max(1, pageData.totalPages)}</span>
          <button className="px-2 py-1 border rounded" disabled={page+1>=pageData.totalPages} onClick={()=>setPage((p)=>p+1)}>Sau</button>
        </div>
      </div>

      {showForm && (
        <HDForm initial={showForm} submitting={createMut.isPending||updateMut.isPending} onSubmit={onSubmit} onCancel={()=>setShowForm(null)} />
      )}
    </div>
  )
}
