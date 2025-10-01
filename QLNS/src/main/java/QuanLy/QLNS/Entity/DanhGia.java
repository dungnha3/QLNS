package QuanLy.QLNS.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "danh_gia")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DanhGia {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long danhgia_id;
    
    @ManyToOne
    @JoinColumn(name = "nhanvien_id", nullable = false)
    private NhanVien nhanVien;
    
    @ManyToOne
    @JoinColumn(name = "nguoi_danh_gia_id", nullable = false)
    private NhanVien nguoiDanhGia;
    
    @Column(name = "ky_danh_gia", nullable = false)
    private LocalDate kyDanhGia; // Kỳ đánh giá (tháng/quý/năm)
    
    @Column(name = "loai_danh_gia", length = 50)
    private String loaiDanhGia; // THANG, QUY, NAM, THU_VIEC
    
    @Column(name = "diem_chuyen_mon", nullable = false)
    private Integer diemChuyenMon; // 1-10
    
    @Column(name = "diem_thai_do", nullable = false)
    private Integer diemThaiDo; // 1-10
    
    @Column(name = "diem_ky_nang", nullable = false)
    private Integer diemKyNang; // 1-10
    
    @Column(name = "diem_trung_binh")
    private Double diemTrungBinh;
    
    @Column(name = "xep_loai", length = 50)
    private String xepLoai; // XUAT_SAC, TOT, KHA, TRUNG_BINH, YEU
    
    @Column(name = "nhan_xet", columnDefinition = "TEXT")
    private String nhanXet;
    
    @Column(name = "muc_tieu_ke_tiep", columnDefinition = "TEXT")
    private String mucTieuKeTiep;
    
    @Column(name = "ngay_danh_gia")
    private LocalDateTime ngayDanhGia;
    
    @PrePersist
    protected void onCreate() {
        ngayDanhGia = LocalDateTime.now();
        // Tính điểm trung bình
        diemTrungBinh = (diemChuyenMon + diemThaiDo + diemKyNang) / 3.0;
        // Xếp loại tự động
        if (diemTrungBinh >= 9) xepLoai = "XUAT_SAC";
        else if (diemTrungBinh >= 8) xepLoai = "TOT";
        else if (diemTrungBinh >= 6.5) xepLoai = "KHA";
        else if (diemTrungBinh >= 5) xepLoai = "TRUNG_BINH";
        else xepLoai = "YEU";
    }
}