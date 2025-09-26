package QuanLy.QLNS.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "TaiKhoan")
public class TaiKhoan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer taikhoanId;

    @OneToOne
    @JoinColumn(name = "nhanvien_id", unique = true)
    private NhanVien nhanVien;

    private String tenDangnhap;
    private String matKhau;
    private String quyenHan; // admin, nhanvien, quanly

    // Getter Setter
    public Integer getTaikhoanId() { return taikhoanId; }
    public void setTaikhoanId(Integer taikhoanId) { this.taikhoanId = taikhoanId; }

    public NhanVien getNhanVien() { return nhanVien; }
    public void setNhanVien(NhanVien nhanVien) { this.nhanVien = nhanVien; }

    public String getTenDangnhap() { return tenDangnhap; }
    public void setTenDangnhap(String tenDangnhap) { this.tenDangnhap = tenDangnhap; }

    public String getMatKhau() { return matKhau; }
    public void setMatKhau(String matKhau) { this.matKhau = matKhau; }

    public String getQuyenHan() { return quyenHan; }
    public void setQuyenHan(String quyenHan) { this.quyenHan = quyenHan; }
}
