import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from './client'
import type { HopDong, HopDongRequest, Page } from '../types'

// Re-export for backward compatibility
export type { HopDong, Page }

export function useHopDongList(page: number, size: number) {
  return useQuery({
    queryKey: ['hopdong', { page, size }],
    queryFn: async () => {
      const res = await api.get<Page<HopDong>>('/api/hopdong', { params: { page, size } })
      return res.data
    },
    placeholderData: keepPreviousData,
  })
}

export function useHopDongDetail(id: number) {
  return useQuery({
    queryKey: ['hopdong', id],
    queryFn: async () => {
      const res = await api.get<HopDong>(`/api/hopdong/${id}`)
      return res.data
    },
    enabled: !!id,
  })
}

export function useCreateHopDong() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (body: Partial<HopDongRequest>) => {
      const res = await api.post<HopDong>('/api/hopdong', body)
      return res.data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['hopdong'] })
    },
  })
}

export function useUpdateHopDong() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, body }: { id: number; body: Partial<HopDongRequest> }) => {
      const res = await api.put<HopDong>(`/api/hopdong/${id}`, body)
      return res.data
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ['hopdong'] })
      qc.invalidateQueries({ queryKey: ['hopdong', vars.id] })
    },
  })
}

export function useDeleteHopDong() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/api/hopdong/${id}`)
      return id
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['hopdong'] })
    },
  })
}
