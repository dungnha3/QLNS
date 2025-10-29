package QuanLy.QLNS.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateAccountWithEmployeeRequest {
    // Thông tin tài khoản
    @NotBlank(message = "Tên đăng nhập không được để trống")
    @Size(min = 3, max = 50, message = "Tên đăng nhập phải từ 3-50 ký tự")
    private String ten_dangnhap;
    
    @NotBlank(message = "Mật khẩu không được để trống")
    @Size(min = 6, message = "Mật khẩu phải có ít nhất 6 ký tự")
    private String mat_khau;
    
    @NotBlank(message = "Quyền hạn không được để trống")
    @Pattern(regexp = "ADMIN|MANAGER|EMPLOYEE", message = "Quyền hạn phải là ADMIN, MANAGER hoặc EMPLOYEE")
    private String quyen_han;
    
    // Thông tin nhân viên
    @NotBlank(message = "Họ tên không được để trống")
    private String ho_ten;
    
    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    private String email;
    
    private String gioi_tinh;
    
    @NotBlank(message = "Địa chỉ không được để trống")
    private String dia_chi;
    
    private LocalDate ngay_sinh;
    private LocalDate ngay_vao_lam;
    private String so_dien_thoai;
    private String cccd;
}
