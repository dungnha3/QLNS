import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { TaiKhoan } from '../../api/taikhoan'
import { useCreateTaiKhoan, useDeleteTaiKhoan, useTaiKhoanList, useUpdateTaiKhoan } from '../../api/taikhoan'
import { useCreateNhanVien, useUpdateNhanVien, useNhanVienDetail } from '../../api/nhanvien'
import { usePhongBanList } from '../../api/phongban'
import { useChucVuList } from '../../api/chucvu'

function TKForm({ initial, onSubmit, onCancel, submitting }: { initial?: Partial<TaiKhoan>; onSubmit: (v: any) => void; onCancel: () => void; submitting?: boolean }) {
  const [form, setForm] = useState<any>({
    ten_dangnhap: initial?.ten_dangnhap || 'test' + Date.now(),
    mat_khau: '123456',
    quyen_han: (initial?.quyen_han as any) || 'EMPLOYEE',
    // Thông tin nhân viên
    ho_ten: 'Nguyễn Test',
    email: 'test' + Date.now() + '@test.com',
    gioi_tinh: 'Nam',
    dia_chi: 'Hà Nội',
    ngay_sinh: '2000-01-01',
    ngay_vao_lam: new Date().toISOString().split('T')[0],
    so_dien_thoai: '0901234567',
    cccd: '001234567890',
  })
  const onChange = (k: string, v: any) => setForm((s: any) => ({ ...s, [k]: v }))
  const submit = () => {
    // Validate khi tạo mới
    if (!(initial as any)?.taikhoan_id) {
      if (!form.ten_dangnhap || form.ten_dangnhap.length < 3) {
        alert('Tên đăng nhập phải có ít nhất 3 ký tự')
        return
      }
      if (!form.mat_khau || form.mat_khau.length < 6) {
        alert('Mật khẩu phải có ít nhất 6 ký tự')
        return
      }
      if (!form.ho_ten || form.ho_ten.trim().length < 2) {
        alert('Họ tên không được để trống')
        return
      }
      if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        alert('Email không hợp lệ')
        return
      }
      if (!form.dia_chi || form.dia_chi.trim().length < 2) {
        alert('Địa chỉ không được để trống')
        return
      }
      if (form.cccd && !/^[0-9]{12}$/.test(form.cccd)) {
        alert('CCCD phải là 12 số')
        return
      }
      if (form.so_dien_thoai && !/^0[0-9]{9}$/.test(form.so_dien_thoai)) {
        alert('Số điện thoại phải là 10 số, bắt đầu bằng 0')
        return
      }
    }
    onSubmit(form)
  }
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
      <div className="bg-white p-4 rounded shadow w-full max-w-xl">
        <h3 className="text-lg font-semibold mb-3">{(initial as any)?.taikhoan_id ? 'Cập nhật' : 'Tạo'} tài khoản</h3>
        <div className="space-y-3 max-h-[70vh] overflow-y-auto">
          {/* Thông tin tài khoản */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="font-semibold mb-2">Thông tin tài khoản</h4>
            <div className="space-y-2">
              <div>
                <label className="block text-sm mb-1">Tên đăng nhập *</label>
                <input 
                  className="w-full border rounded px-3 py-2" 
                  value={form.ten_dangnhap||''} 
                  onChange={(e)=>onChange('ten_dangnhap', e.target.value)}
                  placeholder="Nhập tên đăng nhập"
                  required
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Mật khẩu { (initial as any)?.taikhoan_id ? '(để trống nếu không đổi)' : '*' }</label>
                <input 
                  type="password" 
                  className="w-full border rounded px-3 py-2" 
                  value={form.mat_khau||''} 
                  onChange={(e)=>onChange('mat_khau', e.target.value)}
                  placeholder="Nhập mật khẩu"
                  required={!(initial as any)?.taikhoan_id}
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Quyền hạn *</label>
                <select className="w-full border rounded px-3 py-2" value={form.quyen_han as any} onChange={(e)=>onChange('quyen_han', e.target.value)}>
                  <option value="EMPLOYEE">EMPLOYEE - Nhân viên</option>
                  <option value="MANAGER">MANAGER - Quản lý</option>
                  <option value="ADMIN">ADMIN - Quản trị viên</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Thông tin nhân viên */}
          {!(initial as any)?.taikhoan_id && (
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="font-semibold mb-2">Thông tin nhân viên</h4>
              <div className="grid grid-cols-2 gap-2">
                <div className="col-span-2">
                  <label className="block text-sm mb-1">Họ tên *</label>
                  <input 
                    className="w-full border rounded px-3 py-2" 
                    value={form.ho_ten||''} 
                    onChange={(e)=>onChange('ho_ten', e.target.value)}
                    placeholder="Nguyễn Văn A"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm mb-1">Email *</label>
                  <input 
                    type="email"
                    className="w-full border rounded px-3 py-2" 
                    value={form.email||''} 
                    onChange={(e)=>onChange('email', e.target.value)}
                    placeholder="email@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Giới tính</label>
                  <select className="w-full border rounded px-3 py-2" value={form.gioi_tinh} onChange={(e)=>onChange('gioi_tinh', e.target.value)}>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">SĐT</label>
                  <input 
                    className="w-full border rounded px-3 py-2" 
                    value={form.so_dien_thoai||''} 
                    onChange={(e)=>onChange('so_dien_thoai', e.target.value)}
                    placeholder="0901234567"
                    maxLength={10}
                    pattern="0[0-9]{9}"
                  />
                  <p className="text-xs text-gray-500 mt-1">10 số, bắt đầu bằng 0</p>
                </div>
                <div>
                  <label className="block text-sm mb-1">CCCD</label>
                  <input 
                    className="w-full border rounded px-3 py-2" 
                    value={form.cccd||''} 
                    onChange={(e)=>onChange('cccd', e.target.value)}
                    placeholder="001234567890"
                    maxLength={12}
                    pattern="[0-9]{12}"
                  />
                  <p className="text-xs text-gray-500 mt-1">12 số</p>
                </div>
                <div>
                  <label className="block text-sm mb-1">Ngày sinh</label>
                  <input 
                    type="date"
                    className="w-full border rounded px-3 py-2" 
                    value={form.ngay_sinh||''} 
                    onChange={(e)=>onChange('ngay_sinh', e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    placeholder="yyyy-mm-dd"
                  />
                  <p className="text-xs text-gray-500 mt-1">💡 Click vào năm để nhập nhanh</p>
                </div>
                <div>
                  <label className="block text-sm mb-1">Ngày vào làm</label>
                  <input 
                    type="date"
                    className="w-full border rounded px-3 py-2" 
                    value={form.ngay_vao_lam||''} 
                    onChange={(e)=>onChange('ngay_vao_lam', e.target.value)}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm mb-1">Địa chỉ *</label>
                  <input 
                    className="w-full border rounded px-3 py-2" 
                    value={form.dia_chi||''} 
                    onChange={(e)=>onChange('dia_chi', e.target.value)}
                    placeholder="Hà Nội"
                    required
                  />
                </div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded p-2 text-xs text-yellow-800 mt-2">
                ⚠️ Sau khi tạo, bạn cần gán phòng ban và chức vụ cho nhân viên.
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onCancel} className="px-3 py-1.5 rounded border">Hủy</button>
          <button disabled={submitting} onClick={submit} className="px-3 py-1.5 rounded bg-black text-white disabled:opacity-50">Lưu</button>
        </div>
      </div>
    </div>
  )
}

function CreateEmployeeModal({ taiKhoan, onClose }: { taiKhoan: any; onClose: () => void }) {
  const createNhanVienMut = useCreateNhanVien()
  const [form, setForm] = useState<any>({
    ho_ten: '',
    email: '',
    gioi_tinh: 'Nam',
    dia_chi: '',
    ngay_sinh: '',
    ngay_vao_lam: new Date().toISOString().split('T')[0],
    so_dien_thoai: '',
    cccd: '',
  })
  
  const onChange = (k: string, v: any) => setForm((s: any) => ({ ...s, [k]: v }))
  
  const handleSubmit = async () => {
    if (!form.ho_ten || form.ho_ten.trim().length < 2) {
      alert('Họ tên không được để trống')
      return
    }
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      alert('Email không hợp lệ')
      return
    }
    if (!form.dia_chi || form.dia_chi.trim().length < 2) {
      alert('Địa chỉ không được để trống')
      return
    }
    if (form.cccd && !/^[0-9]{12}$/.test(form.cccd)) {
      alert('CCCD phải là 12 số')
      return
    }
    if (form.so_dien_thoai && !/^0[0-9]{9}$/.test(form.so_dien_thoai)) {
      alert('Số điện thoại phải là 10 số, bắt đầu bằng 0')
      return
    }
    try {
      const employeeData = {
        ho_ten: form.ho_ten,
        email: form.email,
        gioi_tinh: form.gioi_tinh || 'Nam',
        dia_chi: form.dia_chi || '',
        ngay_sinh: form.ngay_sinh || null,
        ngay_vao_lam: form.ngay_vao_lam || new Date().toISOString().split('T')[0],
        so_dien_thoai: form.so_dien_thoai || null,
        cccd: form.cccd || null,
        trangThai: 'DANG_LAM_VIEC',
        taiKhoan: taiKhoan.taikhoan_id
      }
      await createNhanVienMut.mutateAsync(employeeData)
      alert('Tạo hồ sơ nhân viên thành công!')
      onClose()
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Tạo hồ sơ thất bại')
    }
  }
  
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Tạo hồ sơ nhân viên</h3>
        <p className="text-sm text-gray-600 mb-4">
          Tài khoản: <span className="font-semibold">{taiKhoan.ten_dangnhap}</span>
        </p>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Họ tên *</label>
            <input 
              className="w-full border rounded px-3 py-2" 
              value={form.ho_ten} 
              onChange={(e)=>onChange('ho_ten', e.target.value)}
              placeholder="Nguyễn Văn A"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Email *</label>
            <input 
              type="email"
              className="w-full border rounded px-3 py-2" 
              value={form.email} 
              onChange={(e)=>onChange('email', e.target.value)}
              placeholder="email@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Giới tính</label>
            <select className="w-full border rounded px-3 py-2" value={form.gioi_tinh} onChange={(e)=>onChange('gioi_tinh', e.target.value)}>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
              <option value="Khác">Khác</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">SĐT</label>
            <input 
              className="w-full border rounded px-3 py-2" 
              value={form.so_dien_thoai} 
              onChange={(e)=>onChange('so_dien_thoai', e.target.value)}
              placeholder="0901234567"
              maxLength={10}
              pattern="0[0-9]{9}"
            />
            <p className="text-xs text-gray-500 mt-1">10 số, bắt đầu bằng 0</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">CCCD</label>
            <input 
              className="w-full border rounded px-3 py-2" 
              value={form.cccd} 
              onChange={(e)=>onChange('cccd', e.target.value)}
              placeholder="001234567890"
              maxLength={12}
              pattern="[0-9]{12}"
            />
            <p className="text-xs text-gray-500 mt-1">12 số</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Ngày sinh</label>
            <input 
              type="date"
              className="w-full border rounded px-3 py-2" 
              value={form.ngay_sinh} 
              onChange={(e)=>onChange('ngay_sinh', e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
            <p className="text-xs text-gray-500 mt-1">💡 Click vào năm để nhập trực tiếp</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Ngày vào làm</label>
            <input 
              type="date"
              className="w-full border rounded px-3 py-2" 
              value={form.ngay_vao_lam} 
              onChange={(e)=>onChange('ngay_vao_lam', e.target.value)}
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1">Địa chỉ *</label>
            <input 
              className="w-full border rounded px-3 py-2" 
              value={form.dia_chi} 
              onChange={(e)=>onChange('dia_chi', e.target.value)}
              placeholder="Hà Nội"
              required
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-3 mt-6">
          <button 
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Hủy
          </button>
          <button 
            onClick={handleSubmit}
            disabled={createNhanVienMut.isPending}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
          >
            {createNhanVienMut.isPending ? 'Đang lưu...' : 'Lưu'}
          </button>
        </div>
      </div>
    </div>
  )
}

function AssignDepartmentModal({ nhanVienId, onClose }: { nhanVienId: number; onClose: () => void }) {
  const queryClient = useQueryClient()
  const { data: nhanVien } = useNhanVienDetail(nhanVienId)
  const { data: phongBanData } = usePhongBanList(0, 100)
  const { data: chucVuData } = useChucVuList(0, 100)
  const updateMut = useUpdateNhanVien()
  
  const [phongBan, setPhongBan] = useState<number | undefined>()
  const [chucVu, setChucVu] = useState<number | undefined>()
  
  const phongBans = phongBanData?.content || []
  const chucVus = chucVuData?.content || []
  
  const handleSubmit = async () => {
    if (!phongBan || !chucVu) {
      alert('Vui lòng chọn phòng ban và chức vụ')
      return
    }
    try {
      await updateMut.mutateAsync({
        id: nhanVienId,
        body: { 
          ho_ten: nhanVien?.ho_ten,
          email: nhanVien?.email,
          gioi_tinh: nhanVien?.gioi_tinh,
          dia_chi: nhanVien?.dia_chi,
          ngay_sinh: nhanVien?.ngay_sinh,
          ngay_vao_lam: nhanVien?.ngay_vao_lam,
          so_dien_thoai: nhanVien?.so_dien_thoai,
          cccd: nhanVien?.cccd,
          trangThai: nhanVien?.trangThai,
          phongBan: phongBan,
          chucVu: chucVu
        } as any
      })
      
      // Refresh data để xóa warning icon
      queryClient.invalidateQueries({ queryKey: ['taikhoan'] })
      queryClient.invalidateQueries({ queryKey: ['nhanvien'] })
      
      alert('Gán phòng ban thành công!')
      onClose()
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Gán phòng ban thất bại')
    }
  }
  
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Gán phòng ban và chức vụ</h3>
        <p className="text-sm text-gray-600 mb-4">
          Nhân viên: <span className="font-semibold">{nhanVien?.ho_ten}</span>
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Phòng ban *</label>
            <select 
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              value={phongBan || ''}
              onChange={(e) => setPhongBan(e.target.value ? Number(e.target.value) : undefined)}
            >
              <option value="">-- Chọn phòng ban --</option>
              {phongBans.map((pb: any) => (
                <option key={pb.phongban_id} value={pb.phongban_id}>
                  {pb.ten_phongban} - {pb.dia_diem}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Chức vụ *</label>
            <select 
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
              value={chucVu || ''}
              onChange={(e) => setChucVu(e.target.value ? Number(e.target.value) : undefined)}
            >
              <option value="">-- Chọn chức vụ --</option>
              {chucVus.map((cv: any) => (
                <option key={cv.chucvu_id} value={cv.chucvu_id}>
                  {cv.ten_chucvu}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex justify-end gap-3 mt-6">
          <button 
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Hủy
          </button>
          <button 
            onClick={handleSubmit}
            disabled={updateMut.isPending}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 transition-colors"
          >
            {updateMut.isPending ? 'Đang lưu...' : 'Lưu'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function TaiKhoanList() {
  const [page, setPage] = useState(0)
  const [size] = useState(10)
  const [showForm, setShowForm] = useState<null | Partial<TaiKhoan>>(null)
  const [assignNhanVienId, setAssignNhanVienId] = useState<number | null>(null)
  const [createEmployeeForAccount, setCreateEmployeeForAccount] = useState<any>(null)
  const { data, isLoading, error } = useTaiKhoanList(page, size)
  const createMut = useCreateTaiKhoan()
  const createNhanVienMut = useCreateNhanVien()
  const updateMut = useUpdateTaiKhoan()
  const deleteMut = useDeleteTaiKhoan()

  const pageData = data || { content: [], totalElements: 0, totalPages: 0, number: 0, size }

  const onSubmit = async (formData: any) => {
    try {
      if ((showForm as any)?.taikhoan_id) {
        // Update account only
        const accountData = {
          ten_dangnhap: formData.ten_dangnhap,
          quyen_han: formData.quyen_han,
          mat_khau: formData.mat_khau
        }
        await updateMut.mutateAsync({ id: (showForm as any).taikhoan_id, body: accountData })
        alert('Cập nhật tài khoản thành công!')
        setShowForm(null)
      } else {
        // Tạo tài khoản + nhân viên trong 1 transaction (Backend xử lý)
        const requestData = {
          // Thông tin tài khoản
          ten_dangnhap: formData.ten_dangnhap,
          quyen_han: formData.quyen_han,
          mat_khau: formData.mat_khau,
          // Thông tin nhân viên
          ho_ten: formData.ho_ten,
          email: formData.email,
          gioi_tinh: formData.gioi_tinh || 'Nam',
          dia_chi: formData.dia_chi,
          ngay_sinh: formData.ngay_sinh || null,
          ngay_vao_lam: formData.ngay_vao_lam || new Date().toISOString().split('T')[0],
          so_dien_thoai: formData.so_dien_thoai || null,
          cccd: formData.cccd || null,
        }
        
        // Gọi API mới
        const response = await fetch('http://localhost:8080/api/tai-khoan/with-employee', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestData)
        })
        
        // Kiểm tra response
        const contentType = response.headers.get('content-type')
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text()
          console.error('Non-JSON response:', text)
          throw new Error('Backend trả về lỗi: ' + (text.substring(0, 200) || 'Không rõ'))
        }
        
        const result = await response.json()
        
        if (!response.ok) {
          throw new Error(result.message || 'Tạo tài khoản thất bại')
        }
        
        alert('Tạo tài khoản và hồ sơ nhân viên thành công! Tiếp theo: Gán phòng ban và chức vụ.')
        
        // Tự động mở modal gán phòng ban
        setShowForm(null)
        setTimeout(() => {
          setAssignNhanVienId(result.data.nhanvien_id)
        }, 500)
      }
    } catch (err: any) {
      const errorMsg = err?.message || 'Có lỗi xảy ra'
      alert('Lỗi: ' + errorMsg)
      console.error('Error creating/updating account:', err)
      // KHÔNG đóng modal khi lỗi - giữ dữ liệu để user sửa
    }
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
                <th className="p-2">Nhân viên</th>
                <th className="p-2">Quyền hạn</th>
                <th className="p-2 w-48">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {pageData.content.map((tk: any) => {
                const hasEmployee = tk.nhanVien
                
                return (
                  <tr key={tk.taikhoan_id} className="border-t">
                    <td className="p-2">{tk.taikhoan_id}</td>
                    <td className="p-2">{tk.ten_dangnhap}</td>
                    <td className="p-2">
                      {hasEmployee ? (
                        <span className="text-sm">{tk.nhanVien.ho_ten}</span>
                      ) : (
                        <span className="text-xs text-gray-400">Chưa có</span>
                      )}
                    </td>
                    <td className="p-2">{tk.quyen_han}</td>
                    <td className="p-2 flex gap-2 items-center">
                      <button onClick={()=>setShowForm(tk)} className="px-2 py-1 border rounded">Sửa</button>
                      <button onClick={()=>deleteMut.mutate(tk.taikhoan_id)} className="px-2 py-1 border rounded text-red-600">Xoá</button>
                    </td>
                  </tr>
                )
              })}
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
        <TKForm initial={showForm} submitting={createMut.isPending||updateMut.isPending||createNhanVienMut.isPending} onSubmit={onSubmit} onCancel={()=>setShowForm(null)} />
      )}
      
      {assignNhanVienId && (
        <AssignDepartmentModal 
          nhanVienId={assignNhanVienId} 
          onClose={() => setAssignNhanVienId(null)} 
        />
      )}
      
      {createEmployeeForAccount && (
        <CreateEmployeeModal 
          taiKhoan={createEmployeeForAccount} 
          onClose={() => setCreateEmployeeForAccount(null)} 
        />
      )}
    </div>
  )
}
