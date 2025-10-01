package QuanLy.QLNS.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import QuanLy.QLNS.Entity.HopDong;
import QuanLy.QLNS.Entity.NhanVien;

public interface HopDongService {

	Page<HopDong> getAll(Pageable pageable);

	Optional<HopDong> getById(Long id);

	HopDong create(HopDong hopDong);

	HopDong update(Long id, HopDong hopDong);

	void delete(Long id);

	List<HopDong> findByNhanVien(NhanVien nhanVien);

	Optional<HopDong> findActiveByNhanVien(NhanVien nhanVien);
}



