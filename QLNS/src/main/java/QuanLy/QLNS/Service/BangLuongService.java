package QuanLy.QLNS.Service;

import java.util.List;
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
}



