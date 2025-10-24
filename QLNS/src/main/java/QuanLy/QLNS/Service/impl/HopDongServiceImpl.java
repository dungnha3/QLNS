package QuanLy.QLNS.Service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import QuanLy.QLNS.Entity.HopDong;
import QuanLy.QLNS.Entity.NhanVien;
import QuanLy.QLNS.Repository.HopDongRepository;
import QuanLy.QLNS.Service.HopDongService;

@Service
public class HopDongServiceImpl implements HopDongService {

	private final HopDongRepository repository;

	public HopDongServiceImpl(HopDongRepository repository) {
		this.repository = repository;
	}

	@Override
	public Page<HopDong> getAll(Pageable pageable) {
		return repository.findAll(pageable);
	}

	@Override
	public Optional<HopDong> getById(Long id) {
		return repository.findById(id);
	}

	@Override
	@Transactional
	public HopDong create(HopDong hopDong) {
		return repository.save(hopDong);
	}

	@Override
	@Transactional
	public HopDong update(Long id, HopDong hopDong) {
		HopDong existing = repository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("HopDong not found: " + id));
		existing.setLoai_hopdong(hopDong.getLoai_hopdong());
		existing.setNgay_batdau(hopDong.getNgay_batdau());
		existing.setNgay_ketthuc(hopDong.getNgay_ketthuc());
		existing.setNgay_ky(hopDong.getNgay_ky());
		existing.setLuongCoBan(hopDong.getLuongCoBan());
		existing.setTrangThai(hopDong.getTrangThai());
		existing.setGhiChu(hopDong.getGhiChu());
		existing.setNhanVien(hopDong.getNhanVien());
		return repository.save(existing);
	}

	@Override
	@Transactional
	public void delete(Long id) {
		repository.deleteById(id);
	}

	@Override
	public List<HopDong> findByNhanVien(NhanVien nhanVien) {
		return repository.findByNhanVien(nhanVien);
	}

	@Override
	public Optional<HopDong> findActiveByNhanVien(NhanVien nhanVien) {
		return repository.findActiveHopDongByNhanVien(nhanVien);
	}
}










