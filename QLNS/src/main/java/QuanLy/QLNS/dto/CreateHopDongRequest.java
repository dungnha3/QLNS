package QuanLy.QLNS.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateHopDongRequest {
    @NotBlank(message = "Loại hợp đồng không được để trống")
    private String loai_hopdong;
    
    @NotNull(message = "Ngày bắt đầu không được để trống")
    private LocalDate ngay_batdau;
    
    private LocalDate ngay_ketthuc; // Có thể null (vô thời hạn)
    
    @NotNull(message = "Ngày ký không được để trống")
    private LocalDate ngay_ky;
    
    private BigDecimal luongCoBan;
    
    private String trangThai;
    
    private String ghiChu;
    
    @NotNull(message = "Nhân viên không được để trống")
    private Long nhanVien; // ID của nhân viên
}
