package QuanLy.QLNS.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class UpdateNhanVienRequest {
    private String ho_ten;
    private String email;
    private String gioi_tinh;
    private String dia_chi;
    private LocalDate ngay_sinh;
    private LocalDate ngay_vao_lam;
    private String so_dien_thoai;
    private String cccd;
    private String trangThai;
    
    // IDs for relationships
    private Long phongBan;  // ID của phòng ban
    private Long chucVu;    // ID của chức vụ
    private Long taiKhoan;  // ID của tài khoản
}
