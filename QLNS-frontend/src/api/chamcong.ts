import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from './client'
import type { ChamCong, ChamCongRequest, Page } from '../types'

// Re-export for backward compatibility
export type { ChamCong, Page }

export function useChamCongList(page: number, size: number, nhanVienId?: number, month?: number, year?: number) {
  return useQuery({
    queryKey: ['chamcong', { page, size, nhanVienId, month, year }],
    queryFn: async () => {
      const params: any = { page, size }
      if (nhanVienId) params.nhanVienId = nhanVienId
      if (month) params.month = month
      if (year) params.year = year
      console.log('Fetching chamcong with params:', params)
      const res = await api.get<Page<ChamCong>>('/api/chamcong', { params })
      console.log('Chamcong response:', res.data)
      return res.data
    },
    placeholderData: keepPreviousData,
    refetchOnMount: true,
    staleTime: 0,
  })
}

export function useCreateChamCong() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (body: Partial<ChamCongRequest>) => {
      const res = await api.post<ChamCong>('/api/chamcong', body)
      return res.data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['chamcong'] }),
  })
}

export function useUpdateChamCong() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, body }: { id: number; body: Partial<ChamCongRequest> }) => {
      const res = await api.put<ChamCong>(`/api/chamcong/${id}`, body)
      return res.data
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ['chamcong'] })
      qc.invalidateQueries({ queryKey: ['chamcong', vars.id] })
    },
  })
}

export function useDeleteChamCong() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/api/chamcong/${id}`)
      return id
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['chamcong'] }),
  })
}
