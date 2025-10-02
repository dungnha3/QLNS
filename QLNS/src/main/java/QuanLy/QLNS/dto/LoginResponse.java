package QuanLy.QLNS.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private String type = "Bearer";
    private String tenDangnhap;
    private String quyenHan;
    private Long nhanVienId;
    
    public LoginResponse(String token, String tenDangnhap, String quyenHan, Long nhanVienId) {
        this.token = token;
        this.tenDangnhap = tenDangnhap;
        this.quyenHan = quyenHan;
        this.nhanVienId = nhanVienId;
    }
}

