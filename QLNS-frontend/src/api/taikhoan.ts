import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from './client'
import type { TaiKhoan, Page, CreateAccountWithEmployeeRequest } from '../types'

// Re-export for backward compatibility
export type { TaiKhoan }

export function useTaiKhoanList(page: number, size: number, sortBy = 'taikhoan_id', sortDir: 'asc' | 'desc' = 'asc') {
  return useQuery({
    queryKey: ['taikhoan', { page, size, sortBy, sortDir }],
    queryFn: async () => {
      // Call list endpoint directly to avoid 400 from /page on some servers.
      const all = await api.get<TaiKhoan[]>('/api/tai-khoan')
      let rows = all.data || []
      // client-side sort
      rows = rows.sort((a: any, b: any) => {
        const av = a?.[sortBy as keyof TaiKhoan]
        const bv = b?.[sortBy as keyof TaiKhoan]
        if (av === bv) return 0
        const cmp = (av as any) > (bv as any) ? 1 : -1
        return sortDir === 'asc' ? cmp : -cmp
      })
      // client-side paginate
      const start = page * size
      const content = rows.slice(start, start + size)
      const totalElements = rows.length
      const totalPages = Math.max(1, Math.ceil(totalElements / size))
      return { content, totalElements, totalPages, number: page, size } as Page<TaiKhoan>
    },
    placeholderData: keepPreviousData,
  })
}

export function useCreateTaiKhoan() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (body: Partial<TaiKhoan>) => {
      const res = await api.post('/api/tai-khoan', body)
      return res.data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['taikhoan'] }),
  })
}

export function useUpdateTaiKhoan() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, body }: { id: number; body: Partial<TaiKhoan> }) => {
      const res = await api.put(`/api/tai-khoan/${id}`, body)
      return res.data
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ['taikhoan'] })
      qc.invalidateQueries({ queryKey: ['taikhoan', vars.id] })
    },
  })
}

export function useDeleteTaiKhoan() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/api/tai-khoan/${id}`)
      return id
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['taikhoan'] }),
  })
}

export function useCreateTaiKhoanWithEmployee() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (body: CreateAccountWithEmployeeRequest) => {
      const res = await api.post('/api/tai-khoan/with-employee', body)
      return res.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['taikhoan'] })
      qc.invalidateQueries({ queryKey: ['nhanvien'] })
    },
  })
}
