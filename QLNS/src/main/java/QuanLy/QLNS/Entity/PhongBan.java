package QuanLy.QLNS.Entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Entity
@Table(name = "phong_ban")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PhongBan {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long phongban_id;
    
    @Column(nullable = false, length = 100)
    private String dia_diem;
    
    @Column(nullable = false, length = 200)
    private String ten_phongban;
    
    @Column(columnDefinition = "TEXT")
    private String mo_ta;
    
    @Column(name = "so_luong_nhanvien")
    private Integer soLuongNhanVien;
    
    @OneToMany(mappedBy = "phongBan")
    private List<NhanVien> nhanViens;
}




