package QuanLy.QLNS.Service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import QuanLy.QLNS.Entity.ChucVu;
import QuanLy.QLNS.Entity.NhanVien;
import QuanLy.QLNS.Entity.PhongBan;
import QuanLy.QLNS.Repository.NhanVienRepository;
import QuanLy.QLNS.Service.NhanVienService;

@Service
public class NhanVienServiceImpl implements NhanVienService {

	private final NhanVienRepository nhanVienRepository;

	public NhanVienServiceImpl(NhanVienRepository nhanVienRepository) {
		this.nhanVienRepository = nhanVienRepository;
	}

	@Override
	public Page<NhanVien> getAll(Pageable pageable) {
		return nhanVienRepository.findAll(pageable);
	}

	@Override
	public Optional<NhanVien> getById(Long id) {
		return nhanVienRepository.findById(id);
	}

	@Override
	@Transactional
	public NhanVien create(NhanVien nhanVien) {
		return nhanVienRepository.save(nhanVien);
	}

	@Override
	@Transactional
	public NhanVien update(Long id, NhanVien nhanVien) {
		NhanVien existing = nhanVienRepository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("NhanVien not found: " + id));
		existing.setDia_chi(nhanVien.getDia_chi());
		existing.setEmail(nhanVien.getEmail());
		existing.setGioi_tinh(nhanVien.getGioi_tinh());
		existing.setHo_ten(nhanVien.getHo_ten());
		existing.setNgay_sinh(nhanVien.getNgay_sinh());
		existing.setNgay_vao_lam(nhanVien.getNgay_vao_lam());
		existing.setSo_dien_thoai(nhanVien.getSo_dien_thoai());
		existing.setCccd(nhanVien.getCccd());
		existing.setTrangThai(nhanVien.getTrangThai());
		existing.setTaiKhoan(nhanVien.getTaiKhoan());
		existing.setPhongBan(nhanVien.getPhongBan());
		existing.setChucVu(nhanVien.getChucVu());
		return nhanVienRepository.save(existing);
	}

	@Override
	@Transactional
	public void delete(Long id) {
		nhanVienRepository.deleteById(id);
	}

	@Override
	public Optional<NhanVien> getByEmail(String email) {
		return nhanVienRepository.findByEmail(email);
	}

	@Override
	public List<NhanVien> searchByHoTen(String keyword) {
		return nhanVienRepository.searchByHoTen(keyword);
	}

	@Override
	public List<NhanVien> getByPhongBan(PhongBan phongBan) {
		return nhanVienRepository.findByPhongBan(phongBan);
	}

	@Override
	public List<NhanVien> getByChucVu(ChucVu chucVu) {
		return nhanVienRepository.findByChucVu(chucVu);
	}
}



