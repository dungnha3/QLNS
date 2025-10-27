import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from './client'

export type DanhGia = {
  danhgia_id: number
  nhanVien: { nhanvien_id: number; ho_ten?: string } | number
  nguoiDanhGia: { nhanvien_id: number; ho_ten?: string } | number
  kyDanhGia: string
  loaiDanhGia?: 'THANG' | 'QUY' | 'NAM' | 'THU_VIEC' | string
  diemChuyenMon: number
  diemThaiDo: number
  diemKyNang: number
  diemTrungBinh?: number
  xepLoai?: 'XUAT_SAC' | 'TOT' | 'KHA' | 'TRUNG_BINH' | 'YEU' | string
  nhanXet?: string
  mucTieuKeTiep?: string
  ngayDanhGia?: string
}

export type Page<T> = {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

export function useDanhGiaList(page: number, size: number) {
  return useQuery({
    queryKey: ['danhgia', { page, size }],
    queryFn: async () => {
      const res = await api.get<Page<DanhGia>>('/api/danhgia', { params: { page, size } })
      return res.data
    },
    placeholderData: keepPreviousData,
  })
}

export function useCreateDanhGia() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (body: Partial<DanhGia>) => {
      const res = await api.post<DanhGia>('/api/danhgia', body)
      return res.data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['danhgia'] }),
  })
}

export function useUpdateDanhGia() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, body }: { id: number; body: Partial<DanhGia> }) => {
      const res = await api.put<DanhGia>(`/api/danhgia/${id}`, body)
      return res.data
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({ queryKey: ['danhgia'] })
      qc.invalidateQueries({ queryKey: ['danhgia', vars.id] })
    },
  })
}

export function useDeleteDanhGia() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/api/danhgia/${id}`)
      return id
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['danhgia'] }),
  })
}
