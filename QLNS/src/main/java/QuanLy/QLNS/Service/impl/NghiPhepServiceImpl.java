package QuanLy.QLNS.Service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import QuanLy.QLNS.Entity.NghiPhep;
import QuanLy.QLNS.Entity.NhanVien;
import QuanLy.QLNS.Repository.NghiPhepRepository;
import QuanLy.QLNS.Service.NghiPhepService;

@Service
public class NghiPhepServiceImpl implements NghiPhepService {

	private final NghiPhepRepository repository;

	public NghiPhepServiceImpl(NghiPhepRepository repository) {
		this.repository = repository;
	}

	@Override
	public Page<NghiPhep> getAll(Pageable pageable) {
		return repository.findAll(pageable);
	}

	@Override
	public Optional<NghiPhep> getById(Long id) {
		return repository.findById(id);
	}

	@Override
	@Transactional
	public NghiPhep create(NghiPhep nghiPhep) {
		return repository.save(nghiPhep);
	}

	@Override
	@Transactional
	public NghiPhep update(Long id, NghiPhep nghiPhep) {
		NghiPhep existing = repository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("NghiPhep not found: " + id));
		existing.setNhanVien(nghiPhep.getNhanVien());
		existing.setLoaiNghi(nghiPhep.getLoaiNghi());
		existing.setNgayBatDau(nghiPhep.getNgayBatDau());
		existing.setNgayKetThuc(nghiPhep.getNgayKetThuc());
		existing.setSoNgayNghi(nghiPhep.getSoNgayNghi());
		existing.setLyDo(nghiPhep.getLyDo());
		existing.setTrangThai(nghiPhep.getTrangThai());
		existing.setNguoiDuyet(nghiPhep.getNguoiDuyet());
		existing.setNgayDuyet(nghiPhep.getNgayDuyet());
		existing.setGhiChuDuyet(nghiPhep.getGhiChuDuyet());
		existing.setNgayTao(nghiPhep.getNgayTao());
		return repository.save(existing);
	}

	@Override
	@Transactional
	public void delete(Long id) {
		repository.deleteById(id);
	}

	@Override
	public List<NghiPhep> findByNhanVien(NhanVien nhanVien) {
		return repository.findByNhanVien(nhanVien);
	}

	@Override
	public List<NghiPhep> findByTrangThai(String trangThai) {
		return repository.findByTrangThai(trangThai);
	}

	@Override
	public Page<NghiPhep> findByTrangThai(String trangThai, Pageable pageable) {
		return repository.findByTrangThai(trangThai, pageable);
	}
}










