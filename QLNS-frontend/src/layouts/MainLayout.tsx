import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/auth'
import api from '../api/client'
import { useState } from 'react'

export default function MainLayout() {
  const location = useLocation()
  const nav = useNavigate()
  const { user, logout } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const onLogout = async () => {
    try {
      await api.post('/api/auth/logout')
    } catch {}
    logout()
    nav('/login', { replace: true })
  }

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: '📊', roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] },
    { path: '/phongban', label: 'Phòng ban', icon: '🏢', roles: ['ADMIN', 'MANAGER'] },
    { path: '/hopdong', label: 'Hợp đồng', icon: '📄', roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] },
    { path: '/chamcong', label: 'Chấm công', icon: '⏰', roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] },
    { path: '/bangluong', label: 'Bảng lương', icon: '💰', roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] },
    { path: '/nghiphep', label: 'Nghỉ phép', icon: '🏖️', roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] },
    { path: '/tai-khoan', label: 'Tài khoản', icon: '👤', roles: ['ADMIN'] },
    { path: '/nhanvien', label: 'Nhân viên', icon: '👥', roles: ['ADMIN', 'MANAGER'] },
  ]

  const filteredMenuItems = menuItems.filter(item => 
    !user?.role || item.roles.includes(user.role)
  )

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white shadow-xl lg:shadow-none
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo & Brand */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white text-xl font-bold">Q</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">QLNS</h1>
            <p className="text-xs text-gray-500">Quản lý nhân sự</p>
          </div>
        </div>

        {/* User Profile */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-primary-50 to-blue-50">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center shadow-md">
              <span className="text-white font-semibold text-lg">
                {user?.tenDangnhap?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user?.tenDangnhap}
              </p>
              <p className="text-xs text-gray-600 truncate">
                {user?.role === 'ADMIN' ? 'Quản trị viên' : 
                 user?.role === 'MANAGER' ? 'Quản lý' : 'Nhân viên'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {filteredMenuItems.map((item) => {
            const active = isActive(item.path)
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.75rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  transition: 'all 0.2s',
                  textDecoration: 'none',
                  background: active ? 'linear-gradient(to right, #2563eb, #1d4ed8)' : 'transparent',
                  color: active ? '#ffffff' : '#374151',
                  boxShadow: active ? '0 10px 15px -3px rgba(37, 99, 235, 0.3)' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = '#f9fafb'
                    e.currentTarget.style.color = '#2563eb'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.color = '#374151'
                  }
                }}
              >
                <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>{item.icon}</span>
                <span style={{ flex: 1, color: active ? '#ffffff' : 'inherit' }}>{item.label}</span>
                {active && (
                  <div style={{ width: '0.375rem', height: '0.375rem', backgroundColor: 'white', borderRadius: '9999px', flexShrink: 0 }} />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 space-y-2">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <span className="text-xl">🚪</span>
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {filteredMenuItems.find(item => isActive(item.path))?.label || 'Dashboard'}
              </h2>
              <p className="text-sm text-gray-500">
                Xin chào, {user?.tenDangnhap}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
              <span className="text-xs font-medium text-gray-600">
                {user?.role === 'ADMIN' ? '👑 Admin' : 
                 user?.role === 'MANAGER' ? '⭐ Manager' : '👤 Employee'}
              </span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
