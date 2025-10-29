import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/auth'
import api from '../api/client'
import { useState } from 'react'

interface MenuItem {
  path: string
  label: string
  icon: string
}

interface MenuGroup {
  title: string
  icon: string
  roles: string[]
  items: MenuItem[]
  defaultOpen?: boolean
}

export default function MainLayout() {
  const location = useLocation()
  const nav = useNavigate()
  const { user, logout } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    'nhansu': true,
    'cautru': false,
    'congviec': true,
    'hethong': false,
  })

  const onLogout = async () => {
    try {
      await api.post('/api/auth/logout')
    } catch {}
    logout()
    nav('/login', { replace: true })
  }

  const toggleGroup = (groupKey: string) => {
    setOpenGroups(prev => ({ ...prev, [groupKey]: !prev[groupKey] }))
  }

  // Menu groups theo role
  const menuGroups: MenuGroup[] = user?.role === 'EMPLOYEE' ? [
    {
      title: 'Trang chủ',
      icon: '🏠',
      roles: ['EMPLOYEE'],
      defaultOpen: true,
      items: [
        { path: '/dashboard', label: 'Dashboard', icon: '📊' },
      ]
    },
  ] : [
    {
      title: 'Quản lý nhân sự & Tổ chức',
      icon: '👥',
      roles: ['ADMIN', 'MANAGER'],
      defaultOpen: true,
      items: [
        { path: '/phongban', label: 'Nhân viên theo phòng ban', icon: '🏢' },
        { path: '/chucvu', label: 'Chức vụ', icon: '🎯' },
        { path: '/hopdong', label: 'Hợp đồng', icon: '📋' },
      ]
    },
    {
      title: 'Quản lý công việc',
      icon: '⏰',
      roles: ['ADMIN', 'MANAGER'],
      defaultOpen: true,
      items: [
        { path: '/chamcong', label: 'Chấm công', icon: '⏰' },
        { path: '/nghiphep', label: 'Duyệt nghỉ phép', icon: '🏖️' },
        { path: '/bangluong', label: 'Bảng lương', icon: '💰' },
      ]
    },
    {
      title: 'Hệ thống',
      icon: '⚙️',
      roles: ['ADMIN'],
      items: [
        { path: '/tai-khoan', label: 'Tài khoản', icon: '👤' },
      ]
    },
  ]

  const filteredGroups = menuGroups.filter(group => 
    !user?.role || group.roles.includes(user.role)
  )

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const isGroupActive = (items: MenuItem[]) => {
    return items.some(item => isActive(item.path))
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
          <div>
            <h1 className="text-xl font-bold text-gray-900">QLNS</h1>
            <p className="text-xs text-gray-500">Quản lý nhân sự</p>
          </div>
        </div>

        {/* User Profile */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
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
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {filteredGroups.map((group, groupIdx) => {
            const groupKey = groupIdx.toString()
            const isOpen = openGroups[groupKey] ?? (group.defaultOpen || false)
            const hasActiveItem = isGroupActive(group.items)
            
            return (
              <div key={groupIdx} className="mb-2">
                {/* Group Header */}
                <button
                  onClick={() => toggleGroup(groupKey)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    hasActiveItem 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-lg">{group.icon}</span>
                  <span className="flex-1 text-left">{group.title}</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Group Items */}
                {isOpen && (
                  <div className="mt-1 ml-2 space-y-1">
                    {group.items.map((item) => {
                      const active = isActive(item.path)
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setSidebarOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                            active
                              ? 'bg-blue-500 text-white'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                          }`}
                        >
                          <span className="flex-1">{item.label}</span>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
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
                {filteredGroups.flatMap(g => g.items).find(item => isActive(item.path))?.label || 'QLNS'}
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
