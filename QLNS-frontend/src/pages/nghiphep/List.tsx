import { useState } from 'react'
import type { NghiPhep } from '../../api/nghiphep'
import { useCreateNghiPhep, useDeleteNghiPhep, useNghiPhepList, usePheDuyetNghiPhep, useUpdateNghiPhep } from '../../api/nghiphep'
import { useAuthStore } from '../../stores/auth'
import { NhanVienSelect } from '../../components/NhanVienSelect'

function NPForm({ initial, onSubmit, onCancel, submitting }: { initial?: Partial<NghiPhep>; onSubmit: (v: Partial<NghiPhep>) => void; onCancel: () => void; submitting?: boolean }) {
  const { user } = useAuthStore()
  const isEmployee = user?.role === 'EMPLOYEE'
  
  const [form, setForm] = useState<any>({
    nhanVien: isEmployee ? user?.nhanVienId : (typeof initial?.nhanVien === 'object' ? initial?.nhanVien?.nhanvien_id : initial?.nhanVien),
    ngayBatDau: initial?.ngayBatDau || '',
    ngayKetThuc: initial?.ngayKetThuc || '',
    lyDo: initial?.lyDo || '',
    loaiNghi: initial?.loaiNghi || 'PHEP_NAM',
  })
  const onChange = (k: string, v: any) => setForm((s: any) => ({ ...s, [k]: v }))
  
  // Calculate số ngày nghỉ
  const calculateDays = () => {
    if (form.ngayBatDau && form.ngayKetThuc) {
      const start = new Date(form.ngayBatDau)
      const end = new Date(form.ngayKetThuc)
      const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
      return diff > 0 ? diff : 0
    }
    return 0
  }
  
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded shadow w-full max-w-xl">
        <h3 className="text-lg font-semibold mb-3">{(initial as any)?.nghiphep_id ? 'Cập nhật' : 'Đăng ký'} nghỉ phép</h3>
        <div className="grid grid-cols-2 gap-3">
          {!isEmployee && (
            <div className="col-span-2">
              <NhanVienSelect
                value={form.nhanVien as number}
                onChange={(id) => onChange('nhanVien', id)}
                label="Nhân viên"
                required
              />
            </div>
          )}
          <div>
            <label className="block text-sm mb-1">Từ ngày</label>
            <input type="date" className="w-full border rounded px-3 py-2" value={form.ngayBatDau||''} onChange={(e)=>onChange('ngayBatDau', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Đến ngày</label>
            <input type="date" className="w-full border rounded px-3 py-2" value={form.ngayKetThuc||''} onChange={(e)=>onChange('ngayKetThuc', e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Loại nghỉ</label>
            <select className="w-full border rounded px-3 py-2" value={form.loaiNghi as any} onChange={(e)=>onChange('loaiNghi', e.target.value)}>
              <option value="PHEP_NAM">Phép năm</option>
              <option value="OM">Ốm</option>
              <option value="KHONG_LUONG">Không lương</option>
              <option value="KET_HON">Kết hôn</option>
              <option value="TANG">Tang</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Số ngày nghỉ</label>
            <input type="text" className="w-full border rounded px-3 py-2 bg-gray-50" value={calculateDays()} readOnly />
          </div>
          <div className="col-span-2">
            <label className="block text-sm mb-1">Lý do</label>
            <textarea className="w-full border rounded px-3 py-2" rows={3} value={form.lyDo||''} onChange={(e)=>onChange('lyDo', e.target.value)} placeholder="Nhập lý do nghỉ phép..." />
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

function ApproveModal({ id, onClose }: { id: number; onClose: () => void }) {
  const [trangThai, setTrangThai] = useState<'DA_DUYET'|'TU_CHOI'>('DA_DUYET')
  const [ghiChu, setGhiChu] = useState('')
  const pheDuyetMut = usePheDuyetNghiPhep()
  const { user } = useAuthStore()
  
  const onSubmit = async () => {
    if (!user?.nhanVienId) {
      alert('Không tìm thấy thông tin người duyệt')
      return
    }
    await pheDuyetMut.mutateAsync({ id, nguoiDuyetId: user.nhanVienId, trangThai, ghiChu })
    onClose()
  }
  
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
      <div className="bg-white p-4 rounded shadow w-full max-w-md">
        <h3 className="text-lg font-semibold mb-3">Phê duyệt đơn #{id}</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm mb-1">Trạng thái</label>
            <select className="w-full border rounded px-3 py-2" value={trangThai} onChange={(e)=>setTrangThai(e.target.value as any)}>
              <option value="DA_DUYET">Duyệt</option>
              <option value="TU_CHOI">Từ chối</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Ghi chú</label>
            <textarea className="w-full border rounded px-3 py-2" value={ghiChu} onChange={(e)=>setGhiChu(e.target.value)} placeholder="Nhập lý do (nếu có)..." />
          </div>
          <div className="bg-gray-50 p-3 rounded border">
            <div className="text-sm text-gray-600">Người duyệt</div>
            <div className="font-semibold text-gray-900">{user?.tenDangnhap}</div>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-3 py-1.5 rounded border">Đóng</button>
          <button disabled={pheDuyetMut.isPending} onClick={onSubmit} className="px-3 py-1.5 rounded bg-black text-white disabled:opacity-50">Xác nhận</button>
        </div>
      </div>
    </div>
  )
}

export default function NghiPhepList() {
  const [page, setPage] = useState(0)
  const [size] = useState(10)
  const [trangThai, setTrangThai] = useState<string>('')
  const [showForm, setShowForm] = useState<null | Partial<NghiPhep>>(null)
  const [approveId, setApproveId] = useState<number | null>(null)
  const { data, isLoading, error } = useNghiPhepList(page, size, trangThai || undefined)
  const createMut = useCreateNghiPhep()
  const updateMut = useUpdateNghiPhep()
  const deleteMut = useDeleteNghiPhep()
  const { user } = useAuthStore()
  const isEmployee = user?.role === 'EMPLOYEE'

  const pageData = data || { content: [], totalElements: 0, totalPages: 0, number: 0, size }

  const onSubmit = async (form: Partial<NghiPhep>) => {
    try {
      // Calculate số ngày nghỉ
      let soNgayNghi = 0
      if (form.ngayBatDau && form.ngayKetThuc) {
        const start = new Date(form.ngayBatDau)
        const end = new Date(form.ngayKetThuc)
        soNgayNghi = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
      }
      
      const payload: any = { 
        nhanVien: form.nhanVien,
        ngayBatDau: form.ngayBatDau,
        ngayKetThuc: form.ngayKetThuc,
        soNgayNghi: soNgayNghi,
        lyDo: form.lyDo,
        loaiNghi: form.loaiNghi
      }
      
      if ((showForm as any)?.nghiphep_id) {
        await updateMut.mutateAsync({ id: (showForm as any).nghiphep_id, body: payload })
      } else {
        await createMut.mutateAsync(payload)
      }
      setShowForm(null)
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Đăng ký thất bại')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Nghỉ phép</h1>
        {isEmployee && (
          <div className="flex gap-2">
            <button onClick={()=>setShowForm({})} className="bg-black text-white px-3 py-1.5 rounded">Đăng ký</button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button onClick={()=>{ setTrangThai(''); setPage(0) }} className={`px-3 py-1.5 rounded border ${trangThai===''?'bg-gray-900 text-white':''}`}>Tất cả</button>
        <button onClick={()=>{ setTrangThai('CHO_DUYET'); setPage(0) }} className={`px-3 py-1.5 rounded border ${trangThai==='CHO_DUYET'?'bg-gray-900 text-white':''}`}>Chờ duyệt</button>
        <button onClick={()=>{ setTrangThai('DA_DUYET'); setPage(0) }} className={`px-3 py-1.5 rounded border ${trangThai==='DA_DUYET'?'bg-gray-900 text-white':''}`}>Đã duyệt</button>
        <button onClick={()=>{ setTrangThai('TU_CHOI'); setPage(0) }} className={`px-3 py-1.5 rounded border ${trangThai==='TU_CHOI'?'bg-gray-900 text-white':''}`}>Từ chối</button>
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
                <th className="p-2">Từ ngày</th>
                <th className="p-2">Đến ngày</th>
                <th className="p-2">Loại</th>
                <th className="p-2">Trạng thái</th>
                {!isEmployee && <th className="p-2 w-56">Hành động</th>}
              </tr>
            </thead>
            <tbody>
              {pageData.content.map((np: any) => (
                <tr key={np.nghiphep_id} className="border-t">
                  <td className="p-2">{np.nghiphep_id}</td>
                  <td className="p-2">{np.nhanVien?.ho_ten || np.nhanVien?.nhanvien_id || '-'}</td>
                  <td className="p-2">{np.ngayBatDau || np.tu_ngay || '-'}</td>
                  <td className="p-2">{np.ngayKetThuc || np.den_ngay || '-'}</td>
                  <td className="p-2">{np.loaiNghi || np.loai || '-'}</td>
                  <td className="p-2">{np.trangThai || '-'}</td>
                  {!isEmployee && (
                    <td className="p-2 flex gap-2">
                      {np.trangThai === 'CHO_DUYET' && (
                        <button onClick={()=>setApproveId(np.nghiphep_id)} className="px-2 py-1 border rounded">Phê duyệt</button>
                      )}
                      <button onClick={()=>deleteMut.mutate(np.nghiphep_id)} className="px-2 py-1 border rounded text-red-600">Xoá</button>
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
        <NPForm initial={showForm} submitting={createMut.isPending||updateMut.isPending} onSubmit={onSubmit} onCancel={()=>setShowForm(null)} />
      )}
      {approveId && (
        <ApproveModal id={approveId} onClose={()=>setApproveId(null)} />
      )}
    </div>
  )
}
