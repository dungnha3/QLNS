package QuanLy.QLNS.Controller;

import java.net.URI;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import QuanLy.QLNS.Entity.ChucVu;
import QuanLy.QLNS.Entity.NhanVien;
import QuanLy.QLNS.Entity.PhongBan;
import QuanLy.QLNS.Entity.TaiKhoan;
import QuanLy.QLNS.Repository.ChucVuRepository;
import QuanLy.QLNS.Repository.PhongBanRepository;
import QuanLy.QLNS.Repository.TaiKhoanRepository;
import QuanLy.QLNS.Service.NhanVienService;
import QuanLy.QLNS.dto.UpdateNhanVienRequest;

@RestController
@RequestMapping(value = "/api/nhanvien", produces = "application/json;charset=UTF-8")
public class NhanVienController {

	private final NhanVienService nhanVienService;
	private final PhongBanRepository phongBanRepository;
	private final ChucVuRepository chucVuRepository;
	private final TaiKhoanRepository taiKhoanRepository;

	public NhanVienController(NhanVienService nhanVienService, 
							  PhongBanRepository phongBanRepository,
							  ChucVuRepository chucVuRepository,
							  TaiKhoanRepository taiKhoanRepository) {
		this.nhanVienService = nhanVienService;
		this.phongBanRepository = phongBanRepository;
		this.chucVuRepository = chucVuRepository;
		this.taiKhoanRepository = taiKhoanRepository;
	}

	@GetMapping
	public ResponseEntity<Page<NhanVien>> list(
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size) {
		Pageable pageable = PageRequest.of(page, size);
		return ResponseEntity.ok(nhanVienService.getAll(pageable));
	}

	@GetMapping("/{id}")
	public ResponseEntity<NhanVien> get(@PathVariable Long id) {
		Optional<NhanVien> nv = nhanVienService.getById(id);
		return nv.map(ResponseEntity::ok)
				.orElse(ResponseEntity.notFound().build());
	}

	@PostMapping
	public ResponseEntity<NhanVien> create(@RequestBody NhanVien nhanVien) {
		NhanVien created = nhanVienService.create(nhanVien);
		return ResponseEntity.created(URI.create("/api/nhanvien/" + created.getNhanvien_id()))
				.body(created);
	}

	@PutMapping("/{id}")
	public ResponseEntity<NhanVien> update(@PathVariable Long id, @RequestBody UpdateNhanVienRequest request) {
		NhanVien existing = nhanVienService.getById(id)
				.orElseThrow(() -> new IllegalArgumentException("NhanVien not found: " + id));
		
		// Update basic fields
		existing.setHo_ten(request.getHo_ten());
		existing.setEmail(request.getEmail());
		existing.setGioi_tinh(request.getGioi_tinh());
		existing.setDia_chi(request.getDia_chi());
		existing.setNgay_sinh(request.getNgay_sinh());
		existing.setNgay_vao_lam(request.getNgay_vao_lam());
		existing.setSo_dien_thoai(request.getSo_dien_thoai());
		existing.setCccd(request.getCccd());
		existing.setTrangThai(request.getTrangThai());
		
		// Handle relationships by ID
		if (request.getPhongBan() != null) {
			PhongBan phongBan = phongBanRepository.findById(request.getPhongBan())
					.orElseThrow(() -> new IllegalArgumentException("PhongBan not found: " + request.getPhongBan()));
			existing.setPhongBan(phongBan);
		}
		
		if (request.getChucVu() != null) {
			ChucVu chucVu = chucVuRepository.findById(request.getChucVu())
					.orElseThrow(() -> new IllegalArgumentException("ChucVu not found: " + request.getChucVu()));
			existing.setChucVu(chucVu);
		}
		
		if (request.getTaiKhoan() != null) {
			TaiKhoan taiKhoan = taiKhoanRepository.findById(request.getTaiKhoan())
					.orElseThrow(() -> new IllegalArgumentException("TaiKhoan not found: " + request.getTaiKhoan()));
			existing.setTaiKhoan(taiKhoan);
		}
		
		NhanVien updated = nhanVienService.save(existing);
		return ResponseEntity.ok(updated);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		nhanVienService.delete(id);
		return ResponseEntity.noContent().build();
	}

	@GetMapping("/search")
	public ResponseEntity<List<NhanVien>> search(@RequestParam("q") String keyword) {
		return ResponseEntity.ok(nhanVienService.searchByHoTen(keyword));
	}
	
	@GetMapping("/without-contract")
	public ResponseEntity<List<NhanVien>> getNhanVienWithoutContract() {
		return ResponseEntity.ok(nhanVienService.getNhanVienWithoutContract());
	}
}



