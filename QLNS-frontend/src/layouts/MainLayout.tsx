import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/auth'
import api from '../api/client'

export default function MainLayout() {
  const location = useLocation()
  const nav = useNavigate()
  const { user, logout } = useAuthStore()

  const onLogout = async () => {
    try {
      await api.post('/api/auth/logout')
    } catch {}
    logout()
    nav('/login', { replace: true })
  }
  return (
    <div className="min-h-screen grid grid-cols-[240px_1fr]">
      <aside className="bg-white border-r">
        <div className="h-14 flex items-center px-4 font-semibold">QLNS</div>
        <nav className="px-2 space-y-1">
          <Link className={`block px-3 py-2 rounded hover:bg-gray-100 ${location.pathname==='/'?'bg-gray-100':''}`} to="/">Dashboard</Link>
          {(user?.role==='ADMIN' || user?.role==='MANAGER') && (
            <Link className={`block px-3 py-2 rounded hover:bg-gray-100 ${location.pathname.startsWith('/phongban')?'bg-gray-100':''}`} to="/phongban">Phòng ban</Link>
          )}
          {(user?.role==='ADMIN' || user?.role==='MANAGER') && (
            <Link className={`block px-3 py-2 rounded hover:bg-gray-100 ${location.pathname.startsWith('/chucvu')?'bg-gray-100':''}`} to="/chucvu">Chức vụ</Link>
          )}
          <Link className={`block px-3 py-2 rounded hover:bg-gray-100 ${location.pathname.startsWith('/hopdong')?'bg-gray-100':''}`} to="/hopdong">Hợp đồng</Link>
          <Link className={`block px-3 py-2 rounded hover:bg-gray-100 ${location.pathname.startsWith('/chamcong')?'bg-gray-100':''}`} to="/chamcong">Chấm công</Link>
          <Link className={`block px-3 py-2 rounded hover:bg-gray-100 ${location.pathname.startsWith('/bangluong')?'bg-gray-100':''}`} to="/bangluong">Bảng lương</Link>
          <Link className={`block px-3 py-2 rounded hover:bg-gray-100 ${location.pathname.startsWith('/nghiphep')?'bg-gray-100':''}`} to="/nghiphep">Nghỉ phép</Link>
          <Link className={`block px-3 py-2 rounded hover:bg-gray-100 ${location.pathname.startsWith('/danhgia')?'bg-gray-100':''}`} to="/danhgia">Đánh giá</Link>
          {user?.role === 'ADMIN' && (
            <Link className={`block px-3 py-2 rounded hover:bg-gray-100 ${location.pathname.startsWith('/tai-khoan')?'bg-gray-100':''}`} to="/tai-khoan">Tài khoản</Link>
          )}
          {(user?.role==='ADMIN' || user?.role==='MANAGER') && (
            <Link className={`block px-3 py-2 rounded hover:bg-gray-100 ${location.pathname.startsWith('/nhanvien')?'bg-gray-100':''}`} to="/nhanvien">Nhân viên</Link>
          )}
        </nav>
      </aside>
      <div className="flex flex-col min-h-screen">
        <header className="h-14 border-b bg-white flex items-center justify-between px-4">
          <div className="font-medium">Xin chào {user?.tenDangnhap} {user?.role ? `(${user.role})` : ''}</div>
          <div className="flex items-center gap-3">
            <Link to="/change-password" className="text-sm text-blue-600">Đổi mật khẩu</Link>
            <button onClick={onLogout} className="text-sm bg-black text-white px-3 py-1.5 rounded">Đăng xuất</button>
          </div>
        </header>
        <main className="p-6 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
