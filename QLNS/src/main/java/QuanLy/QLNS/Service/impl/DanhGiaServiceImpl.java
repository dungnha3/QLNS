package QuanLy.QLNS.Service.impl;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import QuanLy.QLNS.Entity.DanhGia;
import QuanLy.QLNS.Entity.NhanVien;
import QuanLy.QLNS.Repository.DanhGiaRepository;
import QuanLy.QLNS.Service.DanhGiaService;

@Service
public class DanhGiaServiceImpl implements DanhGiaService {

	private final DanhGiaRepository repository;

	public DanhGiaServiceImpl(DanhGiaRepository repository) {
		this.repository = repository;
	}

	@Override
	public Page<DanhGia> getAll(Pageable pageable) {
		return repository.findAll(pageable);
	}

	@Override
	public Optional<DanhGia> getById(Long id) {
		return repository.findById(id);
	}

	@Override
	@Transactional
	public DanhGia create(DanhGia danhGia) {
		return repository.save(danhGia);
	}

	@Override
	@Transactional
	public DanhGia update(Long id, DanhGia danhGia) {
		DanhGia existing = repository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("DanhGia not found: " + id));
		existing.setNhanVien(danhGia.getNhanVien());
		existing.setNguoiDanhGia(danhGia.getNguoiDanhGia());
		existing.setKyDanhGia(danhGia.getKyDanhGia());
		existing.setLoaiDanhGia(danhGia.getLoaiDanhGia());
		existing.setDiemChuyenMon(danhGia.getDiemChuyenMon());
		existing.setDiemThaiDo(danhGia.getDiemThaiDo());
		existing.setDiemKyNang(danhGia.getDiemKyNang());
		existing.setDiemTrungBinh(danhGia.getDiemTrungBinh());
		existing.setXepLoai(danhGia.getXepLoai());
		existing.setNhanXet(danhGia.getNhanXet());
		existing.setMucTieuKeTiep(danhGia.getMucTieuKeTiep());
		existing.setNgayDanhGia(danhGia.getNgayDanhGia());
		return repository.save(existing);
	}

	@Override
	@Transactional
	public void delete(Long id) {
		repository.deleteById(id);
	}

	@Override
	public List<DanhGia> findByNhanVien(NhanVien nhanVien) {
		return repository.findByNhanVien(nhanVien);
	}

	@Override
	public Optional<DanhGia> findByNhanVienAndKyDanhGia(NhanVien nhanVien, LocalDate ky) {
		return repository.findByNhanVienAndKyDanhGia(nhanVien, ky);
	}
}










