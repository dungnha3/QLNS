import { create } from 'zustand'

export type Role = 'ADMIN' | 'MANAGER' | 'EMPLOYEE' | null

type User = {
  tenDangnhap: string
  role: Role
  nhanVienId?: number
} | null

type AuthState = {
  token: string | null
  user: User
  login: (token: string, user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token'),
  user: (() => {
    const raw = localStorage.getItem('user')
    if (!raw) return null
    try { return JSON.parse(raw) } catch { return null }
  })(),
  login: (token, user) => {
    localStorage.setItem('token', token)
    if (user) localStorage.setItem('user', JSON.stringify(user))
    set({ token, user })
  },
  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    set({ token: null, user: null })
  },
}))
