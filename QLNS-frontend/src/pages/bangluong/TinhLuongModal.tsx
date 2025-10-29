import { useState } from 'react'
import { useNhanVienList } from '../../api/nhanvien'
import { usePreviewTinhLuong, useTinhLuongTuDong } from '../../api/bangluong'
import type { BangLuong } from '../../api/bangluong'

export function TinhLuongModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: (bl: BangLuong) => void }) {
  const [nhanVienId, setNhanVienId] = useState<number | null>(null)
  const today = new Date()
  const [thang, setThang] = useState(today.getMonth() + 1)
  const [nam, setNam] = useState(today.getFullYear())
  const [showPreview, setShowPreview] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { data: nvData } = useNhanVienList(0, 1000, '')
  const nhanViens = nvData?.content || []
  
  const { data: preview, isLoading: previewLoading } = usePreviewTinhLuong(
    showPreview && nhanVienId ? nhanVienId : undefined,
    showPreview ? thang : undefined,
    showPreview ? nam : undefined
  )
  
  const tinhMut = useTinhLuongTuDong()

  const handlePreview = () => {
    setError(null)
    if (!nhanVienId) {
      setError('Vui lòng chọn nhân viên')
      return
    }
    setShowPreview(true)
  }

  const handleConfirm = async () => {
    setError(null)
    if (!nhanVienId) {
      setError('Vui lòng chọn nhân viên')
      return
    }
    try {
      const result = await tinhMut.mutateAsync({ nhanVienId, thang, nam })
      onSuccess(result)
    } catch (e: any) {
      setError(e?.response?.data?.message || e?.message || 'Tính lương thất bại')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">⚡ Tính lương tự động</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2">
              <span className="text-xl">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Chọn nhân viên */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">👤 Chọn nhân viên</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={nhanVienId || ''}
              onChange={(e) => {
                setNhanVienId(e.target.value ? Number(e.target.value) : null)
                setShowPreview(false)
              }}
            >
              <option value="">-- Chọn nhân viên --</option>
              {nhanViens.map(nv => (
                <option key={nv.nhanvien_id} value={nv.nhanvien_id}>
                  {nv.ho_ten} - {nv.email}
                </option>
              ))}
            </select>
          </div>

          {/* Tháng năm */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">📅 Tháng</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
                value={thang}
                onChange={(e) => {
                  setThang(Number(e.target.value))
                  setShowPreview(false)
                }}
              >
                {Array.from({ length: 12 }).map((_, i) => (
                  <option key={i + 1} value={i + 1}>Tháng {i + 1}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">📆 Năm</label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500"
                value={nam}
                onChange={(e) => {
                  setNam(Number(e.target.value))
                  setShowPreview(false)
                }}
              />
            </div>
          </div>

          {/* Preview */}
          {showPreview && preview && (
            <div className="bg-gray-50 rounded-xl p-6 space-y-4 border border-gray-200">
              <h4 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                <span>📊</span> Xem trước kết quả
              </h4>

              {/* Thông tin nhân viên */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div>
                    <div className="font-semibold text-gray-900">{preview.nhanVien?.hoTen}</div>
                    <div className="text-sm text-gray-500">{preview.nhanVien?.chucVu} - {preview.nhanVien?.phongBan}</div>
                  </div>
                </div>
              </div>

              {/* Chấm công */}
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h5 className="font-semibold text-gray-900 mb-2">⏰ Chấm công</h5>
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <div className="text-gray-500">Số ngày làm</div>
                    <div className="font-semibold text-lg">{preview.chamCong?.soNgayLam} ngày</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Tổng giờ làm</div>
                    <div className="font-semibold text-lg">{preview.chamCong?.tongGioLam?.toFixed(1)} giờ</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Giờ chuẩn</div>
                    <div className="font-semibold text-lg">{preview.chamCong?.gioLamChuan} giờ</div>
                  </div>
                </div>
              </div>

              {/* Chi tiết lương */}
              <div className="bg-white rounded-lg p-4 shadow-sm space-y-2 text-sm">
                <h5 className="font-semibold text-gray-900 mb-3">💰 Chi tiết lương</h5>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lương cơ bản</span>
                  <span className="font-semibold">{Number(preview.luongCoBan || 0).toLocaleString()}đ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phụ cấp</span>
                  <span className="font-semibold text-green-600">+{Number(preview.phuCap || 0).toLocaleString()}đ</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Tổng cộng</span>
                  <span className="text-blue-600">{Number(preview.tongCong || 0).toLocaleString()}đ</span>
                </div>
                <div className="border-t pt-2 space-y-1 text-xs text-gray-500">
                  <div className="flex justify-between">
                    <span>BHXH (8%)</span>
                    <span>-{Number(preview.bhxh || 0).toLocaleString()}đ</span>
                  </div>
                  <div className="flex justify-between">
                    <span>BHYT (1.5%)</span>
                    <span>-{Number(preview.bhyt || 0).toLocaleString()}đ</span>
                  </div>
                  <div className="flex justify-between">
                    <span>BHTN (1%)</span>
                    <span>-{Number(preview.bhtn || 0).toLocaleString()}đ</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Thuế TNCN</span>
                    <span>-{Number(preview.thueThuNhap || 0).toLocaleString()}đ</span>
                  </div>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Thực lãnh</span>
                  <span className="text-green-600">{Number(preview.thucLanh || 0).toLocaleString()}đ</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
          >
            Hủy
          </button>
          {!showPreview ? (
            <button
              onClick={handlePreview}
              disabled={!nhanVienId || previewLoading}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {previewLoading ? 'Đang tải...' : '👁️ Xem trước'}
            </button>
          ) : (
            <button
              onClick={handleConfirm}
              disabled={tinhMut.isPending}
              className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {tinhMut.isPending ? 'Đang xử lý...' : '✅ Xác nhận tạo'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
