import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from './client'

export type BangLuong = {
  bangluong_id: number
  nhanVien: { nhanvien_id: number; ho_ten?: string } | number
  thang: number
  nam: number
  luong_co_ban: number
  phu_cap?: number
  khau_tru?: number
  bhxh?: number
  bhyt?: number
  bhtn?: number
  thueThuNhap?: number
  tong_cong?: number
  thuc_lanh?: number
  thuong?: number
  phat?: number
  ngayThanhToan?: string
  trangThai?: 'CHO_DUYET' | 'DA_DUYET' | 'DA_THANH_TOAN' | string
}

export type Page<T> = {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

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
    mutationFn: async (body: Partial<BangLuong>) => {
      const res = await api.post<BangLuong>('/api/bangluong', body)
      return res.data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['bangluong'] }),
  })
}

export function useUpdateBangLuong() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, body }: { id: number; body: Partial<BangLuong> }) => {
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
