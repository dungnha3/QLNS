package QuanLy.QLNS.Service;

import QuanLy.QLNS.dto.LoginRequest;
import QuanLy.QLNS.dto.LoginResponse;

public interface AuthService {
    LoginResponse login(LoginRequest loginRequest);
    void logout(String token);
    boolean validateToken(String token);
}

