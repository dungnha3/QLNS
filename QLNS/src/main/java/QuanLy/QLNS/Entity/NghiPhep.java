package QuanLy.QLNS.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "nghi_phep")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NghiPhep {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long nghiphep_id;
    
    @ManyToOne
    @JoinColumn(name = "nhanvien_id", nullable = false)
    private NhanVien nhanVien;
    
    @Column(name = "loai_nghi", nullable = false, length = 50)
    private String loaiNghi; // PHEP_NAM, OM, KHONG_LUONG, KET_HON, TANG, CON_OM
    
    @Column(name = "ngay_bat_dau", nullable = false)
    private LocalDate ngayBatDau;
    
    @Column(name = "ngay_ket_thuc", nullable = false)
    private LocalDate ngayKetThuc;
    
    @Column(name = "so_ngay_nghi", nullable = false)
    private Integer soNgayNghi;
    
    @Column(name = "ly_do", columnDefinition = "TEXT")
    private String lyDo;
    
    @Column(name = "trang_thai", nullable = false, length = 50)
    private String trangThai; // CHO_DUYET, DA_DUYET, TU_CHOI
    
    @ManyToOne
    @JoinColumn(name = "nguoi_duyet_id")
    private NhanVien nguoiDuyet;
    
    @Column(name = "ngay_duyet")
    private LocalDateTime ngayDuyet;
    
    @Column(name = "ghi_chu_duyet", columnDefinition = "TEXT")
    private String ghiChuDuyet;
    
    @Column(name = "ngay_tao")
    private LocalDateTime ngayTao;
    
    @PrePersist
    protected void onCreate() {
        ngayTao = LocalDateTime.now();
        trangThai = "CHO_DUYET";
    }
}
