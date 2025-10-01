package QuanLy.QLNS.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import QuanLy.QLNS.Entity.PhongBan;

public interface PhongBanService {

	Page<PhongBan> getAll(Pageable pageable);

	Optional<PhongBan> getById(Long id);

	PhongBan create(PhongBan phongBan);

	PhongBan update(Long id, PhongBan phongBan);

	void delete(Long id);

	Optional<PhongBan> findByTen(String ten);

	List<PhongBan> findByDiaDiem(String diaDiem);
}



