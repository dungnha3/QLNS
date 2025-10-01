package QuanLy.QLNS.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "cham_cong")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChamCong {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long chamcong_id;
    
    @Column(nullable = false)
    private LocalTime gio_ra;
    
    @Column(nullable = false)
    private LocalTime gio_vao;
    
    @Column(nullable = false)
    private LocalDate ngay_lam;
    
    @Column(nullable = false)
    private Integer ngay_tam;
    
    @Column(nullable = false)
    private LocalDate trang_thai;
    
    @Column(name = "tong_gio_lam")
    private Double tongGioLam;
    
    @Column(name = "loai_ca", length = 50)
    private String loaiCa; // SANG, CHIEU, TOI, FULL
    
    @Column(name = "ghi_chu", columnDefinition = "TEXT")
    private String ghiChu;
    
    @ManyToOne
    @JoinColumn(name = "nhanvien_id", nullable = false)
    private NhanVien nhanVien;
}