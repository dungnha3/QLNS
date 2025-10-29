package QuanLy.QLNS.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.Duration;

@Entity
@Table(name = "cham_cong")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChamCong {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long chamcong_id;
    
    @Column(nullable = true)
    private LocalTime gio_ra;
    
    @Column(nullable = false)
    private LocalTime gio_vao;
    
    @Column(nullable = false)
    private LocalDate ngay_lam;
    
    @Column(name = "trang_thai", columnDefinition = "NVARCHAR(50)")
    private String trangThai; // DUNG_GIO, DI_MUON, VE_SOM, NGHI_KHONG_PHEP
    
    @Column(name = "tong_gio_lam")
    private Double tongGioLam;
    
    @Column(name = "loai_ca", columnDefinition = "NVARCHAR(20)")
    private String loaiCa; // SANG, CHIEU, TOI, FULL
    
    @Column(name = "ghi_chu", columnDefinition = "NVARCHAR(MAX)")
    private String ghiChu;
    
    // GPS fields
    @Column(name = "latitude")
    private Double latitude; // Vĩ độ
    
    @Column(name = "longitude")
    private Double longitude; // Kinh độ
    
    @Column(name = "dia_chi_checkin", columnDefinition = "NVARCHAR(500)")
    private String diaChiCheckin; // Địa chỉ check-in
    
    @Column(name = "khoang_cach")
    private Double khoangCach; // Khoảng cách từ công ty (meters)
    
    @Column(name = "phuong_thuc", columnDefinition = "NVARCHAR(20)")
    private String phuongThuc; // GPS, MANUAL, QR_CODE
    
    @ManyToOne
    @JoinColumn(name = "nhanvien_id", nullable = false)
    private NhanVien nhanVien;
    
    @PrePersist
    @PreUpdate
    protected void calculateTotalHours() {
        if (gio_vao != null && gio_ra != null) {
            Duration duration = Duration.between(gio_vao, gio_ra);
            tongGioLam = duration.toMinutes() / 60.0;
            
            // Tự động xác định trạng thái (8h = 480 phút là chuẩn)
            if (trangThai == null) {
                LocalTime gioVaoChuan = LocalTime.of(8, 0);
                if (gio_vao.isAfter(gioVaoChuan.plusMinutes(15))) {
                    trangThai = "DI_MUON";
                } else if (tongGioLam < 8.0) {
                    trangThai = "VE_SOM";
                } else {
                    trangThai = "DUNG_GIO";
                }
            }
        }
    }
}