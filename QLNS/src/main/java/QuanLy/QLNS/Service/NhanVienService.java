package QuanLy.QLNS.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import QuanLy.QLNS.Entity.NhanVien;
import QuanLy.QLNS.Entity.PhongBan;
import QuanLy.QLNS.Entity.ChucVu;

public interface NhanVienService {

	Page<NhanVien> getAll(Pageable pageable);

	Optional<NhanVien> getById(Long id);

	NhanVien create(NhanVien nhanVien);

	NhanVien update(Long id, NhanVien nhanVien);

	void delete(Long id);

	Optional<NhanVien> getByEmail(String email);

	List<NhanVien> searchByHoTen(String keyword);

	List<NhanVien> getByPhongBan(PhongBan phongBan);

	List<NhanVien> getByChucVu(ChucVu chucVu);
	
	boolean existsByEmail(String email);
	
	NhanVien save(NhanVien nhanVien);
	
	List<NhanVien> getNhanVienWithoutContract();

}



