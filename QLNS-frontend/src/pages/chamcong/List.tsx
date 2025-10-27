import { useMemo, useState } from 'react'
import type { ChamCong } from '../../api/chamcong'
import { useChamCongList, useCreateChamCong, useUpdateChamCong, useDeleteChamCong } from '../../api/chamcong'
import { useAuthStore } from '../../stores/auth'

function CCForm({ initial, onSubmit, onCancel, submitting }: { initial?: Partial<ChamCong>; onSubmit: (v: Partial<ChamCong>) => void; onCancel: () => void; submitting?: boolean }) {
  const [form, setForm] = useState<Partial<ChamCong>>({
    gio_vao: initial?.gio_vao || '',
    gio_ra: initial?.gio_ra || '',
    ngay_lam: initial?.ngay_lam || '',
    loaiCa: initial?.loaiCa || 'FULL',
    ghiChu: initial?.ghiChu || '',
    nhanVien: typeof initial?.nhanVien === 'number' ? initial?.nhanVien : (initial?.nhanVien as any)?.nhanvien_id || undefined,
  })
  const onChange = (k: keyof ChamCong, v: any) => setForm((s) => ({ ...s, [k]: v }))
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
      <div className="bg-white p-4 rounded shadow w-full max-w-xl">
        <h3 className="text-lg font-semibold mb-3">{(initial as any)?.chamcong_id ? 'Cập nhật' : 'Thêm'} chấm công</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1">Ngày làm</label>
            <input type="date" className="w-full border rounded px-3 py-2" value={form.ngay_lam||''} onChange={(e)=>onChange('ngay_lam', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Loại ca</label>
            <select className="w-full border rounded px-3 py-2" value={form.loaiCa as any} onChange={(e)=>onChange('loaiCa', e.target.value)}>
              <option value="FULL">FULL</option>
              <option value="SANG">SÁNG</option>
              <option value="CHIEU">CHIỀU</option>
              <option value="TOI">TỐI</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Giờ vào</label>
            <input type="time" className="w-full border rounded px-3 py-2" value={form.gio_vao||''} onChange={(e)=>onChange('gio_vao', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Giờ ra</label>
            <input type="time" className="w-full border rounded px-3 py-2" value={form.gio_ra||''} onChange={(e)=>onChange('gio_ra', e.target.value)} />
          </div>
          <div className="col-span-2">
            <label className="block text-sm mb-1">Nhân viên ID</label>
            <input type="number" className="w-full border rounded px-3 py-2" value={(form.nhanVien as any)??''} onChange={(e)=>onChange('nhanVien', Number(e.target.value))} />
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

function toMonthYear(date: Date) { return { m: date.getMonth()+1, y: date.getFullYear() } }

export default function ChamCongList() {
  const [page, setPage] = useState(0)
  const [size] = useState(10)
  const today = new Date()
  const [month, setMonth] = useState(toMonthYear(today).m)
  const [year, setYear] = useState(toMonthYear(today).y)
  const [view, setView] = useState<'table'|'calendar'>('table')
  const [showForm, setShowForm] = useState<null | Partial<ChamCong>>(null)
  const { data, isLoading, error } = useChamCongList(page, size, undefined, month, year)
  const createMut = useCreateChamCong()
  const updateMut = useUpdateChamCong()
  const deleteMut = useDeleteChamCong()
  const { user } = useAuthStore()

  const pageData = data || { content: [], totalElements: 0, totalPages: 0, number: 0, size }
  const totalHours = useMemo(()=> (pageData.content||[]).reduce((s: number, x: any)=> s + (x.tongGioLam||0), 0), [pageData])
  const isEmployee = user?.role === 'EMPLOYEE'

  const onSubmit = async (form: Partial<ChamCong>) => {
    try {
      const payload: any = { ...form, nhanVien: form.nhanVien }
      if ((showForm as any)?.chamcong_id) {
        await updateMut.mutateAsync({ id: (showForm as any).chamcong_id, body: payload })
      } else {
        await createMut.mutateAsync(payload)
      }
      setShowForm(null)
    } catch {}
  }

  const monthRecords = useMemo(()=> {
    const m = String(month).padStart(2,'0')
    const y = String(year)
    return (pageData.content||[]).filter((x: any)=> (x.ngay_lam||'').startsWith(`${y}-${m}-`))
  }, [pageData, month, year])

  const firstWeekdayOfMonth = (y: number, m: number) => {
    const d = new Date(y, m-1, 1)
    return d.getDay() // 0=Sun
  }
  const daysInMonth = (y: number, m: number) => new Date(y, m, 0).getDate()

  const openCreateForDay = (day: number) => {
    const dateStr = `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`
    const existing = monthRecords.find((x: any)=> x.ngay_lam === dateStr)
    if (existing) setShowForm(existing)
    else setShowForm({ ngay_lam: dateStr, loaiCa: 'FULL' } as any)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Chấm công</h1>
        <div className="flex gap-2">
          {!isEmployee && (
            <button onClick={()=>setShowForm({})} className="bg-black text-white px-3 py-1.5 rounded">Ghi nhận</button>
          )}
          <button onClick={()=>setView(v=> v==='table'?'calendar':'table')} className="border px-3 py-1.5 rounded">
            {view==='table' ? 'Xem lịch' : 'Xem bảng'}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <select className="border rounded px-2 py-1" value={month} onChange={(e)=>{ setMonth(Number(e.target.value)); setPage(0) }}>
          {Array.from({ length: 12 }).map((_, i)=> <option key={i+1} value={i+1}>Tháng {i+1}</option>)}
        </select>
        <input type="number" className="border rounded px-2 py-1 w-24" value={year} onChange={(e)=>{ setYear(Number(e.target.value)); setPage(0) }} />
        <div className="text-sm text-gray-600">Tổng giờ tháng: <span className="font-semibold">{totalHours.toFixed(2)}</span></div>
      </div>

      {isLoading ? (
        <div>Đang tải...</div>
      ) : error ? (
        <div className="text-red-600">Lỗi tải dữ liệu</div>
      ) : view==='table' ? (
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="p-2">Ngày</th>
                <th className="p-2">Giờ vào</th>
                <th className="p-2">Giờ ra</th>
                <th className="p-2">Loại ca</th>
                <th className="p-2">Tổng giờ</th>
                <th className="p-2">Trạng thái</th>
                {!isEmployee && <th className="p-2 w-40">Hành động</th>}
              </tr>
            </thead>
            <tbody>
              {pageData.content.map((cc: any) => (
                <tr key={cc.chamcong_id} className="border-t">
                  <td className="p-2">{cc.ngay_lam}</td>
                  <td className="p-2">{cc.gio_vao}</td>
                  <td className="p-2">{cc.gio_ra}</td>
                  <td className="p-2">{cc.loaiCa || '-'}</td>
                  <td className="p-2">{cc.tongGioLam?.toFixed(2) ?? '-'}</td>
                  <td className="p-2">{cc.trangThai || '-'}</td>
                  {!isEmployee && (
                    <td className="p-2 flex gap-2">
                      <button onClick={()=>setShowForm(cc)} className="px-2 py-1 border rounded">Sửa</button>
                      <button onClick={()=>deleteMut.mutate(cc.chamcong_id)} className="px-2 py-1 border rounded text-red-600">Xoá</button>
                    </td>
                  )}
                </tr>
              ))}
              {pageData.content.length === 0 && (
                <tr>
                  <td className="p-3 text-center text-gray-500" colSpan={isEmployee?6:7}>Không có dữ liệu</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded shadow p-4">
          <div className="grid grid-cols-7 gap-2 text-center text-xs text-gray-500 mb-2">
            <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: firstWeekdayOfMonth(year, month) }).map((_, i)=> (
              <div key={`empty-${i}`} className="h-24 bg-gray-50 rounded" />
            ))}
            {Array.from({ length: daysInMonth(year, month) }).map((_, i)=> {
              const day = i+1
              const dateStr = `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`
              const rec = monthRecords.filter((x: any)=> x.ngay_lam === dateStr)
              const total = rec.reduce((s: number, x: any)=> s + (x.tongGioLam||0), 0)
              return (
                <button key={day} onClick={()=>openCreateForDay(day)} className="h-24 bg-gray-50 hover:bg-gray-100 rounded p-2 text-left">
                  <div className="text-xs text-gray-500">{day}</div>
                  {rec.length>0 && (
                    <div className="mt-1 text-[11px]">
                      <div className="font-medium">{rec.length} bản ghi</div>
                      <div className="text-gray-600">Tổng {total.toFixed(2)}h</div>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
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
        <CCForm initial={showForm} submitting={createMut.isPending||updateMut.isPending} onSubmit={onSubmit} onCancel={()=>setShowForm(null)} />
      )}
    </div>
  )
}
