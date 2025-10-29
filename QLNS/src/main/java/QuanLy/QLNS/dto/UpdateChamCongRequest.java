package QuanLy.QLNS.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import lombok.Data;

@Data
public class UpdateChamCongRequest {
    private LocalTime gio_ra;
    private LocalTime gio_vao;
    private LocalDate ngay_lam;
    private String trangThai;
    private Double tongGioLam;
    private String loaiCa;
    private String ghiChu;
    private Double latitude;
    private Double longitude;
    private String diaChiCheckin;
    private Double khoangCach;
    private String phuongThuc;
    private Long nhanVien; // ID của nhân viên (optional khi update)
}
