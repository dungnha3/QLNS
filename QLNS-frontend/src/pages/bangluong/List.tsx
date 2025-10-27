import { useMemo, useState } from 'react'
import type { BangLuong } from '../../api/bangluong'
import { useBangLuongList, useCreateBangLuong, useDeleteBangLuong, useTinhLuongTuDong, useUpdateBangLuong } from '../../api/bangluong'
import { useAuthStore } from '../../stores/auth'

function AutoCalcModal({ onClose, onCalculated }: { onClose: () => void; onCalculated: (res: BangLuong) => void }) {
  const [nhanVienId, setNV] = useState<number | ''>('' as any)
  const today = new Date()
  const [thang, setThang] = useState(today.getMonth() + 1)
  const [nam, setNam] = useState(today.getFullYear())
  const [error, setError] = useState<string | null>(null)
  const tinhMut = useTinhLuongTuDong()

  const onSubmit = async () => {
    setError(null)
    try {
      if (!nhanVienId) throw new Error('Vui lòng nhập Nhân viên ID')
      const res = await tinhMut.mutateAsync({ nhanVienId: Number(nhanVienId), thang, nam })
      onCalculated(res)
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Tính lương thất bại')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
      <div className="bg-white p-4 rounded shadow w-full max-w-xl">
        <h3 className="text-lg font-semibold mb-3">Tính lương tự động</h3>
        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-3">
            <label className="block text-sm mb-1">Nhân viên ID</label>
            <input type="number" className="w-full border rounded px-3 py-2" value={nhanVienId as any} onChange={(e)=>setNV(e.target.value as any)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Tháng</label>
            <select className="w-full border rounded px-3 py-2" value={thang} onChange={(e)=>setThang(Number(e.target.value))}>
              {Array.from({ length: 12 }).map((_, i)=> <option key={i+1} value={i+1}>Tháng {i+1}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Năm</label>
            <input type="number" className="w-full border rounded px-3 py-2" value={nam} onChange={(e)=>setNam(Number(e.target.value))} />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-3 py-1.5 rounded border">Đóng</button>
          <button disabled={tinhMut.isPending} onClick={onSubmit} className="px-3 py-1.5 rounded bg-black text-white disabled:opacity-50">Tính lương</button>
        </div>
      </div>
    </div>
  )
}

function BLForm({ initial, onSubmit, onCancel, submitting }: { initial?: Partial<BangLuong>; onSubmit: (v: Partial<BangLuong>) => void; onCancel: () => void; submitting?: boolean }) {
  const [form, setForm] = useState<Partial<BangLuong>>({
    nhanVien: typeof initial?.nhanVien === 'number' ? initial?.nhanVien : (initial?.nhanVien as any)?.nhanvien_id || undefined,
    thang: initial?.thang || new Date().getMonth() + 1,
    nam: initial?.nam || new Date().getFullYear(),
    luong_co_ban: initial?.luong_co_ban || 0,
    phu_cap: initial?.phu_cap || 0,
    khau_tru: initial?.khau_tru || 0,
    thuong: initial?.thuong || 0,
    phat: initial?.phat || 0,
    trangThai: initial?.trangThai || 'CHO_DUYET',
  })
  const onChange = (k: keyof BangLuong, v: any) => setForm((s) => ({ ...s, [k]: v }))
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
      <div className="bg-white p-4 rounded shadow w-full max-w-2xl">
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
            <label className="block text-sm mb-1">Thưởng</label>
            <input type="number" className="w-full border rounded px-3 py-2" value={form.thuong as any} onChange={(e)=>onChange('thuong', Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-sm mb-1">Phạt</label>
            <input type="number" className="w-full border rounded px-3 py-2" value={form.phat as any} onChange={(e)=>onChange('phat', Number(e.target.value))} />
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
          <button onClick={onCancel} className="px-3 py-1.5 rounded border">Hủy</button>
          <button disabled={submitting} onClick={()=>onSubmit(form)} className="px-3 py-1.5 rounded bg-black text-white disabled:opacity-50">Lưu</button>
        </div>
      </div>
    </div>
  )
}

export default function BangLuongList() {
  const [page, setPage] = useState(0)
  const [size] = useState(10)
  const [trangThai, setTrangThai] = useState<string>('')
  const [showForm, setShowForm] = useState<null | Partial<BangLuong>>(null)
  const [showAuto, setShowAuto] = useState(false)
  const { data, isLoading, error } = useBangLuongList(page, size, trangThai || undefined)
  const createMut = useCreateBangLuong()
  const updateMut = useUpdateBangLuong()
  const deleteMut = useDeleteBangLuong()
  const { user } = useAuthStore()
  const isEmployee = user?.role === 'EMPLOYEE'

  const pageData = data || { content: [], totalElements: 0, totalPages: 0, number: 0, size }
  const filteredContent = useMemo(() => {
    if (!isEmployee) return pageData.content
    const myId = user?.nhanVienId
    return (pageData.content || []).filter((bl: any) => (bl.nhanVien?.nhanvien_id ?? bl.nhanVien) === myId)
  }, [isEmployee, pageData, user])

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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Bảng lương</h1>
        {!isEmployee && (
          <div className="flex gap-2">
            <button onClick={()=>setShowAuto(true)} className="bg-amber-600 text-white px-3 py-1.5 rounded">Tính lương tự động</button>
            <button onClick={()=>setShowForm({})} className="bg-black text-white px-3 py-1.5 rounded">Thêm mới</button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <select className="border rounded px-2 py-1" value={trangThai} onChange={(e)=>{ setTrangThai(e.target.value); setPage(0) }}>
          <option value="">Tất cả trạng thái</option>
          <option value="CHO_DUYET">Chờ duyệt</option>
          <option value="DA_DUYET">Đã duyệt</option>
          <option value="DA_THANH_TOAN">Đã thanh toán</option>
        </select>
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
                <th className="p-2">Tháng/Năm</th>
                <th className="p-2">Lương CB</th>
                <th className="p-2">Phụ cấp</th>
                <th className="p-2">BHXH</th>
                <th className="p-2">BHYT</th>
                <th className="p-2">BHTN</th>
                <th className="p-2">Thuế</th>
                <th className="p-2">Thực lãnh</th>
                <th className="p-2">Trạng thái</th>
                {!isEmployee && <th className="p-2 w-48">Hành động</th>}
              </tr>
            </thead>
            <tbody>
              {filteredContent.map((bl: any) => (
                <tr key={bl.bangluong_id} className="border-t">
                  <td className="p-2">{bl.bangluong_id}</td>
                  <td className="p-2">{bl.nhanVien?.ho_ten || bl.nhanVien?.nhanvien_id || '-'}</td>
                  <td className="p-2">{bl.thang}/{bl.nam}</td>
                  <td className="p-2">{bl.luong_co_ban ?? '-'}</td>
                  <td className="p-2">{bl.phu_cap ?? '-'}</td>
                  <td className="p-2">{bl.bhxh ?? '-'}</td>
                  <td className="p-2">{bl.bhyt ?? '-'}</td>
                  <td className="p-2">{bl.bhtn ?? '-'}</td>
                  <td className="p-2">{bl.thueThuNhap ?? '-'}</td>
                  <td className="p-2">{bl.thuc_lanh ?? '-'}</td>
                  <td className="p-2">{bl.trangThai || '-'}</td>
                  {!isEmployee && (
                    <td className="p-2 flex gap-2">
                      <button onClick={()=>setShowForm(bl)} className="px-2 py-1 border rounded">Sửa</button>
                      {bl.trangThai !== 'DA_DUYET' && (
                        <button onClick={()=>useUpdateBangLuong().mutate({ id: bl.bangluong_id, body: { trangThai: 'DA_DUYET' } })} className="px-2 py-1 border rounded">Duyệt</button>
                      )}
                      {bl.trangThai === 'DA_DUYET' && (
                        <button onClick={()=>useUpdateBangLuong().mutate({ id: bl.bangluong_id, body: { trangThai: 'DA_THANH_TOAN' } })} className="px-2 py-1 border rounded">Thanh toán</button>
                      )}
                      <button onClick={()=>deleteMut.mutate(bl.bangluong_id)} className="px-2 py-1 border rounded text-red-600">Xoá</button>
                    </td>
                  )}
                </tr>
              ))}
              {filteredContent.length === 0 && (
                <tr>
                  <td className="p-3 text-center text-gray-500" colSpan={isEmployee?11:12}>Không có dữ liệu</td>
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
        <BLForm initial={showForm} submitting={createMut.isPending||updateMut.isPending} onSubmit={onSubmit} onCancel={()=>setShowForm(null)} />
      )}

      {showAuto && (
        <AutoCalcModal
          onClose={()=>setShowAuto(false)}
          onCalculated={(res)=>{
            setShowAuto(false)
            setShowForm({
              nhanVien: (res as any).nhanVien?.nhanvien_id || (res as any).nhanVien,
              thang: (res as any).thang,
              nam: (res as any).nam,
              luong_co_ban: (res as any).luong_co_ban,
              phu_cap: (res as any).phu_cap,
              khau_tru: (res as any).khau_tru,
              bhxh: (res as any).bhxh,
              bhyt: (res as any).bhyt,
              bhtn: (res as any).bhtn,
              thueThuNhap: (res as any).thueThuNhap,
              tong_cong: (res as any).tong_cong,
              thuc_lanh: (res as any).thuc_lanh,
              trangThai: 'CHO_DUYET',
            })
          }}
        />
      )}
    </div>
  )
}
