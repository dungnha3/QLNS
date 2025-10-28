import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from './client'

export interface ChamCongGPSRequest {
  nhanVienId: number
  latitude: number
  longitude: number
  diaChiCheckin?: string
}

export interface ChamCongGPSResponse {
  success: boolean
  message: string
  isCheckIn: boolean
  time: string
  distance: number
  address?: string
}

export interface ChamCongStatus {
  checkedIn: boolean
  checkedOut: boolean
  gioVao?: string
  gioRa?: string
  tongGioLam?: number
  message: string
}

export function useChamCongGPS() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (request: ChamCongGPSRequest) => {
      const res = await api.post<ChamCongGPSResponse>('/api/chamcong/gps', request)
      return res.data
    },
    onSuccess: () => {
      // Invalidate status query to refresh
      queryClient.invalidateQueries({ queryKey: ['chamcong-status'] })
      queryClient.invalidateQueries({ queryKey: ['chamcong'] })
    }
  })
}

export function useChamCongStatus(nhanVienId?: number) {
  return useQuery({
    queryKey: ['chamcong-status', nhanVienId],
    queryFn: async () => {
      if (!nhanVienId) throw new Error('Nhân viên ID không hợp lệ')
      const res = await api.get<ChamCongStatus>(`/api/chamcong/status/${nhanVienId}`)
      return res.data
    },
    enabled: !!nhanVienId,
    refetchInterval: 60000, // Refresh every minute
  })
}
