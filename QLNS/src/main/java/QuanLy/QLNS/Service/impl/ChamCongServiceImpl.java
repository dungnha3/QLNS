package QuanLy.QLNS.Service.impl;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import QuanLy.QLNS.Entity.ChamCong;
import QuanLy.QLNS.Entity.NhanVien;
import QuanLy.QLNS.Repository.ChamCongRepository;
import QuanLy.QLNS.Service.ChamCongService;

@Service
public class ChamCongServiceImpl implements ChamCongService {

	private final ChamCongRepository repository;

	public ChamCongServiceImpl(ChamCongRepository repository) {
		this.repository = repository;
	}

	@Override
	public Page<ChamCong> getAll(Pageable pageable) {
		return repository.findAll(pageable);
	}

	@Override
	public Optional<ChamCong> getById(Long id) {
		return repository.findById(id);
	}

	@Override
	@Transactional
	public ChamCong create(ChamCong chamCong) {
		return repository.save(chamCong);
	}

	@Override
	@Transactional
	public ChamCong update(Long id, ChamCong chamCong) {
		ChamCong existing = repository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("ChamCong not found: " + id));
		existing.setGio_ra(chamCong.getGio_ra());
		existing.setGio_vao(chamCong.getGio_vao());
		existing.setNgay_lam(chamCong.getNgay_lam());
		existing.setNgay_tam(chamCong.getNgay_tam());
		existing.setTrang_thai(chamCong.getTrang_thai());
		existing.setTongGioLam(chamCong.getTongGioLam());
		existing.setLoaiCa(chamCong.getLoaiCa());
		existing.setGhiChu(chamCong.getGhiChu());
		existing.setNhanVien(chamCong.getNhanVien());
		return repository.save(existing);
	}

	@Override
	@Transactional
	public void delete(Long id) {
		repository.deleteById(id);
	}

	@Override
	public List<ChamCong> findByNhanVien(NhanVien nhanVien) {
		return repository.findByNhanVien(nhanVien);
	}

	@Override
	public Optional<ChamCong> findByNhanVienAndNgay(NhanVien nhanVien, LocalDate ngayLam) {
		return repository.findByNhanVienAndNgayLam(nhanVien, ngayLam);
	}
}




