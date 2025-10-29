import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from './client'
import type { NhanVien, Page } from '../types'

// Re-export for backward compatibility
export type { NhanVien, Page }

export function useNhanVienList(page: number, size: number, q: string) {
  return useQuery({
    queryKey: ['nhanvien', { page, size, q }],
    queryFn: async () => {
      if (q && q.trim()) {
        const res = await api.get<NhanVien[]>(`/api/nhanvien/search`, { params: { q } })
        return { content: res.data, totalElements: res.data.length, totalPages: 1, number: 0, size: res.data.length } as Page<NhanVien>
      }
      const res = await api.get<Page<NhanVien>>('/api/nhanvien', { params: { page, size } })
      return res.data
    },
    placeholderData: keepPreviousData,
  })
}

export function useNhanVienDetail(id: number) {
  return useQuery({
    queryKey: ['nhanvien', id],
    queryFn: async () => {
      const res = await api.get<NhanVien>(`/api/nhanvien/${id}`)
      return res.data
    },
    enabled: !!id,
  })
}

export function useCreateNhanVien() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (body: Partial<NhanVien>) => {
      const res = await api.post<NhanVien>('/api/nhanvien', body)
      return res.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['nhanvien'] })
    },
  })
}

export function useUpdateNhanVien() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, body }: { id: number; body: Partial<NhanVien> }) => {
      const res = await api.put<NhanVien>(`/api/nhanvien/${id}`, body)
      return res.data
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ['nhanvien'] })
      qc.invalidateQueries({ queryKey: ['nhanvien', vars.id] })
    },
  })
}

export function useDeleteNhanVien() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/api/nhanvien/${id}`)
      return id
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['nhanvien'] })
    },
  })
}
