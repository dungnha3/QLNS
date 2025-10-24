package QuanLy.QLNS.Service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import QuanLy.QLNS.Entity.TaiKhoan;
import QuanLy.QLNS.Service.AuthService;
import QuanLy.QLNS.Service.TaiKhoanService;
import QuanLy.QLNS.dto.LoginRequest;
import QuanLy.QLNS.dto.LoginResponse;
import QuanLy.QLNS.exception.UnauthorizedException;
import QuanLy.QLNS.util.JwtUtil;

@Service
public class AuthServiceImpl implements AuthService {
    
    private static final Logger log = LoggerFactory.getLogger(AuthServiceImpl.class);
    
    private final TaiKhoanService taiKhoanService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    
    public AuthServiceImpl(TaiKhoanService taiKhoanService, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.taiKhoanService = taiKhoanService;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }
    
    @Override
    public LoginResponse login(LoginRequest loginRequest) {
        log.info("Đăng nhập: {}", loginRequest.getTenDangnhap());
        
        // Tìm tài khoản theo tên đăng nhập
        TaiKhoan taiKhoan = taiKhoanService.findByTenDangnhap(loginRequest.getTenDangnhap())
                .orElseThrow(() -> {
                    log.warn("Đăng nhập thất bại: Tài khoản không tồn tại - {}", loginRequest.getTenDangnhap());
                    return new UnauthorizedException("Tên đăng nhập hoặc mật khẩu không đúng");
                });
        
        // Kiểm tra mật khẩu
        if (!passwordEncoder.matches(loginRequest.getMatKhau(), taiKhoan.getMat_khau())) {
            log.warn("Đăng nhập thất bại: Sai mật khẩu - {}", loginRequest.getTenDangnhap());
            throw new UnauthorizedException("Tên đăng nhập hoặc mật khẩu không đúng");
        }
        
        // Tạo JWT token
        String token = jwtUtil.generateToken(taiKhoan.getTen_dangnhap(), taiKhoan.getQuyen_han());
        
        // Lấy ID nhân viên nếu có
        Long nhanVienId = taiKhoan.getNhanVien() != null ? taiKhoan.getNhanVien().getNhanvien_id() : null;
        
        log.info("Đăng nhập thành công: {} [{}]", taiKhoan.getTen_dangnhap(), taiKhoan.getQuyen_han());
        return new LoginResponse(token, taiKhoan.getTen_dangnhap(), taiKhoan.getQuyen_han(), nhanVienId);
    }
    
    @Override
    public void logout(String token) {
        log.info("Đăng xuất");
        // Implement token blacklist if needed
        // For now, just let the token expire naturally
    }
    
    @Override
    public boolean validateToken(String token) {
        boolean isValid = jwtUtil.validateToken(token);
        if (!isValid) {
            log.warn("Token không hợp lệ");
        }
        return isValid;
    }
}

