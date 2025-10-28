import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { ChamCong } from '../../api/chamcong'
import { useChamCongList, useCreateChamCong, useUpdateChamCong, useDeleteChamCong } from '../../api/chamcong'
import { usePhongBanList } from '../../api/phongban'
import { useAuthStore } from '../../stores/auth'
import { NhanVienSelect } from '../../components/NhanVienSelect'

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
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-xl w-full max-w-xl">
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
            <NhanVienSelect
              value={form.nhanVien as number}
              onChange={(id) => onChange('nhanVien', id)}
              label="Nhân viên"
              required
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm mb-1">Ghi chú</label>
            <textarea className="w-full border rounded px-3 py-2" value={form.ghiChu||''} onChange={(e)=>onChange('ghiChu', e.target.value)} />
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

function toMonthYear(date: Date) { return { m: date.getMonth()+1, y: date.getFullYear() } }

export default function ChamCongList() {
  const [page, setPage] = useState(0)
  const [size] = useState(100) // Lấy tất cả để group
  const today = new Date()
  const [month, setMonth] = useState(toMonthYear(today).m)
  const [year, setYear] = useState(toMonthYear(today).y)
  const [view, setView] = useState<'table'|'calendar'>('table')
  const [showForm, setShowForm] = useState<null | Partial<ChamCong>>(null)
  const [expandedPhongBan, setExpandedPhongBan] = useState<number | null>(null)
  const { user } = useAuthStore()
  const isEmployee = user?.role === 'EMPLOYEE'
  const onlyId = isEmployee ? user?.nhanVienId : undefined
  const { data, isLoading, error } = useChamCongList(page, size, onlyId as any, month, year)
  const { data: phongBanData } = usePhongBanList(0, 100)
  const createMut = useCreateChamCong()
  const updateMut = useUpdateChamCong()
  const deleteMut = useDeleteChamCong()

  const pageData = data || { content: [], totalElements: 0, totalPages: 0, number: 0, size }
  const phongBans = phongBanData?.content || []
  const filteredContent = useMemo(() => {
    if (!isEmployee) return pageData.content || []
    const myId = user?.nhanVienId
    return (pageData.content || []).filter((cc: any) => (cc.nhanVien?.nhanvien_id ?? cc.nhanVien) === myId)
  }, [isEmployee, pageData, user])
  const totalHours = useMemo(()=> (filteredContent||[]).reduce((s: number, x: any)=> s + (x.tongGioLam||0), 0), [filteredContent])
  
  // Group chấm công theo phòng ban
  const chamCongByPhongBan = useMemo(() => {
    const grouped: Record<number, any[]> = {}
    filteredContent.forEach((cc: any) => {
      const pbId = cc.nhanVien?.phongBan?.phongban_id
      if (pbId) {
        if (!grouped[pbId]) grouped[pbId] = []
        grouped[pbId].push(cc)
      }
    })
    return grouped
  }, [filteredContent])

  const onSubmit = async (form: Partial<ChamCong>) => {
    try {
      const payload: any = {
        ...form,
        nhanVien:
          typeof form.nhanVien === 'number'
            ? { nhanvien_id: form.nhanVien }
            : (form.nhanVien as any),
      }
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
    return (filteredContent||[]).filter((x: any)=> (x.ngay_lam||'').startsWith(`${y}-${m}-`))
  }, [filteredContent, month, year])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chấm công</h1>
          <p className="text-sm text-gray-500 mt-1">{isEmployee ? 'Chấm công của bạn' : 'Quản lý chấm công theo phòng ban'}</p>
        </div>
        <div className="flex gap-2">
          {isEmployee && (
            <button 
              onClick={() => alert('Tính năng chấm công GPS đang được phát triển!')}
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-2.5 rounded-lg font-semibold shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all"
            >
              <span>📍</span>
              <span>Chấm công</span>
            </button>
          )}
          <button onClick={()=>setView(v=> v==='table'?'calendar':'table')} className="flex items-center gap-2 border border-gray-300 px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
            <span>{view==='table' ? '📅' : '📋'}</span>
            <span>{view==='table' ? 'Xem lịch' : 'Xem bảng'}</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-white p-4 rounded-lg shadow">
        <select className="border border-gray-300 rounded-lg px-3 py-2" value={month} onChange={(e)=>{ setMonth(Number(e.target.value)); setPage(0) }}>
          {Array.from({ length: 12 }).map((_, i)=> <option key={i+1} value={i+1}>Tháng {i+1}</option>)}
        </select>
        <input type="number" className="border border-gray-300 rounded-lg px-3 py-2 w-24" value={year} onChange={(e)=>{ setYear(Number(e.target.value)); setPage(0) }} />
        <div className="text-sm text-gray-600 font-medium">Tổng giờ: <span className="text-blue-600">{totalHours.toFixed(2)}h</span></div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-gray-500">Đang tải...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">Lỗi tải dữ liệu</div>
      ) : view==='table' ? (
        <div className="space-y-3">
          {phongBans.map((pb: any) => {
            const chamCongs = chamCongByPhongBan[pb.phongban_id] || []
            if (chamCongs.length === 0 && !isEmployee) return null
            
            const isExpanded = expandedPhongBan === pb.phongban_id
            const pbTotalHours = chamCongs.reduce((s: number, x: any) => s + (x.tongGioLam || 0), 0)
            
            return (
              <div key={pb.phongban_id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
                {/* Header */}
                <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                  <button
                    onClick={() => setExpandedPhongBan(isExpanded ? null : pb.phongban_id)}
                    className="flex-1 flex items-center gap-4 text-left"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
                      <span className="text-white text-xl">⏰</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">{pb.ten_phongban}</h3>
                      <p className="text-sm text-gray-500">{pb.dia_diem}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
                        {chamCongs.length} bản ghi
                      </div>
                      <div className="text-sm text-gray-600 font-medium">
                        {pbTotalHours.toFixed(2)}h
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
                
                {/* Danh sách chấm công */}
                {isExpanded && (
                  <div className="border-t border-gray-200 bg-gray-50">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-gray-100 text-left">
                            <th className="px-4 py-3 font-semibold text-gray-700">Ngày</th>
                            <th className="px-4 py-3 font-semibold text-gray-700">Nhân viên</th>
                            <th className="px-4 py-3 font-semibold text-gray-700">Giờ vào</th>
                            <th className="px-4 py-3 font-semibold text-gray-700">Giờ ra</th>
                            <th className="px-4 py-3 font-semibold text-gray-700">Loại ca</th>
                            <th className="px-4 py-3 font-semibold text-gray-700">Tổng giờ</th>
                            <th className="px-4 py-3 font-semibold text-gray-700">Trạng thái</th>
                            {!isEmployee && <th className="px-4 py-3 font-semibold text-gray-700">Hành động</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {chamCongs.map((cc: any) => (
                            <tr key={cc.chamcong_id} className="border-b hover:bg-white transition-colors">
                              <td className="px-4 py-3 text-gray-900">{cc.ngay_lam}</td>
                              <td className="px-4 py-3">
                                <Link to={`/nhanvien/${cc.nhanVien?.nhanvien_id}`} className="text-blue-600 hover:underline">
                                  {cc.nhanVien?.ho_ten || '-'}
                                </Link>
                              </td>
                              <td className="px-4 py-3">{cc.gio_vao}</td>
                              <td className="px-4 py-3">{cc.gio_ra}</td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                  cc.loaiCa === 'FULL' ? 'bg-blue-100 text-blue-700' :
                                  cc.loaiCa === 'SANG' ? 'bg-yellow-100 text-yellow-700' :
                                  cc.loaiCa === 'CHIEU' ? 'bg-orange-100 text-orange-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {cc.loaiCa || '-'}
                                </span>
                              </td>
                              <td className="px-4 py-3 font-semibold">{cc.tongGioLam?.toFixed(2) ?? '-'}h</td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                  cc.trangThai === 'DUNG_GIO' ? 'bg-green-100 text-green-700' :
                                  cc.trangThai === 'DI_MUON' ? 'bg-yellow-100 text-yellow-700' :
                                  cc.trangThai === 'VE_SOM' ? 'bg-orange-100 text-orange-700' :
                                  'bg-red-100 text-red-700'
                                }`}>
                                  {cc.trangThai || '-'}
                                </span>
                              </td>
                              {!isEmployee && (
                                <td className="px-4 py-3">
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => setShowForm(cc)}
                                      className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors"
                                      title="Sửa"
                                    >
                                      📝
                                    </button>
                                    <button
                                      onClick={() => {
                                        if (confirm('Xác nhận xóa bản ghi chấm công này?')) deleteMut.mutate(cc.chamcong_id)
                                      }}
                                      className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                                      title="Xóa"
                                    >
                                      🗑️
                                    </button>
                                  </div>
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
          
          {(filteredContent.length === 0 && phongBans.length === 0) && (
            <div className="text-center py-12 bg-white rounded-xl">
              <div className="text-6xl mb-4">⏰</div>
              <p className="text-gray-500">Chưa có dữ liệu chấm công</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="grid grid-cols-7 gap-2 text-center text-xs text-gray-500 mb-3 font-semibold">
            <div>CN</div><div>T2</div><div>T3</div><div>T4</div><div>T5</div><div>T6</div><div>T7</div>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: new Date(year, month-1, 0).getDay() }).map((_, i)=> (
              <div key={`empty-${i}`} className="h-24 bg-gray-50 rounded-lg" />
            ))}
            {Array.from({ length: new Date(year, month, 0).getDate() }).map((_, i)=> {
              const day = i+1
              const dateStr = `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`
              const rec = monthRecords.filter((x: any)=> x.ngay_lam === dateStr)
              const total = rec.reduce((s: number, x: any)=> s + (x.tongGioLam||0), 0)
              return (
                <button 
                  key={day} 
                  onClick={()=>{
                    const existing = monthRecords.find((x: any)=> x.ngay_lam === dateStr)
                    if (existing) setShowForm(existing)
                    else setShowForm({ ngay_lam: dateStr, loaiCa: 'FULL' } as any)
                  }} 
                  className="h-24 bg-gray-50 hover:bg-gray-100 rounded-lg p-2 text-left transition-colors"
                >
                  <div className="text-sm font-semibold text-gray-900">{day}</div>
                  {rec.length>0 && (
                    <div className="mt-1 text-[11px]">
                      <div className="font-medium text-blue-600">{rec.length} bản ghi</div>
                      <div className="text-gray-600">Tổng {total.toFixed(1)}h</div>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {showForm && (
        <CCForm initial={showForm} submitting={createMut.isPending||updateMut.isPending} onSubmit={onSubmit} onCancel={()=>setShowForm(null)} />
      )}
    </div>
  )
}
