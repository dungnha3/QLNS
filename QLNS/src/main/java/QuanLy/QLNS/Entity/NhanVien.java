package QuanLy.QLNS.Entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "nhan_vien")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NhanVien {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long nhanvien_id;
    
    @Column(nullable = false, columnDefinition = "NVARCHAR(255)")
    @NotBlank(message = "Địa chỉ không được để trống")
    private String dia_chi;
    
    @Column(nullable = false, unique = true, columnDefinition = "NVARCHAR(100)")
    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không đúng định dạng")
    private String email;
    
    @Column(nullable = false, columnDefinition = "NVARCHAR(10)")
    @NotBlank(message = "Giới tính không được để trống")
    @Pattern(regexp = "Nam|Nữ|Khác", message = "Giới tính phải là Nam, Nữ hoặc Khác")
    private String gioi_tinh;
    
    @Column(nullable = false, columnDefinition = "NVARCHAR(100)")
    @NotBlank(message = "Họ tên không được để trống")
    @Size(min = 2, max = 100, message = "Họ tên phải từ 2-100 ký tự")
    private String ho_ten;
    
    @Column(nullable = false)
    @NotNull(message = "Ngày sinh không được để trống")
    @Past(message = "Ngày sinh phải là ngày trong quá khứ")
    private LocalDate ngay_sinh;
    
    @Column(nullable = false)
    @NotNull(message = "Ngày vào làm không được để trống")
    private LocalDate ngay_vao_lam;
    
    @Column(columnDefinition = "NVARCHAR(15)")
    @Pattern(regexp = "^0[0-9]{9}$", message = "Số điện thoại phải là 10 số bắt đầu bằng 0")
    private String so_dien_thoai;
    
    @Column(name = "cccd", unique = true, columnDefinition = "NVARCHAR(20)")
    @Pattern(regexp = "^[0-9]{12}$", message = "CCCD phải là 12 số")
    private String cccd;
    
    @Column(name = "trang_thai", columnDefinition = "NVARCHAR(50)")
    private String trangThai; // DANG_LAM_VIEC, NGHI_VIEC, TAM_NGHI
    
    @OneToOne
    @JoinColumn(name = "taikhoan_id")
    @JsonIgnore
    private TaiKhoan taiKhoan;
    
    @ManyToOne
    @JoinColumn(name = "phongban_id")
    private PhongBan phongBan;
    
    @ManyToOne
    @JoinColumn(name = "chucvu_id")
    private ChucVu chucVu;
    
    @OneToMany(mappedBy = "nhanVien")
    @JsonIgnore
    private List<ChamCong> chamCongs;
    
    @OneToMany(mappedBy = "nhanVien")
    @JsonIgnore
    private List<HopDong> hopDongs;
    
    @OneToMany(mappedBy = "nhanVien")
    @JsonIgnore
    private List<BangLuong> bangLuongs;
    
    @OneToMany(mappedBy = "nhanVien")
    @JsonIgnore
    private List<NghiPhep> nghiPheps;
}

