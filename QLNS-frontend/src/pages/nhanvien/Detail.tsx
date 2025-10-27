import { useParams, Link } from 'react-router-dom'
import { useNhanVienDetail } from '../../api/nhanvien'
import { useState } from 'react'

const tabs = ['Thông tin','HĐ','Chấm công','Lương','Nghỉ phép','Đánh giá'] as const

type TabKey = typeof tabs[number]

export default function NhanVienDetail() {
  const { id } = useParams()
  const nvId = Number(id)
  const { data, isLoading, error } = useNhanVienDetail(nvId)
  const [tab, setTab] = useState<TabKey>('Thông tin')

  if (isLoading) return <div>Đang tải...</div>
  if (error || !data) return <div className="text-red-600">Không tải được dữ liệu</div>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Nhân viên #{data.nhanvien_id} - {data.ho_ten}</h1>
        <Link to="/nhanvien" className="text-sm text-blue-600">Quay lại danh sách</Link>
      </div>
      <div className="border-b">
        <div className="flex gap-2">
          {tabs.map((t) => (
            <button key={t} onClick={()=>setTab(t)} className={`px-3 py-2 ${tab===t? 'border-b-2 border-black font-medium':''}`}>{t}</button>
          ))}
        </div>
      </div>

      {tab === 'Thông tin' && (
        <div className="grid grid-cols-2 gap-3 bg-white p-4 rounded shadow">
          <Field label="Họ tên" value={data.ho_ten} />
          <Field label="Email" value={data.email} />
          <Field label="Giới tính" value={data.gioi_tinh} />
          <Field label="SĐT" value={data.so_dien_thoai || '-'} />
          <Field label="CCCD" value={data.cccd || '-'} />
          <Field label="Ngày sinh" value={data.ngay_sinh} />
          <Field label="Ngày vào làm" value={data.ngay_vao_lam} />
          <Field label="Trạng thái" value={data.trangThai || '-'} />
          <div className="col-span-2"><Field label="Địa chỉ" value={data.dia_chi} /></div>
        </div>
      )}

      {tab !== 'Thông tin' && (
        <div className="bg-white p-8 rounded shadow text-gray-500">Nội dung tab "{tab}" sẽ được triển khai ở bước sau.</div>
      )}
    </div>
  )
}

function Field({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <div className="text-xs text-gray-500">{label}</div>
      <div className="font-medium">{String(value)}</div>
    </div>
  )
}
