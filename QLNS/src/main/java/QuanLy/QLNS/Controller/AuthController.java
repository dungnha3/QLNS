package QuanLy.QLNS.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import QuanLy.QLNS.Entity.TaiKhoan;
import QuanLy.QLNS.Service.AuthService;
import QuanLy.QLNS.Service.TaiKhoanService;
import QuanLy.QLNS.dto.ApiResponse;
import QuanLy.QLNS.dto.LoginRequest;
import QuanLy.QLNS.dto.LoginResponse;
import QuanLy.QLNS.util.PasswordValidator;
import QuanLy.QLNS.util.JwtUtil;
import jakarta.validation.Valid;

@RestController
@RequestMapping(value = "/api/auth", produces = "application/json;charset=UTF-8")
@CrossOrigin(origins = "*")
public class AuthController {
    
    private final AuthService authService;
    private final TaiKhoanService taiKhoanService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    
    public AuthController(AuthService authService, TaiKhoanService taiKhoanService,
                         PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.authService = authService;
        this.taiKhoanService = taiKhoanService;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }
    
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            LoginResponse loginResponse = authService.login(loginRequest);
            return ResponseEntity.ok(ApiResponse.success("Đăng nhập thành công", loginResponse));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error(e.getMessage()));
        }
    }
    
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<String>> register(@Valid @RequestBody TaiKhoan taiKhoan) {
        try {
            // Kiểm tra tên đăng nhập đã tồn tại
            if (taiKhoanService.existsByTenDangnhap(taiKhoan.getTen_dangnhap())) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Tên đăng nhập đã tồn tại"));
            }
            
            // Validate mật khẩu mạnh
            String passwordError = PasswordValidator.validatePassword(taiKhoan.getMat_khau());
            if (passwordError != null) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error(passwordError));
            }
            
            // Mã hóa mật khẩu
            taiKhoan.setMat_khau(passwordEncoder.encode(taiKhoan.getMat_khau()));
            
            // Lưu tài khoản
            taiKhoanService.save(taiKhoan);
            
            return ResponseEntity.ok(ApiResponse.success("Đăng ký tài khoản thành công"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Đăng ký thất bại: " + e.getMessage()));
        }
    }
    
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout(@RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7); // Remove "Bearer " prefix
            authService.logout(jwt);
            return ResponseEntity.ok(ApiResponse.success("Đăng xuất thành công"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Đăng xuất thất bại"));
        }
    }
    
    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse<String>> changePassword(
            @RequestHeader("Authorization") String token,
            @RequestBody ChangePasswordRequest request) {
        try {
            String jwt = token.substring(7);
            String tenDangnhap = jwtUtil.getTenDangnhapFromToken(jwt);
            
            // Tìm tài khoản
            TaiKhoan taiKhoan = taiKhoanService.findByTenDangnhap(tenDangnhap)
                    .orElseThrow(() -> new RuntimeException("Tài khoản không tồn tại"));
            
            // Kiểm tra mật khẩu cũ
            if (!passwordEncoder.matches(request.getOldPassword(), taiKhoan.getMat_khau())) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Mật khẩu cũ không đúng"));
            }
            
            // Validate mật khẩu mới
            String passwordError = PasswordValidator.validatePassword(request.getNewPassword());
            if (passwordError != null) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error(passwordError));
            }
            
            // Kiểm tra mật khẩu mới không trùng mật khẩu cũ
            if (passwordEncoder.matches(request.getNewPassword(), taiKhoan.getMat_khau())) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Mật khẩu mới phải khác mật khẩu cũ"));
            }
            
            // Cập nhật mật khẩu
            taiKhoan.setMat_khau(passwordEncoder.encode(request.getNewPassword()));
            taiKhoanService.save(taiKhoan);
            
            return ResponseEntity.ok(ApiResponse.success("Đổi mật khẩu thành công"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Đổi mật khẩu thất bại: " + e.getMessage()));
        }
    }
    
    // Inner class for change password request
    public static class ChangePasswordRequest {
        private String oldPassword;
        private String newPassword;
        
        public String getOldPassword() { return oldPassword; }
        public void setOldPassword(String oldPassword) { this.oldPassword = oldPassword; }
        public String getNewPassword() { return newPassword; }
        public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
    }
}
