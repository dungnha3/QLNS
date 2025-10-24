package QuanLy.QLNS.Service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import QuanLy.QLNS.Entity.NghiPhep;
import QuanLy.QLNS.Entity.NhanVien;
import QuanLy.QLNS.Repository.NghiPhepRepository;
import QuanLy.QLNS.Repository.NhanVienRepository;
import QuanLy.QLNS.Service.NghiPhepService;

@Service
public class NghiPhepServiceImpl implements NghiPhepService {

	private final NghiPhepRepository repository;
	private final NhanVienRepository nhanVienRepository;

	public NghiPhepServiceImpl(NghiPhepRepository repository, NhanVienRepository nhanVienRepository) {
		this.repository = repository;
		this.nhanVienRepository = nhanVienRepository;
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

	@Override
	@Transactional
	public NghiPhep pheDuyet(Long nghiPhepId, Long nguoiDuyetId, String trangThai, String ghiChu) {
		// 1. Lấy đơn nghỉ phép
		NghiPhep nghiPhep = repository.findById(nghiPhepId)
				.orElseThrow(() -> new IllegalArgumentException("Không tìm thấy đơn nghỉ phép: " + nghiPhepId));
		
		// 2. Kiểm tra trạng thái hiện tại
		if (!"CHO_DUYET".equals(nghiPhep.getTrangThai())) {
			throw new IllegalStateException("Đơn nghỉ phép đã được xử lý trước đó");
		}
		
		// 3. Validate trạng thái mới
		if (!"DA_DUYET".equals(trangThai) && !"TU_CHOI".equals(trangThai)) {
			throw new IllegalArgumentException("Trạng thái phải là DA_DUYET hoặc TU_CHOI");
		}
		
		// 4. Lấy thông tin người duyệt
		NhanVien nguoiDuyet = nhanVienRepository.findById(nguoiDuyetId)
				.orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người duyệt: " + nguoiDuyetId));
		
		// 5. Cập nhật thông tin phê duyệt
		nghiPhep.setTrangThai(trangThai);
		nghiPhep.setNguoiDuyet(nguoiDuyet);
		nghiPhep.setNgayDuyet(LocalDateTime.now());
		nghiPhep.setGhiChuDuyet(ghiChu);
		
		return repository.save(nghiPhep);
	}
}










