package QuanLy.QLNS.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import QuanLy.QLNS.Entity.ChucVu;

public interface ChucVuService {

	Page<ChucVu> getAll(Pageable pageable);

	Optional<ChucVu> getById(Long id);

	ChucVu create(ChucVu chucVu);

	ChucVu update(Long id, ChucVu chucVu);

	void delete(Long id);

	Optional<ChucVu> findByTen(String ten);
}



