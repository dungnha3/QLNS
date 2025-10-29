import { useState } from 'react'
import { usePhongBanList } from '../api/phongban'
import { useChucVuList } from '../api/chucvu'

type NhanVienEditForm = {
  ho_ten: string
  email: string
  gioi_tinh: string
  dia_chi: string
  ngay_sinh: string
  ngay_vao_lam: string
  so_dien_thoai?: string
  cccd?: string
  trangThai?: string
  phongBan?: number
  chucVu?: number
}

type Props = {
  initial: any
  onSubmit: (data: NhanVienEditForm) => void
  onCancel: () => void
  submitting?: boolean
}

export function NhanVienEditModal({ initial, onSubmit, onCancel, submitting }: Props) {
  const { data: phongBanData } = usePhongBanList(0, 100)
  const { data: chucVuData } = useChucVuList(0, 100)
  
  const [form, setForm] = useState<NhanVienEditForm>({
    ho_ten: initial?.ho_ten || '',
    email: initial?.email || '',
    gioi_tinh: initial?.gioi_tinh || 'Nam',
    dia_chi: initial?.dia_chi || '',
    ngay_sinh: initial?.ngay_sinh || '',
    ngay_vao_lam: initial?.ngay_vao_lam || '',
    so_dien_thoai: initial?.so_dien_thoai || '',
    cccd: initial?.cccd || '',
    trangThai: initial?.trangThai || 'DANG_LAM_VIEC',
    phongBan: initial?.phongBan?.phongban_id || undefined,
    chucVu: initial?.chucVu?.chucvu_id || undefined,
  })
  
  const onChange = (key: keyof NhanVienEditForm, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }
  
  const phongBans = phongBanData?.content || []
  const chucVus = chucVuData?.content || []
  
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 z-10">
          <h3 className="text-xl font-bold text-gray-900">Sửa thông tin nhân viên</h3>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Thông tin cá nhân */}
            <div className="col-span-2">
              <h4 className="font-semibold text-gray-900 mb-3">Thông tin cá nhân</h4>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Họ tên *</label>
              <input 
                type="text" 
                className="w-full border rounded-lg px-3 py-2"
                value={form.ho_ten}
                onChange={(e) => onChange('ho_ten', e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Email *</label>
              <input 
                type="email" 
                className="w-full border rounded-lg px-3 py-2"
                value={form.email}
                onChange={(e) => onChange('email', e.target.value)}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Giới tính</label>
              <select 
                className="w-full border rounded-lg px-3 py-2"
                value={form.gioi_tinh}
                onChange={(e) => onChange('gioi_tinh', e.target.value)}
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Số điện thoại</label>
              <input 
                type="tel" 
                className="w-full border rounded-lg px-3 py-2"
                value={form.so_dien_thoai}
                onChange={(e) => onChange('so_dien_thoai', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">CCCD</label>
              <input 
                type="text" 
                className="w-full border rounded-lg px-3 py-2"
                value={form.cccd}
                onChange={(e) => onChange('cccd', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Ngày sinh</label>
              <input 
                type="date" 
                className="w-full border rounded-lg px-3 py-2"
                value={form.ngay_sinh}
                onChange={(e) => onChange('ngay_sinh', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Ngày vào làm</label>
              <input 
                type="date" 
                className="w-full border rounded-lg px-3 py-2"
                value={form.ngay_vao_lam}
                onChange={(e) => onChange('ngay_vao_lam', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Trạng thái</label>
              <select 
                className="w-full border rounded-lg px-3 py-2"
                value={form.trangThai}
                onChange={(e) => onChange('trangThai', e.target.value)}
              >
                <option value="DANG_LAM_VIEC">Đang làm việc</option>
                <option value="NGHI_VIEC">Nghỉ việc</option>
                <option value="TAM_NGHI">Tạm nghỉ</option>
              </select>
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Địa chỉ</label>
              <input 
                type="text" 
                className="w-full border rounded-lg px-3 py-2"
                value={form.dia_chi}
                onChange={(e) => onChange('dia_chi', e.target.value)}
              />
            </div>
            
            {/* Thông tin công việc */}
            <div className="col-span-2 mt-4">
              <h4 className="font-semibold text-gray-900 mb-3">Thông tin công việc</h4>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Phòng ban</label>
              <select 
                className="w-full border rounded-lg px-3 py-2"
                value={form.phongBan || ''}
                onChange={(e) => onChange('phongBan', e.target.value ? Number(e.target.value) : undefined)}
              >
                <option value="">-- Chọn phòng ban --</option>
                {phongBans.map((pb: any) => (
                  <option key={pb.phongban_id} value={pb.phongban_id}>
                    {pb.ten_phongban}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Chức vụ</label>
              <select 
                className="w-full border rounded-lg px-3 py-2"
                value={form.chucVu || ''}
                onChange={(e) => onChange('chucVu', e.target.value ? Number(e.target.value) : undefined)}
              >
                <option value="">-- Chọn chức vụ --</option>
                {chucVus.map((cv: any) => (
                  <option key={cv.chucvu_id} value={cv.chucvu_id}>
                    {cv.ten_chucvu} ({Number(cv.luong_co_ban).toLocaleString('vi-VN')}đ)
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-end gap-3">
          <button 
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Hủy
          </button>
          <button 
            onClick={() => onSubmit(form)}
            disabled={submitting}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
          >
            {submitting ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        </div>
      </div>
    </div>
  )
}
