package QuanLy.QLNS.Service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import QuanLy.QLNS.Entity.TaiKhoan;
import QuanLy.QLNS.Service.AuthService;
import QuanLy.QLNS.Service.TaiKhoanService;
import QuanLy.QLNS.dto.LoginRequest;
import QuanLy.QLNS.dto.LoginResponse;
import QuanLy.QLNS.util.JwtUtil;

@Service
public class AuthServiceImpl implements AuthService {
    
    @Autowired
    private TaiKhoanService taiKhoanService;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @Override
    public LoginResponse login(LoginRequest loginRequest) {
        // Tìm tài khoản theo tên đăng nhập
        TaiKhoan taiKhoan = taiKhoanService.findByTenDangnhap(loginRequest.getTenDangnhap())
                .orElseThrow(() -> new RuntimeException("Tên đăng nhập hoặc mật khẩu không đúng"));
        
        // Kiểm tra mật khẩu
        if (!passwordEncoder.matches(loginRequest.getMatKhau(), taiKhoan.getMat_khau())) {
            throw new RuntimeException("Tên đăng nhập hoặc mật khẩu không đúng");
        }
        
        // Tạo JWT token
        String token = jwtUtil.generateToken(taiKhoan.getTen_dangnhap(), taiKhoan.getQuyen_han());
        
        // Lấy ID nhân viên nếu có
        Long nhanVienId = taiKhoan.getNhanVien() != null ? taiKhoan.getNhanVien().getNhanvien_id() : null;
        
        return new LoginResponse(token, taiKhoan.getTen_dangnhap(), taiKhoan.getQuyen_han(), nhanVienId);
    }
    
    @Override
    public void logout(String token) {
        // Implement token blacklist if needed
        // For now, just let the token expire naturally
    }
    
    @Override
    public boolean validateToken(String token) {
        return jwtUtil.validateToken(token);
    }
}

