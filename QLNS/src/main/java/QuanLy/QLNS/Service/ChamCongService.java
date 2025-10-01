package QuanLy.QLNS.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import QuanLy.QLNS.Entity.ChamCong;
import QuanLy.QLNS.Entity.NhanVien;

public interface ChamCongService {

	Page<ChamCong> getAll(Pageable pageable);

	Optional<ChamCong> getById(Long id);

	ChamCong create(ChamCong chamCong);

	ChamCong update(Long id, ChamCong chamCong);

	void delete(Long id);

	List<ChamCong> findByNhanVien(NhanVien nhanVien);

	Optional<ChamCong> findByNhanVienAndNgay(NhanVien nhanVien, LocalDate ngayLam);
}



