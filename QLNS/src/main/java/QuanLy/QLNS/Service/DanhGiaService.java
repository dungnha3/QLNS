package QuanLy.QLNS.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import QuanLy.QLNS.Entity.DanhGia;
import QuanLy.QLNS.Entity.NhanVien;

public interface DanhGiaService {

	Page<DanhGia> getAll(Pageable pageable);

	Optional<DanhGia> getById(Long id);

	DanhGia create(DanhGia danhGia);

	DanhGia update(Long id, DanhGia danhGia);

	void delete(Long id);

	List<DanhGia> findByNhanVien(NhanVien nhanVien);

	Optional<DanhGia> findByNhanVienAndKyDanhGia(NhanVien nhanVien, LocalDate ky);
}



