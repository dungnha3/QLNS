import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from './client'
import type { NghiPhep, NghiPhepRequest, Page } from '../types'

// Re-export for backward compatibility
export type { NghiPhep }

export function useNghiPhepList(page: number, size: number, trangThai?: string) {
  return useQuery({
    queryKey: ['nghiphep', { page, size, trangThai }],
    queryFn: async () => {
      const params: any = { page, size }
      if (trangThai) params.trangThai = trangThai
      const res = await api.get<Page<NghiPhep>>('/api/nghiphep', { params })
      return res.data
    },
    placeholderData: keepPreviousData,
  })
}

export function useCreateNghiPhep() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (body: Partial<NghiPhepRequest>) => {
      const res = await api.post<NghiPhep>('/api/nghiphep', body)
      return res.data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['nghiphep'] }),
  })
}

export function useUpdateNghiPhep() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, body }: { id: number; body: Partial<NghiPhepRequest> }) => {
      const res = await api.put<NghiPhep>(`/api/nghiphep/${id}`, body)
      return res.data
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ['nghiphep'] })
      qc.invalidateQueries({ queryKey: ['nghiphep', vars.id] })
    },
  })
}

export function useDeleteNghiPhep() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/api/nghiphep/${id}`)
      return id
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['nghiphep'] }),
  })
}

export function usePheDuyetNghiPhep() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, nguoiDuyetId, trangThai, ghiChu }: { id: number; nguoiDuyetId: number; trangThai: 'DA_DUYET' | 'TU_CHOI'; ghiChu?: string }) => {
      const res = await api.post<NghiPhep>(`/api/nghiphep/${id}/phe-duyet`, { nguoiDuyetId, trangThai, ghiChu })
      return res.data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['nghiphep'] }),
  })
}
