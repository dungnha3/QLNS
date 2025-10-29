import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from './client'
import type { ChucVu, Page } from '../types'

// Re-export for backward compatibility
export type { ChucVu, Page }

export function useChucVuList(page: number, size: number) {
  return useQuery({
    queryKey: ['chucvu', { page, size }],
    queryFn: async () => {
      const res = await api.get<Page<ChucVu>>('/api/chucvu', { params: { page, size } })
      return res.data
    },
    placeholderData: keepPreviousData,
  })
}

export function useChucVuDetail(id: number) {
  return useQuery({
    queryKey: ['chucvu', id],
    queryFn: async () => {
      const res = await api.get<ChucVu>(`/api/chucvu/${id}`)
      return res.data
    },
    enabled: !!id,
  })
}

export function useCreateChucVu() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (body: Partial<ChucVu>) => {
      const res = await api.post<ChucVu>('/api/chucvu', body)
      return res.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['chucvu'] })
    },
  })
}

export function useUpdateChucVu() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, body }: { id: number; body: Partial<ChucVu> }) => {
      const res = await api.put<ChucVu>(`/api/chucvu/${id}`, body)
      return res.data
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ['chucvu'] })
      qc.invalidateQueries({ queryKey: ['chucvu', vars.id] })
    },
  })
}

export function useDeleteChucVu() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/api/chucvu/${id}`)
      return id
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['chucvu'] })
    },
  })
}
