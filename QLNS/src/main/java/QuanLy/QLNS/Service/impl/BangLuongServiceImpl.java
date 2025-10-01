package QuanLy.QLNS.Service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import QuanLy.QLNS.Entity.BangLuong;
import QuanLy.QLNS.Entity.NhanVien;
import QuanLy.QLNS.Repository.BangLuongRepository;
import QuanLy.QLNS.Service.BangLuongService;

@Service
public class BangLuongServiceImpl implements BangLuongService {

	private final BangLuongRepository repository;

	public BangLuongServiceImpl(BangLuongRepository repository) {
		this.repository = repository;
	}

	@Override
	public Page<BangLuong> getAll(Pageable pageable) {
		return repository.findAll(pageable);
	}

	@Override
	public Optional<BangLuong> getById(Long id) {
		return repository.findById(id);
	}

	@Override
	@Transactional
	public BangLuong create(BangLuong bangLuong) {
		return repository.save(bangLuong);
	}

	@Override
	@Transactional
	public BangLuong update(Long id, BangLuong bangLuong) {
		BangLuong existing = repository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("BangLuong not found: " + id));
		existing.setKhau_tru(bangLuong.getKhau_tru());
		existing.setLuong_co_ban(bangLuong.getLuong_co_ban());
		existing.setPhu_cap(bangLuong.getPhu_cap());
		existing.setThang_nam(bangLuong.getThang_nam());
		existing.setThuc_lanh(bangLuong.getThuc_lanh());
		existing.setTong_cong(bangLuong.getTong_cong());
		existing.setThang(bangLuong.getThang());
		existing.setNam(bangLuong.getNam());
		existing.setThuong(bangLuong.getThuong());
		existing.setPhat(bangLuong.getPhat());
		existing.setBhxh(bangLuong.getBhxh());
		existing.setBhyt(bangLuong.getBhyt());
		existing.setBhtn(bangLuong.getBhtn());
		existing.setThueThuNhap(bangLuong.getThueThuNhap());
		existing.setNgayThanhToan(bangLuong.getNgayThanhToan());
		existing.setTrangThai(bangLuong.getTrangThai());
		existing.setNhanVien(bangLuong.getNhanVien());
		return repository.save(existing);
	}

	@Override
	@Transactional
	public void delete(Long id) {
		repository.deleteById(id);
	}

	@Override
	public List<BangLuong> findByNhanVien(NhanVien nhanVien) {
		return repository.findByNhanVien(nhanVien);
	}

	@Override
	public List<BangLuong> findByTrangThai(String trangThai) {
		return repository.findByTrangThai(trangThai);
	}
}




