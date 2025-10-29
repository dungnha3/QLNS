package QuanLy.QLNS.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateChamCongRequest {
    private LocalTime gio_ra;
    
    @NotNull(message = "Giờ vào không được để trống")
    private LocalTime gio_vao;
    
    @NotNull(message = "Ngày làm không được để trống")
    private LocalDate ngay_lam;
    
    private String trangThai;
    private Double tongGioLam;
    private String loaiCa;
    private String ghiChu;
    
    // GPS fields
    private Double latitude;
    private Double longitude;
    private String diaChiCheckin;
    private Double khoangCach;
    private String phuongThuc;
    
    @NotNull(message = "Nhân viên không được để trống")
    private Long nhanVien; // ID của nhân viên
}
