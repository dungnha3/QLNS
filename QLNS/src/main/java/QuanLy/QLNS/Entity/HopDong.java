package QuanLy.QLNS.Entity;

import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "HopDong")
public class HopDong {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer hopdongId;

    @ManyToOne
    @JoinColumn(name = "nhanvien_id")
    private NhanVien nhanVien;

    private String loaiHopdong;
    private Date ngayBatdau;
    private Date ngayKetthuc;
    private Double mucLuong;

    // Getter Setter
    public Integer getHopdongId() { return hopdongId; }
    public void setHopdongId(Integer hopdongId) { this.hopdongId = hopdongId; }

    public NhanVien getNhanVien() { return nhanVien; }
    public void setNhanVien(NhanVien nhanVien) { this.nhanVien = nhanVien; }

    public String getLoaiHopdong() { return loaiHopdong; }
    public void setLoaiHopdong(String loaiHopdong) { this.loaiHopdong = loaiHopdong; }

    public Date getNgayBatdau() { return ngayBatdau; }
    public void setNgayBatdau(Date ngayBatdau) { this.ngayBatdau = ngayBatdau; }

    public Date getNgayKetthuc() { return ngayKetthuc; }
    public void setNgayKetthuc(Date ngayKetthuc) { this.ngayKetthuc = ngayKetthuc; }

    public Double getMucLuong() { return mucLuong; }
    public void setMucLuong(Double mucLuong) { this.mucLuong = mucLuong; }
}
