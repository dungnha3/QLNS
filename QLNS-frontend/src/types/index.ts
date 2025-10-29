// ============================================
// SHARED TYPES - Đảm bảo khớp với Backend
// ============================================

// Pagination type
export type Page<T> = {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

// ============================================
// CORE ENTITIES
// ============================================

export type TaiKhoan = {
  taikhoan_id: number
  ten_dangnhap: string
  mat_khau?: string
  quyen_han: 'ADMIN' | 'MANAGER' | 'EMPLOYEE' | string
  nhanVien?: NhanVien
  createdAt?: string
  updatedAt?: string
}

export type PhongBan = {
  phongban_id: number
  ten_phongban: string
  dia_diem: string
  mo_ta?: string
  soLuongNhanVien?: number
}

export type ChucVu = {
  chucvu_id: number
  ten_chucvu: string
  luong_co_ban: string
  mo_ta: string
  mucLuongToiThieu?: number
  mucLuongToiDa?: number
}

export type NhanVien = {
  nhanvien_id: number
  email: string
  ho_ten: string
  gioi_tinh: 'Nam' | 'Nữ' | 'Khác'
  dia_chi: string
  ngay_sinh: string
  ngay_vao_lam: string
  so_dien_thoai?: string
  cccd?: string
  trangThai?: string
  // Nested objects từ backend
  phongBan?: PhongBan
  chucVu?: ChucVu
}

// ============================================
// TRANSACTION ENTITIES
// ============================================

export type ChamCong = {
  chamcong_id: number
  gio_ra: string
  gio_vao: string
  ngay_lam: string
  trangThai?: string
  tongGioLam?: number
  loaiCa?: string
  ghiChu?: string
  // GPS fields
  latitude?: number
  longitude?: number
  diaChiCheckin?: string
  khoangCach?: number
  phuongThuc?: string
  // Nested object từ backend
  nhanVien: NhanVien
}

export type NghiPhep = {
  nghiphep_id: number
  ngayBatDau: string
  ngayKetThuc: string
  soNgayNghi: number
  lyDo?: string
  loaiNghi: 'PHEP_NAM' | 'OM' | 'KHONG_LUONG' | 'KET_HON' | 'TANG' | 'CON_OM' | string
  trangThai: 'CHO_DUYET' | 'DA_DUYET' | 'TU_CHOI' | string
  ghiChuDuyet?: string
  ngayDuyet?: string
  ngayTao?: string
  // Nested objects từ backend
  nhanVien: NhanVien
  nguoiDuyet?: NhanVien
}

export type HopDong = {
  hopdong_id: number
  loai_hopdong: 'THU_VIEC' | 'CHINH_THUC' | 'HOP_TAC_VIEN' | string
  ngay_batdau: string
  ngay_ketthuc?: string | null
  ngay_ky: string
  luongCoBan?: number
  trangThai?: 'CON_HIEU_LUC' | 'HET_HAN' | 'HUY' | string
  ghiChu?: string
  // Nested object từ backend
  nhanVien: NhanVien
}

export type BangLuong = {
  bangluong_id: number
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
  ngayThanhToan?: string
  trangThai?: 'CHO_DUYET' | 'DA_DUYET' | 'DA_THANH_TOAN' | string
  // Nested object từ backend
  nhanVien: NhanVien
}

// ============================================
// REQUEST/FORM TYPES (for creating/updating)
// ============================================

export type ChamCongRequest = {
  nhanVien: number | { nhanvien_id: number }
  gio_vao: string
  gio_ra: string
  ngay_lam: string
  trangThai?: string
  loaiCa?: string
  ghiChu?: string
}

export type NghiPhepRequest = {
  nhanVien: number | { nhanvien_id: number }
  ngayBatDau: string
  ngayKetThuc: string
  soNgayNghi: number
  lyDo?: string
  loaiNghi: string
}

export type HopDongRequest = {
  nhanVien: number | { nhanvien_id: number }
  loai_hopdong: string
  ngay_batdau: string
  ngay_ketthuc?: string | null
  ngay_ky: string
  luongCoBan?: number
  trangThai?: string
  ghiChu?: string
}

export type BangLuongRequest = {
  nhanVien: number | { nhanvien_id: number }
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
  trangThai?: string
}

// ============================================
// SPECIAL REQUEST TYPES
// ============================================

export type CreateAccountWithEmployeeRequest = {
  // Account info
  ten_dangnhap: string
  mat_khau: string
  quyen_han: string
  // Employee info
  email: string
  ho_ten: string
  gioi_tinh: string
  dia_chi: string
  ngay_sinh: string
  ngay_vao_lam: string
  so_dien_thoai?: string
  cccd?: string
}

export type ApprovalRequest = {
  nguoiDuyetId: number
  trangThai: 'DA_DUYET' | 'TU_CHOI'
  ghiChu?: string
}

export type ChamCongGPSRequest = {
  nhanVienId: number
  latitude: number
  longitude: number
  diaChiCheckin?: string
  loaiCa?: string
}
