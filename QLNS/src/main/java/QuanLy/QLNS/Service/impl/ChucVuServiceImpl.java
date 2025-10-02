package QuanLy.QLNS.Service.impl;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import QuanLy.QLNS.Entity.ChucVu;
import QuanLy.QLNS.Repository.ChucVuRepository;
import QuanLy.QLNS.Service.ChucVuService;

@Service
public class ChucVuServiceImpl implements ChucVuService {

	private final ChucVuRepository repository;

	public ChucVuServiceImpl(ChucVuRepository repository) {
		this.repository = repository;
	}

	@Override
	public Page<ChucVu> getAll(Pageable pageable) {
		return repository.findAll(pageable);
	}

	@Override
	public Optional<ChucVu> getById(Long id) {
		return repository.findById(id);
	}

	@Override
	@Transactional
	public ChucVu create(ChucVu chucVu) {
		return repository.save(chucVu);
	}

	@Override
	@Transactional
	public ChucVu update(Long id, ChucVu chucVu) {
		ChucVu existing = repository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("ChucVu not found: " + id));
		existing.setLuong_co_ban(chucVu.getLuong_co_ban());
		existing.setMo_ta(chucVu.getMo_ta());
		existing.setTen_chucvu(chucVu.getTen_chucvu());
		existing.setMucLuongToiThieu(chucVu.getMucLuongToiThieu());
		existing.setMucLuongToiDa(chucVu.getMucLuongToiDa());
		return repository.save(existing);
	}

	@Override
	@Transactional
	public void delete(Long id) {
		repository.deleteById(id);
	}

	@Override
	public Optional<ChucVu> findByTen(String ten) {
		return repository.findByTenChucvu(ten);
	}
}






