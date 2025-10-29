import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from './client'
import type { BangLuong, BangLuongRequest, Page } from '../types'

// Re-export for backward compatibility
export type { BangLuong, Page }

export function useBangLuongList(page: number, size: number, trangThai?: string) {
  return useQuery({
    queryKey: ['bangluong', { page, size, trangThai }],
    queryFn: async () => {
      const params: any = { page, size }
      if (trangThai) params.trangThai = trangThai
      const res = await api.get<Page<BangLuong>>('/api/bangluong', { params })
      return res.data
    },
    placeholderData: keepPreviousData,
  })
}

export function useCreateBangLuong() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (body: Partial<BangLuongRequest>) => {
      const res = await api.post<BangLuong>('/api/bangluong', body)
      return res.data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bangluong'] }),
  })
}

export function useUpdateBangLuong() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, body }: { id: number; body: Partial<BangLuongRequest> }) => {
      const res = await api.put<BangLuong>(`/api/bangluong/${id}`, body)
      return res.data
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ['bangluong'] })
      qc.invalidateQueries({ queryKey: ['bangluong', vars.id] })
    },
  })
}

export function useDeleteBangLuong() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/api/bangluong/${id}`)
      return id
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bangluong'] }),
  })
}

export function useTinhLuongTuDong() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ nhanVienId, thang, nam }: { nhanVienId: number; thang: number; nam: number }) => {
      const res = await api.post<BangLuong>(`/api/bangluong/tinh-luong`, null, { params: { nhanVienId, thang, nam } })
      return res.data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bangluong'] }),
  })
}

export function usePreviewTinhLuong(nhanVienId?: number, thang?: number, nam?: number) {
  return useQuery({
    queryKey: ['bangluong', 'preview', nhanVienId, thang, nam],
    queryFn: async () => {
      const res = await api.get<any>('/api/bangluong/preview', { params: { nhanVienId, thang, nam } })
      return res.data
    },
    enabled: !!nhanVienId && !!thang && !!nam,
  })
}

export function useTinhLuongHangLoat() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ thang, nam, phongBanId }: { thang: number; nam: number; phongBanId?: number }) => {
      const res = await api.post<{ success: boolean; count: number; data: BangLuong[] }>(
        '/api/bangluong/tinh-hang-loat',
        null,
        { params: { thang, nam, phongBanId } }
      )
      return res.data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bangluong'] }),
  })
}

export function useCapNhatTrangThai() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, trangThai }: { id: number; trangThai: string }) => {
      const res = await api.patch<BangLuong>(`/api/bangluong/${id}/trang-thai`, { trangThai })
      return res.data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bangluong'] }),
  })
}
