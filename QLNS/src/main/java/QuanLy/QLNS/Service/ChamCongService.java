package QuanLy.QLNS.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import QuanLy.QLNS.dto.ChamCongGPSRequest;
import QuanLy.QLNS.Entity.ChamCong;
import QuanLy.QLNS.Entity.NhanVien;

public interface ChamCongService {

	Page<ChamCong> getAll(Pageable pageable);
	
	Page<ChamCong> getAll(Pageable pageable, Long nhanVienId, Integer month, Integer year);

	Optional<ChamCong> getById(Long id);

	ChamCong create(ChamCong chamCong);

	ChamCong update(Long id, ChamCong chamCong);

	void delete(Long id);

	List<ChamCong> findByNhanVien(NhanVien nhanVien);

	Optional<ChamCong> findByNhanVienAndNgay(NhanVien nhanVien, LocalDate ngayLam);
	
	/**
	 * Chấm công bằng GPS
	 * @param request Thông tin GPS
	 * @return ChamCong đã tạo/cập nhật
	 */
	Map<String, Object> chamCongGPS(ChamCongGPSRequest request);
	
	/**
	 * Lấy trạng thái chấm công hôm nay
	 * @param nhanVienId ID nhân viên
	 * @return Thông tin trạng thái
	 */
	Map<String, Object> getTrangThaiChamCongHomNay(Long nhanVienId);
}



