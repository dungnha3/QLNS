package QuanLy.QLNS.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class UpdateNghiPhepRequest {
    private Long nhanVien;
    private String loaiNghi;
    private LocalDate ngayBatDau;
    private LocalDate ngayKetThuc;
    private Integer soNgayNghi;
    private String lyDo;
    private String trangThai;
    private Long nguoiDuyet; // ID của người duyệt
    private String ghiChuDuyet;
}
