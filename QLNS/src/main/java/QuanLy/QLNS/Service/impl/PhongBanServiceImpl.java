package QuanLy.QLNS.Service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import QuanLy.QLNS.Entity.PhongBan;
import QuanLy.QLNS.Repository.PhongBanRepository;
import QuanLy.QLNS.Service.PhongBanService;

@Service
public class PhongBanServiceImpl implements PhongBanService {

	private final PhongBanRepository repository;

	public PhongBanServiceImpl(PhongBanRepository repository) {
		this.repository = repository;
	}

	@Override
	public Page<PhongBan> getAll(Pageable pageable) {
		return repository.findAll(pageable);
	}

	@Override
	public Optional<PhongBan> getById(Long id) {
		return repository.findById(id);
	}

	@Override
	@Transactional
	public PhongBan create(PhongBan phongBan) {
		return repository.save(phongBan);
	}

	@Override
	@Transactional
	public PhongBan update(Long id, PhongBan phongBan) {
		PhongBan existing = repository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("PhongBan not found: " + id));
		existing.setTen_phongban(phongBan.getTen_phongban());
		existing.setDia_diem(phongBan.getDia_diem());
		return repository.save(existing);
	}

	@Override
	@Transactional
	public void delete(Long id) {
		repository.deleteById(id);
	}

	@Override
	public Optional<PhongBan> findByTen(String ten) {
		return repository.findByTenPhongban(ten);
	}

	@Override
	public List<PhongBan> findByDiaDiem(String diaDiem) {
		return repository.findByDiaDiem(diaDiem);
	}
}




