import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from './client'
import type { PhongBan, Page } from '../types'

// Re-export for backward compatibility
export type { PhongBan, Page }

export function usePhongBanList(page: number, size: number) {
  return useQuery({
    queryKey: ['phongban', { page, size }],
    queryFn: async () => {
      const res = await api.get<Page<PhongBan>>('/api/phongban', { params: { page, size } })
      return res.data
    },
    placeholderData: keepPreviousData,
  })
}

export function usePhongBanDetail(id: number) {
  return useQuery({
    queryKey: ['phongban', id],
    queryFn: async () => {
      const res = await api.get<PhongBan>(`/api/phongban/${id}`)
      return res.data
    },
    enabled: !!id,
  })
}

export function useCreatePhongBan() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (body: Partial<PhongBan>) => {
      const res = await api.post<PhongBan>('/api/phongban', body)
      return res.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['phongban'] })
    },
  })
}

export function useUpdatePhongBan() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, body }: { id: number; body: Partial<PhongBan> }) => {
      const res = await api.put<PhongBan>(`/api/phongban/${id}`, body)
      return res.data
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ['phongban'] })
      qc.invalidateQueries({ queryKey: ['phongban', vars.id] })
    },
  })
}

export function useDeletePhongBan() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/api/phongban/${id}`)
      return id
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['phongban'] })
    },
  })
}
