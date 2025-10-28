package QuanLy.QLNS.dto;

import lombok.Data;

@Data
public class ChamCongGPSRequest {
    private Long nhanVienId;
    private Double latitude;
    private Double longitude;
    private String diaChiCheckin;
    private String loaiCa; // VAO hoặc RA
}
