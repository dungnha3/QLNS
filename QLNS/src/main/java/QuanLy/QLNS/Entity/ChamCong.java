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
@Table(name = "ChamCong")
public class ChamCong {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer chamcongId;

    @ManyToOne
    @JoinColumn(name = "nhanvien_id")
    private NhanVien nhanVien;

    private Date ngayLam;
    private String gioVao;
    private String gioRa;
    private String trangThai; // cho_xac_nhan / da_xac_nhan / tu_choi

    @ManyToOne
    @JoinColumn(name = "nguoi_xacnhan")
    private NhanVien nguoiXacnhan;

    // Getter Setter
    public Integer getChamcongId() { return chamcongId; }
    public void setChamcongId(Integer chamcongId) { this.chamcongId = chamcongId; }

    public NhanVien getNhanVien() { return nhanVien; }
    public void setNhanVien(NhanVien nhanVien) { this.nhanVien = nhanVien; }

    public Date getNgayLam() { return ngayLam; }
    public void setNgayLam(Date ngayLam) { this.ngayLam = ngayLam; }

    public String getGioVao() { return gioVao; }
    public void setGioVao(String gioVao) { this.gioVao = gioVao; }

    public String getGioRa() { return gioRa; }
    public void setGioRa(String gioRa) { this.gioRa = gioRa; }

    public String getTrangThai() { return trangThai; }
    public void setTrangThai(String trangThai) { this.trangThai = trangThai; }

    public NhanVien getNguoiXacnhan() { return nguoiXacnhan; }
    public void setNguoiXacnhan(NhanVien nguoiXacnhan) { this.nguoiXacnhan = nguoiXacnhan; }
}
