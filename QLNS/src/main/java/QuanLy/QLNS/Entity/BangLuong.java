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
    
    @Column(nullable = false, length = 100)
    private String khau_tru;
    
    @Column(nullable = false, length = 200)
    private String luong_co_ban;
    
    @Column(nullable = false, length = 100)
    private String phu_cap;
    
    @Column(nullable = false)
    private Integer thang_nam;
    
    @Column(nullable = false, length = 100)
    private String thuc_lanh;
    
    @Column(nullable = false, length = 100)
    private String tong_cong;
    
    @Column(name = "thang", nullable = false)
    private Integer thang;
    
    @Column(name = "nam", nullable = false)
    private Integer nam;
    
    @Column(name = "thuong", precision = 15, scale = 2)
    private BigDecimal thuong;
    
    @Column(name = "phat", precision = 15, scale = 2)
    private BigDecimal phat;
    
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
    
    @Column(name = "trang_thai", length = 50)
    private String trangThai; // CHO_DUYET, DA_DUYET, DA_THANH_TOAN
    
    @ManyToOne
    @JoinColumn(name = "nhanvien_id", nullable = false)
    private NhanVien nhanVien;
}
