package QuanLy.QLNS.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "BangLuong")
public class BangLuong {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer bangluongId;

    @ManyToOne
    @JoinColumn(name = "nhanvien_id")
    private NhanVien nhanVien;

    private String thangNam; // ví dụ "2025-09"
    private Integer tongCong;
    private Double luongCoBan;
    private Double phuCap;
    private Double khauTru;
    private Double thucLanh;

    // Getter Setter
    public Integer getBangluongId() { return bangluongId; }
    public void setBangluongId(Integer bangluongId) { this.bangluongId = bangluongId; }

    public NhanVien getNhanVien() { return nhanVien; }
    public void setNhanVien(NhanVien nhanVien) { this.nhanVien = nhanVien; }

    public String getThangNam() { return thangNam; }
    public void setThangNam(String thangNam) { this.thangNam = thangNam; }

    public Integer getTongCong() { return tongCong; }
    public void setTongCong(Integer tongCong) { this.tongCong = tongCong; }

    public Double getLuongCoBan() { return luongCoBan; }
    public void setLuongCoBan(Double luongCoBan) { this.luongCoBan = luongCoBan; }

    public Double getPhuCap() { return phuCap; }
    public void setPhuCap(Double phuCap) { this.phuCap = phuCap; }

    public Double getKhauTru() { return khauTru; }
    public void setKhauTru(Double khauTru) { this.khauTru = khauTru; }

    public Double getThucLanh() { return thucLanh; }
    public void setThucLanh(Double thucLanh) { this.thucLanh = thucLanh; }
}
