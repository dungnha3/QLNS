package QuanLy.QLNS.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "chuc_vu")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChucVu {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long chucvu_id;
    
    @Column(nullable = false, length = 100)
    private String luong_co_ban;
    
    @Column(nullable = false, length = 200)
    private String mo_ta;
    
    @Column(nullable = false, length = 100)
    private String ten_chucvu;
    
    @Column(name = "muc_luong_toi_thieu", precision = 15, scale = 2)
    private BigDecimal mucLuongToiThieu;
    
    @Column(name = "muc_luong_toi_da", precision = 15, scale = 2)
    private BigDecimal mucLuongToiDa;
    
    @OneToMany(mappedBy = "chucVu")
    @JsonIgnore
    private List<NhanVien> nhanViens;
}
