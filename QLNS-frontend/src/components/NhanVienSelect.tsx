import { useNhanVienList } from '../api/nhanvien'

interface NhanVienSelectProps {
  value: number | null | undefined
  onChange: (nhanVienId: number | null) => void
  label?: string
  required?: boolean
  disabled?: boolean
  className?: string
}

export function NhanVienSelect({ 
  value, 
  onChange, 
  label = "Nhân viên",
  required = false,
  disabled = false,
  className = ""
}: NhanVienSelectProps) {
  const { data: nvData } = useNhanVienList(0, 1000, '')
  const nhanViens = nvData?.content || []

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        value={value || ''}
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
        disabled={disabled}
        required={required}
      >
        <option value="">-- Chọn nhân viên --</option>
        {nhanViens.map(nv => (
          <option key={nv.nhanvien_id} value={nv.nhanvien_id}>
            {nv.ho_ten} - {nv.email}
          </option>
        ))}
      </select>
    </div>
  )
}
