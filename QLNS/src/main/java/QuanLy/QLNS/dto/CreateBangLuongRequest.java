package QuanLy.QLNS.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateBangLuongRequest {
    @NotNull(message = "Nhân viên không được để trống")
    private Long nhanVien; // ID của nhân viên
    
    @NotNull(message = "Tháng không được để trống")
    private Integer thang;
    
    @NotNull(message = "Năm không được để trống")
    private Integer nam;
    
    private BigDecimal luong_co_ban;
    private BigDecimal phu_cap;
    private BigDecimal khau_tru;
    private BigDecimal bhxh;
    private BigDecimal bhyt;
    private BigDecimal bhtn;
    private BigDecimal thueThuNhap;
    private BigDecimal tong_cong;
    private BigDecimal thuc_lanh;
    private LocalDate ngayThanhToan;
    private String trangThai;
}
