package QuanLy.QLNS.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateNghiPhepRequest {
    @NotNull(message = "Nhân viên không được để trống")
    private Long nhanVien; // ID của nhân viên
    
    @NotBlank(message = "Loại nghỉ không được để trống")
    private String loaiNghi;
    
    @NotNull(message = "Ngày bắt đầu không được để trống")
    private LocalDate ngayBatDau;
    
    @NotNull(message = "Ngày kết thúc không được để trống")
    private LocalDate ngayKetThuc;
    
    @NotNull(message = "Số ngày nghỉ không được để trống")
    private Integer soNgayNghi;
    
    private String lyDo;
    private String trangThai;
    private Long nguoiDuyet; // ID của người duyệt (optional)
}
