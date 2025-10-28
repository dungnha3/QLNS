package QuanLy.QLNS.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "bang_luong")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BangLuong {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bangluong_id;
    
    @Column(name = "khau_tru", precision = 15, scale = 2)
    private BigDecimal khau_tru;
    
    @Column(name = "luong_co_ban", precision = 15, scale = 2)
    private BigDecimal luong_co_ban;
    
    @Column(name = "phu_cap", precision = 15, scale = 2)
    private BigDecimal phu_cap;
    
    // removed redundant thang_nam
    
    @Column(name = "thuc_lanh", precision = 15, scale = 2)
    private BigDecimal thuc_lanh;
    
    @Column(name = "tong_cong", precision = 15, scale = 2)
    private BigDecimal tong_cong;
    
    @Column(name = "thang", nullable = false)
    private Integer thang;
    
    @Column(name = "nam", nullable = false)
    private Integer nam;
    
    @Column(name = "bhxh", precision = 15, scale = 2)
    private BigDecimal bhxh;
    
    @Column(name = "bhyt", precision = 15, scale = 2)
    private BigDecimal bhyt;
    
    @Column(name = "bhtn", precision = 15, scale = 2)
    private BigDecimal bhtn;
    
    @Column(name = "thue_thu_nhap", precision = 15, scale = 2)
    private BigDecimal thueThuNhap;
    
    @Column(name = "ngay_thanh_toan")
    private LocalDate ngayThanhToan;
    
    @Column(name = "trang_thai", columnDefinition = "NVARCHAR(50)")
    private String trangThai; // CHO_DUYET, DA_DUYET, DA_THANH_TOAN
    
    @ManyToOne
    @JoinColumn(name = "nhanvien_id", nullable = false)
    private NhanVien nhanVien;
}
