package QuanLy.QLNS.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "PhongBan")
public class PhongBan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer phongbanId;

    private String tenPhongban;
    private String diaDiem;

    // Getter Setter
    public Integer getPhongbanId() { return phongbanId; }
    public void setPhongbanId(Integer phongbanId) { this.phongbanId = phongbanId; }

    public String getTenPhongban() { return tenPhongban; }
    public void setTenPhongban(String tenPhongban) { this.tenPhongban = tenPhongban; }

    public String getDiaDiem() { return diaDiem; }
    public void setDiaDiem(String diaDiem) { this.diaDiem = diaDiem; }
}
