import { useState } from 'react'
import { } from 'react-router-dom'
import api from '../api/client'
import { useAuthStore } from '../stores/auth'

export default function Login() {
  const [tenDangnhap, setUsername] = useState('admin')
  const [matKhau, setPassword] = useState('Admin@123456')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const loginStore = useAuthStore()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await api.post('/api/auth/login', { tenDangnhap, matKhau })
      // Backend: ApiResponse<LoginResponse>
      const ok = res.data?.success !== false
      if (!ok) throw new Error(res.data?.message || 'Đăng nhập thất bại')
      const payload = res.data?.data ?? res.data
      const token: string | undefined = payload?.token
      const username: string | undefined = payload?.tenDangnhap || tenDangnhap
      const role = (payload?.quyenHan as any) || null
      const nhanVienId: number | undefined = payload?.nhanVienId
      if (!token) throw new Error('Không nhận được token')
      loginStore.login(token, { tenDangnhap: username || tenDangnhap, role, nhanVienId })
      window.location.href = '/'
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Đăng nhập thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={onSubmit} className="bg-white p-6 rounded shadow w-full max-w-sm space-y-4">
        <h1 className="text-xl font-semibold">Đăng nhập</h1>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <div>
          <label className="block text-sm mb-1">Tên đăng nhập</label>
          <input className="w-full border rounded px-3 py-2" value={tenDangnhap} onChange={e=>setUsername(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm mb-1">Mật khẩu</label>
          <input type="password" className="w-full border rounded px-3 py-2" value={matKhau} onChange={e=>setPassword(e.target.value)} />
        </div>
        <button disabled={loading} className="w-full bg-black text-white py-2 rounded disabled:opacity-50">
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
        {/* Register and change-password removed */}
      </form>
    </div>
  )
}
