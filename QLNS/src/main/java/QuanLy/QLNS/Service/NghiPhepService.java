package QuanLy.QLNS.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import QuanLy.QLNS.Entity.NghiPhep;
import QuanLy.QLNS.Entity.NhanVien;

public interface NghiPhepService {

	Page<NghiPhep> getAll(Pageable pageable);

	Optional<NghiPhep> getById(Long id);

	NghiPhep create(NghiPhep nghiPhep);

	NghiPhep update(Long id, NghiPhep nghiPhep);

	void delete(Long id);

	List<NghiPhep> findByNhanVien(NhanVien nhanVien);

	List<NghiPhep> findByTrangThai(String trangThai);
}



