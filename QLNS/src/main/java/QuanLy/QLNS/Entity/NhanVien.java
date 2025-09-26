package QuanLy.QLNS.Entity;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "NhanVien")
public class NhanVien {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer nhanvienId;

    private String hoTen;
    private Date ngaySinh;
    private String gioiTinh;
    private String soDienThoai;
    private String email;
    private String diaChi;
    private Date ngayVaoLam;

    @ManyToOne
    @JoinColumn(name = "phongban_id")
    private PhongBan phongBan;

    @ManyToOne
    @JoinColumn(name = "chucvu_id")
    private ChucVu chucVu;

    // Getter Setter
    public Integer getNhanvienId() { return nhanvienId; }
    public void setNhanvienId(Integer nhanvienId) { this.nhanvienId = nhanvienId; }

    public String getHoTen() { return hoTen; }
    public void setHoTen(String hoTen) { this.hoTen = hoTen; }

    public Date getNgaySinh() { return ngaySinh; }
    public void setNgaySinh(Date ngaySinh) { this.ngaySinh = ngaySinh; }

    public String getGioiTinh() { return gioiTinh; }
    public void setGioiTinh(String gioiTinh) { this.gioiTinh = gioiTinh; }

    public String getSoDienThoai() { return soDienThoai; }
    public void setSoDienThoai(String soDienThoai) { this.soDienThoai = soDienThoai; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getDiaChi() { return diaChi; }
    public void setDiaChi(String diaChi) { this.diaChi = diaChi; }

    public Date getNgayVaoLam() { return ngayVaoLam; }
    public void setNgayVaoLam(Date ngayVaoLam) { this.ngayVaoLam = ngayVaoLam; }

    public PhongBan getPhongBan() { return phongBan; }
    public void setPhongBan(PhongBan phongBan) { this.phongBan = phongBan; }

    public ChucVu getChucVu() { return chucVu; }
    public void setChucVu(ChucVu chucVu) { this.chucVu = chucVu; }
}
