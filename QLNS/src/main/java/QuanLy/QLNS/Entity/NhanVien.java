package QuanLy.QLNS.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "nhan_vien")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NhanVien {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long nhanvien_id;
    
    @Column(nullable = false, length = 100)
    private String dia_chi;
    
    @Column(nullable = false, unique = true, length = 100)
    private String email;
    
    @Column(nullable = false, length = 10)
    private String gioi_tinh; // Nam, Nữ, Khác
    
    @Column(nullable = false, length = 100)
    private String ho_ten;
    
    @Column(nullable = false)
    private LocalDate ngay_sinh;
    
    @Column(nullable = false)
    private LocalDate ngay_vao_lam;
    
    @Column(length = 20)
    private String so_dien_thoai;
    
    @Column(name = "cccd", unique = true, length = 20)
    private String cccd;
    
    @Column(name = "trang_thai", length = 50)
    private String trangThai; // DANG_LAM_VIEC, NGHI_VIEC, TAM_NGHI
    
    @OneToOne
    @JoinColumn(name = "taikhoan_id")
    private TaiKhoan taiKhoan;
    
    @ManyToOne
    @JoinColumn(name = "phongban_id")
    private PhongBan phongBan;
    
    @ManyToOne
    @JoinColumn(name = "chucvu_id")
    private ChucVu chucVu;
    
    @OneToMany(mappedBy = "nhanVien")
    private List<ChamCong> chamCongs;
    
    @OneToMany(mappedBy = "nhanVien")
    private List<HopDong> hopDongs;
    
    @OneToMany(mappedBy = "nhanVien")
    private List<BangLuong> bangLuongs;
    
    @OneToMany(mappedBy = "nhanVien")
    private List<NghiPhep> nghiPheps;
    
    @OneToMany(mappedBy = "nhanVien")
    private List<DanhGia> danhGias;
}

