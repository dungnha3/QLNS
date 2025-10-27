import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/client'

export default function Register() {
  const [ten_dangnhap, setUser] = useState('')
  const [mat_khau, setPass] = useState('')
  const [quyen_han, setRole] = useState<'ADMIN' | 'MANAGER' | 'EMPLOYEE'>('EMPLOYEE')
  const [ho_ten, setHoTen] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const nav = useNavigate()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      // Backend nhận TaiKhoan object tối thiểu: ten_dangnhap, mat_khau, quyen_han (mặc định backend có thể set)
      const res = await api.post('/api/auth/register', {
        ten_dangnhap,
        mat_khau,
        quyen_han,
        ho_ten: ho_ten || undefined,
        email: email || undefined,
      })
      const ok = res.data?.success !== false
      if (!ok) throw new Error(res.data?.message || 'Đăng ký thất bại')
      setSuccess('Đăng ký thành công, vui lòng đăng nhập')
      setTimeout(() => nav('/login'), 800)
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Đăng ký thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={onSubmit} className="bg-white p-6 rounded shadow w-full max-w-sm space-y-4">
        <h1 className="text-xl font-semibold">Đăng ký</h1>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        {success && <div className="text-green-600 text-sm">{success}</div>}
        <div>
          <label className="block text-sm mb-1">Tên đăng nhập</label>
          <input className="w-full border rounded px-3 py-2" value={ten_dangnhap} onChange={e=>setUser(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm mb-1">Mật khẩu</label>
          <input type="password" className="w-full border rounded px-3 py-2" value={mat_khau} onChange={e=>setPass(e.target.value)} required />
          <p className="text-xs text-gray-500 mt-1">Yêu cầu: tối thiểu 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt.</p>
        </div>
        <div>
          <label className="block text-sm mb-1">Quyền hạn</label>
          <select className="w-full border rounded px-3 py-2" value={quyen_han} onChange={e=>setRole(e.target.value as any)}>
            <option value="EMPLOYEE">EMPLOYEE</option>
            <option value="MANAGER">MANAGER</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Họ tên (tuỳ chọn)</label>
          <input className="w-full border rounded px-3 py-2" value={ho_ten} onChange={e=>setHoTen(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm mb-1">Email (tuỳ chọn)</label>
          <input type="email" className="w-full border rounded px-3 py-2" value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <button disabled={loading} className="w-full bg-black text-white py-2 rounded disabled:opacity-50">
          {loading ? 'Đang đăng ký...' : 'Đăng ký'}
        </button>
        <div className="text-sm text-center">
          Đã có tài khoản? <Link className="text-blue-600" to="/login">Đăng nhập</Link>
        </div>
      </form>
    </div>
  )
}
