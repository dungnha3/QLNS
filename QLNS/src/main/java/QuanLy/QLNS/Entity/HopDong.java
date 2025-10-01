package QuanLy.QLNS.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "hop_dong")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HopDong {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long hopdong_id;
    
    @Column(nullable = false, length = 100)
    private String loai_hopdong; // THU_VIEC, CHINH_THUC, HOP_TAC_VIEN
    
    @Column(nullable = false, length = 200)
    private String muc_luong;
    
    @Column(nullable = false)
    private LocalDate ngay_batdau;
    
    @Column
    private LocalDate ngay_ketthuc;
    
    @Column(nullable = false)
    private LocalDate ngay_ky;
    
    @Column(name = "luong_co_ban", precision = 15, scale = 2)
    private BigDecimal luongCoBan;
    
    @Column(name = "trang_thai", length = 50)
    private String trangThai; // CON_HIEU_LUC, HET_HAN, HUY
    
    @Column(name = "ghi_chu", columnDefinition = "TEXT")
    private String ghiChu;
    
    @ManyToOne
    @JoinColumn(name = "nhanvien_id", nullable = false)
    private NhanVien nhanVien;
}
