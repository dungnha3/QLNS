package QuanLy.QLNS.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import QuanLy.QLNS.Entity.BangLuong;
import QuanLy.QLNS.Entity.NhanVien;

public interface BangLuongService {

	Page<BangLuong> getAll(Pageable pageable);

	Optional<BangLuong> getById(Long id);

	BangLuong create(BangLuong bangLuong);

	BangLuong update(Long id, BangLuong bangLuong);

	void delete(Long id);

	List<BangLuong> findByNhanVien(NhanVien nhanVien);

	List<BangLuong> findByTrangThai(String trangThai);

    Page<BangLuong> findByTrangThai(String trangThai, Pageable pageable);
    
    /**
     * Tính lương tự động cho nhân viên theo tháng
     * @param nhanVienId ID nhân viên
     * @param thang Tháng tính lương (1-12)
     * @param nam Năm tính lương
     * @return BangLuong đã được tính toán
     */
    BangLuong tinhLuongTuDong(Long nhanVienId, int thang, int nam);
    
    /**
     * Preview tính lương (không lưu vào DB)
     * @param nhanVienId ID nhân viên
     * @param thang Tháng
     * @param nam Năm
     * @return Map chứa thông tin preview
     */
    Map<String, Object> previewTinhLuong(Long nhanVienId, int thang, int nam);
    
    /**
     * Tính lương hàng loạt cho tất cả nhân viên
     * @param thang Tháng
     * @param nam Năm
     * @param phongBanId ID phòng ban (optional)
     * @return Danh sách bảng lương đã tạo
     */
    List<BangLuong> tinhLuongHangLoat(int thang, int nam, Long phongBanId);
    
    /**
     * Cập nhật trạng thái bảng lương
     * @param id ID bảng lương
     * @param trangThai Trạng thái mới
     * @return BangLuong đã cập nhật
     */
    BangLuong capNhatTrangThai(Long id, String trangThai);
}



