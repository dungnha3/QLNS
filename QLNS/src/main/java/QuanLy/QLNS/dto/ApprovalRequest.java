package QuanLy.QLNS.dto;

import lombok.Data;

@Data
public class ApprovalRequest {
    private String trangThai; // DA_DUYET hoặc TU_CHOI
    private String ghiChu;
    private Long nguoiDuyetId; // ID người phê duyệt
}
