import { useState, useEffect } from 'react'
import { useAuthStore } from '../../stores/auth'
import { useChamCongGPS, useChamCongStatus } from '../../api/chamcong-gps'
import { useCreateNghiPhep, useNghiPhepList } from '../../api/nghiphep'
import { useChamCongList } from '../../api/chamcong'
import { useBangLuongList } from '../../api/bangluong'
import { useHopDongList } from '../../api/hopdong'

export default function EmployeeDashboard() {
  const { user } = useAuthStore()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showLeaveForm, setShowLeaveForm] = useState(false)

  const { data: status, refetch } = useChamCongStatus(user?.nhanVienId)
  const chamCongMut = useChamCongGPS()
  const createLeaveMut = useCreateNghiPhep()
  
  // Fetch real data
  const currentMonth = new Date().getMonth() + 1
  const currentYear = new Date().getFullYear()
  const { data: chamCongData } = useChamCongList(0, 20, user?.nhanVienId, currentMonth, currentYear)
  const { data: nghiPhepData } = useNghiPhepList(0, 10)
  const { data: bangLuongData } = useBangLuongList(0, 100)
  const { data: hopDongData } = useHopDongList(0, 100)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  }

  const handleCheckIn = async () => {
    setError(null)
    setSuccess(null)
    setLoading(true)

    try {
      // Get GPS location
      if (!navigator.geolocation) {
        throw new Error('Trình duyệt không hỗ trợ GPS')
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        })
      })

      const { latitude, longitude } = position.coords

      // Call API
      const result = await chamCongMut.mutateAsync({
        nhanVienId: user!.nhanVienId!,
        latitude,
        longitude,
        diaChiCheckin: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
      })

      setSuccess(result.message)
      refetch()
    } catch (err: any) {
      if (err.code === 1) {
        setError('Vui lòng cho phép truy cập vị trí trong cài đặt trình duyệt')
      } else if (err.code === 2) {
        setError('Không thể lấy vị trí. Vui lòng bật GPS')
      } else if (err.code === 3) {
        setError('Timeout. Vui lòng thử lại')
      } else {
        setError(err?.response?.data?.message || err?.message || 'Chấm công thất bại')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleLeaveSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const ngayBatDau = formData.get('ngayBatDau') as string
    const ngayKetThuc = formData.get('ngayKetThuc') as string
    const loaiNghi = formData.get('loaiNghi') as string
    const lyDo = formData.get('lyDo') as string

    // Calculate days
    const start = new Date(ngayBatDau)
    const end = new Date(ngayKetThuc)
    const soNgayNghi = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1

    try {
      await createLeaveMut.mutateAsync({
        nhanVien: user!.nhanVienId!,
        ngayBatDau,
        ngayKetThuc,
        soNgayNghi,
        loaiNghi,
        lyDo
      })
      setSuccess('Đăng ký nghỉ phép thành công!')
      setShowLeaveForm(false)
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Đăng ký thất bại')
    }
  }

  // Calculate statistics from real data
  const stats = {
    soNgayLam: chamCongData?.content?.length || 0,
    tongGioLam: chamCongData?.content?.reduce((sum: number, cc: any) => sum + (cc.tongGioLam || 0), 0) || 0,
    diMuon: chamCongData?.content?.filter((cc: any) => cc.trangThai === 'DI_MUON').length || 0,
    nghiPhep: nghiPhepData?.content?.filter((np: any) => 
      (np.nhanVien?.nhanvien_id === user?.nhanVienId || np.nhanVien === user?.nhanVienId) && 
      np.trangThai === 'DA_DUYET'
    ).reduce((sum: number, np: any) => sum + (np.soNgayNghi || np.so_ngay || 0), 0) || 0
  }

  // Calculate estimated salary based on attendance
  const luongCoBan = hopDongData?.content
    ?.filter((hd: any) => hd.nhanVien?.nhanvien_id === user?.nhanVienId || hd.nhanVien === user?.nhanVienId)
    ?.[0]?.luongCoBan || 0
  
  const luongNgay = luongCoBan / 26 // Assuming 26 working days per month
  const luongDuKien = Math.round(stats.soNgayLam * luongNgay)

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-gray-900">Xin chào, {user?.tenDangnhap}! 👋</h1>
            <p className="text-gray-600">{formatDate(currentTime)}</p>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold text-gray-900">{formatTime(currentTime)}</div>
            <div className="text-gray-600 mt-1">Giờ hiện tại</div>
          </div>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start gap-2">
          <span className="text-xl">⚠️</span>
          <span className="flex-1">{error}</span>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">×</button>
        </div>
      )}
      {success && (
        <div className="bg-green-50 border-2 border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-start gap-2">
          <span className="text-xl">✅</span>
          <span className="flex-1">{success}</span>
          <button onClick={() => setSuccess(null)} className="text-green-400 hover:text-green-600">×</button>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Check-in Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Chấm công</h3>
            <span className="text-3xl">📍</span>
          </div>
          <button
            onClick={handleCheckIn}
            disabled={loading || status?.checkedOut}
            className={`w-full py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              status?.checkedIn && !status?.checkedOut
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {loading ? 'Đang xử lý...' : status?.checkedOut ? 'Đã hoàn thành' : status?.checkedIn ? 'Chấm công ra' : 'Chấm công vào'}
          </button>
          <div className="mt-3 text-sm text-gray-500 text-center">
            {status?.message || 'Chưa chấm công hôm nay'}
          </div>
          {status?.gioVao && (
            <div className="mt-2 text-xs text-center">
              <span className="text-green-600 font-semibold">Vào: {status.gioVao}</span>
              {status.gioRa && <span className="text-red-600 font-semibold ml-2">Ra: {status.gioRa}</span>}
            </div>
          )}
        </div>

        {/* Salary Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Lương tháng này</h3>
            <span className="text-3xl">💰</span>
          </div>
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {luongDuKien.toLocaleString('vi-VN')}đ
          </div>
          <div className="text-sm text-gray-500">
            Dự kiến ({stats.soNgayLam} ngày × {Math.round(luongNgay).toLocaleString('vi-VN')}đ)
          </div>
        </div>

        {/* Leave Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-orange-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Nghỉ phép</h3>
            <span className="text-3xl">🏖️</span>
          </div>
          <div className="text-3xl font-bold text-orange-600 mb-2">
            {12 - stats.nghiPhep} ngày
          </div>
          <div className="text-sm text-gray-500">
            Còn lại trong năm
          </div>
        </div>

        {/* Contract Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Hợp đồng</h3>
            <span className="text-3xl">📋</span>
          </div>
          <div className="text-lg font-bold text-purple-600 mb-2">
            {hopDongData?.content
              ?.filter((hd: any) => hd.nhanVien?.nhanvien_id === user?.nhanVienId || hd.nhanVien === user?.nhanVienId)
              ?.[0]?.loai_hopdong || 'Chưa có'}
          </div>
          <div className="text-sm text-gray-500">
            {hopDongData?.content
              ?.filter((hd: any) => hd.nhanVien?.nhanvien_id === user?.nhanVienId || hd.nhanVien === user?.nhanVienId)
              ?.[0]?.trangThai || 'Chưa có thông tin'}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile & Attendance */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Info */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>👤</span> Thông tin cá nhân
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Họ tên</div>
                <div className="font-semibold">{user?.tenDangnhap}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Email</div>
                <div className="font-semibold">employee@qlns.com</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Phòng ban</div>
                <div className="font-semibold">Phòng IT</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Chức vụ</div>
                <div className="font-semibold">Nhân viên</div>
              </div>
            </div>
          </div>

          {/* Attendance History */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>⏰</span> Lịch sử chấm công
            </h2>
            <div className="space-y-3">
              {chamCongData?.content && chamCongData.content.length > 0 ? (
                chamCongData.content.slice(0, 5).map((cc: any) => (
                  <div key={cc.chamcong_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-semibold">{cc.ngay_lam}</div>
                      <div className="text-sm text-gray-500">{cc.trangThai || 'Đúng giờ'}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-green-600">
                        {cc.gio_vao} - {cc.gio_ra || '--:--'}
                      </div>
                      <div className="text-xs text-gray-500">{cc.tongGioLam?.toFixed(1) || '0'} giờ</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-4">Chưa có dữ liệu chấm công</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Leave & Notifications */}
        <div className="space-y-6">
          {/* Leave Requests */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>🏖️</span> Đơn nghỉ phép
            </h2>
            <button 
              onClick={() => setShowLeaveForm(true)}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold mb-4"
            >
              + Đăng ký nghỉ phép
            </button>
            <div className="space-y-3">
              {nghiPhepData?.content && nghiPhepData.content.length > 0 ? (
                nghiPhepData.content
                  .filter((np: any) => np.nhanVien?.nhanvien_id === user?.nhanVienId || np.nhanVien === user?.nhanVienId)
                  .slice(0, 3)
                  .map((np: any) => {
                    const bgColor = np.trangThai === 'CHO_DUYET' ? 'bg-yellow-50 border-yellow-200' : 
                                    np.trangThai === 'DA_DUYET' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                    const badgeColor = np.trangThai === 'CHO_DUYET' ? 'bg-yellow-200 text-yellow-800' : 
                                       np.trangThai === 'DA_DUYET' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                    const statusText = np.trangThai === 'CHO_DUYET' ? 'Chờ duyệt' : 
                                       np.trangThai === 'DA_DUYET' ? 'Đã duyệt' : 'Từ chối'
                    
                    return (
                      <div key={np.nghiphep_id} className={`p-3 border rounded-lg ${bgColor}`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-semibold">
                            {np.ngayBatDau || np.tu_ngay} - {np.ngayKetThuc || np.den_ngay}
                          </span>
                          <span className={`text-xs px-2 py-1 rounded ${badgeColor}`}>{statusText}</span>
                        </div>
                        <div className="text-xs text-gray-600">
                          {np.loaiNghi || np.loai} - {np.soNgayNghi || np.so_ngay} ngày
                        </div>
                      </div>
                    )
                  })
              ) : (
                <div className="text-center text-gray-500 py-4">Chưa có đơn nghỉ phép</div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>📊</span> Thống kê tháng này
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Số ngày làm việc</span>
                <span className="font-bold text-blue-600">{stats.soNgayLam} ngày</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Tổng giờ làm</span>
                <span className="font-bold text-green-600">{stats.tongGioLam.toFixed(1)} giờ</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Đi muộn</span>
                <span className="font-bold text-orange-600">{stats.diMuon} lần</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Nghỉ phép</span>
                <span className="font-bold text-purple-600">{stats.nghiPhep} ngày</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Leave Registration Modal */}
      {showLeaveForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Đăng ký nghỉ phép</h3>
            <form onSubmit={handleLeaveSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Từ ngày</label>
                <input type="date" name="ngayBatDau" required className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Đến ngày</label>
                <input type="date" name="ngayKetThuc" required className="w-full border rounded-lg px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Loại nghỉ</label>
                <select name="loaiNghi" required className="w-full border rounded-lg px-3 py-2">
                  <option value="PHEP_NAM">Phép năm</option>
                  <option value="OM">Ốm</option>
                  <option value="KHONG_LUONG">Không lương</option>
                  <option value="KET_HON">Kết hôn</option>
                  <option value="TANG">Tang</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Lý do</label>
                <textarea name="lyDo" required rows={3} className="w-full border rounded-lg px-3 py-2" placeholder="Nhập lý do nghỉ phép..."></textarea>
              </div>
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => setShowLeaveForm(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                  Hủy
                </button>
                <button type="submit" disabled={createLeaveMut.isPending} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50">
                  {createLeaveMut.isPending ? 'Đang gửi...' : 'Đăng ký'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
