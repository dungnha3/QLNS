package QuanLy.QLNS.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.Data;

@Data
public class UpdateHopDongRequest {
    private String loai_hopdong;
    private LocalDate ngay_batdau;
    private LocalDate ngay_ketthuc; // Có thể null (vô thời hạn)
    private LocalDate ngay_ky;
    private BigDecimal luongCoBan;
    private String trangThai;
    private String ghiChu;
    private Long nhanVien; // ID của nhân viên (optional khi update)
}
