import { useState } from 'react'
import api from '../api/client'

export default function ChangePassword() {
  const [oldPassword, setOld] = useState('')
  const [newPassword, setNew] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(null)
    try {
      const res = await api.post('/api/auth/change-password', { oldPassword, newPassword })
      const ok = res.data?.success !== false
      if (!ok) throw new Error(res.data?.message || 'Đổi mật khẩu thất bại')
      setSuccess('Đổi mật khẩu thành công')
      setOld('')
      setNew('')
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Đổi mật khẩu thất bại')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-xl font-semibold mb-4">Đổi mật khẩu</h1>
      {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
      {success && <div className="text-green-600 text-sm mb-2">{success}</div>}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Mật khẩu cũ</label>
          <input type="password" className="w-full border rounded px-3 py-2" value={oldPassword} onChange={e=>setOld(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm mb-1">Mật khẩu mới</label>
          <input type="password" className="w-full border rounded px-3 py-2" value={newPassword} onChange={e=>setNew(e.target.value)} required />
        </div>
        <button disabled={loading} className="w-full bg-black text-white py-2 rounded disabled:opacity-50">
          {loading ? 'Đang đổi...' : 'Đổi mật khẩu'}
        </button>
      </form>
    </div>
  )
}
