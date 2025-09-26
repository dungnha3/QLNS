package QuanLy.QLNS.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "ChucVu")
public class ChucVu {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer chucvuId;

    private String tenChucvu;
    private String moTa;
    private Double luongCoBan;

    // Getter Setter
    public Integer getChucvuId() { return chucvuId; }
    public void setChucvuId(Integer chucvuId) { this.chucvuId = chucvuId; }

    public String getTenChucvu() { return tenChucvu; }
    public void setTenChucvu(String tenChucvu) { this.tenChucvu = tenChucvu; }

    public String getMoTa() { return moTa; }
    public void setMoTa(String moTa) { this.moTa = moTa; }

    public Double getLuongCoBan() { return luongCoBan; }
    public void setLuongCoBan(Double luongCoBan) { this.luongCoBan = luongCoBan; }
}
