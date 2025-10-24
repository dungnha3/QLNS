package QuanLy.QLNS.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {
    private long tongNhanVien;
    private long nhanVienDangLam;
    private long nhanVienNghiViec;
    private long tongPhongBan;
    private long tongChucVu;
    private long donNghiPhepChoXuLy;
    private long bangLuongChoXuLy;
    private long hopDongHetHan; // Hợp đồng hết hạn trong 30 ngày tới
}
