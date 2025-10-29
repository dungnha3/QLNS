package QuanLy.QLNS.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.Data;

@Data
public class UpdateBangLuongRequest {
    private Long nhanVien;
    private Integer thang;
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
