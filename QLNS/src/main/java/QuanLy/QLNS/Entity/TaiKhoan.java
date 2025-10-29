package QuanLy.QLNS.Entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tai_khoan")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaiKhoan {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long taikhoan_id;
    
    @Column(nullable = false, columnDefinition = "NVARCHAR(255)")
    @NotBlank(message = "Mật khẩu không được để trống")
    @Size(min = 6, message = "Mật khẩu phải có ít nhất 6 ký tự")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String mat_khau;
    
    @Column(nullable = false, columnDefinition = "NVARCHAR(20)")
    @NotBlank(message = "Quyền hạn không được để trống")
    @Pattern(regexp = "ADMIN|MANAGER|EMPLOYEE", message = "Quyền hạn phải là ADMIN, MANAGER hoặc EMPLOYEE")
    private String quyen_han; // ADMIN, MANAGER, EMPLOYEE
    
    @Column(nullable = false, unique = true, columnDefinition = "NVARCHAR(50)")
    @NotBlank(message = "Tên đăng nhập không được để trống")
    @Size(min = 3, max = 50, message = "Tên đăng nhập phải từ 3-50 ký tự")
    private String ten_dangnhap;
    
    @OneToOne(mappedBy = "taiKhoan", fetch = FetchType.EAGER)
    private NhanVien nhanVien;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}