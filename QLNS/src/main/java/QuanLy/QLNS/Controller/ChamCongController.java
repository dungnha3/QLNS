package QuanLy.QLNS.Controller;

import java.net.URI;
import java.time.LocalDate;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
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

import java.util.Map;

import QuanLy.QLNS.dto.ChamCongGPSRequest;
import QuanLy.QLNS.dto.CreateChamCongRequest;
import QuanLy.QLNS.dto.UpdateChamCongRequest;
import QuanLy.QLNS.Entity.ChamCong;
import QuanLy.QLNS.Entity.NhanVien;
import QuanLy.QLNS.Service.ChamCongService;
import QuanLy.QLNS.Service.NhanVienService;
import jakarta.validation.Valid;

@RestController
@RequestMapping(value = "/api/chamcong", produces = "application/json;charset=UTF-8")
public class ChamCongController {

	private final ChamCongService service;
	private final NhanVienService nhanVienService;

	public ChamCongController(ChamCongService service, NhanVienService nhanVienService) {
		this.service = service;
		this.nhanVienService = nhanVienService;
	}
	
	@PostMapping("/gps")
	public ResponseEntity<Map<String, Object>> chamCongGPS(@RequestBody ChamCongGPSRequest request) {
		Map<String, Object> response = service.chamCongGPS(request);
		return ResponseEntity.ok(response);
	}
	
	@GetMapping("/status/{nhanVienId}")
	public ResponseEntity<Map<String, Object>> getTrangThaiChamCong(@PathVariable Long nhanVienId) {
		Map<String, Object> response = service.getTrangThaiChamCongHomNay(nhanVienId);
		return ResponseEntity.ok(response);
	}

	@GetMapping
	public ResponseEntity<Page<ChamCong>> list(
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size,
			@RequestParam(required = false) Long nhanVienId,
			@RequestParam(required = false) Integer month,
			@RequestParam(required = false) Integer year) {
		Pageable pageable = PageRequest.of(page, size);
		return ResponseEntity.ok(service.getAll(pageable, nhanVienId, month, year));
	}

	@GetMapping("/{id}")
	public ResponseEntity<ChamCong> get(@PathVariable Long id) {
		return service.getById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
	}

	@PostMapping
	public ResponseEntity<ChamCong> create(@Valid @RequestBody CreateChamCongRequest request) {
		// Tìm nhân viên
		NhanVien nhanVien = nhanVienService.getById(request.getNhanVien())
				.orElseThrow(() -> new IllegalArgumentException("Nhân viên không tồn tại: " + request.getNhanVien()));
		
		// Tạo entity ChamCong
		ChamCong chamCong = new ChamCong();
		chamCong.setGio_vao(request.getGio_vao());
		chamCong.setGio_ra(request.getGio_ra());
		chamCong.setNgay_lam(request.getNgay_lam());
		chamCong.setTrangThai(request.getTrangThai());
		chamCong.setTongGioLam(request.getTongGioLam());
		chamCong.setLoaiCa(request.getLoaiCa());
		chamCong.setGhiChu(request.getGhiChu());
		chamCong.setLatitude(request.getLatitude());
		chamCong.setLongitude(request.getLongitude());
		chamCong.setDiaChiCheckin(request.getDiaChiCheckin());
		chamCong.setKhoangCach(request.getKhoangCach());
		chamCong.setPhuongThuc(request.getPhuongThuc());
		chamCong.setNhanVien(nhanVien);
		
		ChamCong created = service.create(chamCong);
		return ResponseEntity.created(URI.create("/api/chamcong/" + created.getChamcong_id())).body(created);
	}

	@PutMapping("/{id}")
	public ResponseEntity<ChamCong> update(@PathVariable Long id, @Valid @RequestBody UpdateChamCongRequest request) {
		ChamCong existing = service.getById(id)
				.orElseThrow(() -> new IllegalArgumentException("Chấm công không tồn tại: " + id));
		
		// Update fields
		if (request.getGio_vao() != null) existing.setGio_vao(request.getGio_vao());
		if (request.getGio_ra() != null) existing.setGio_ra(request.getGio_ra());
		if (request.getNgay_lam() != null) existing.setNgay_lam(request.getNgay_lam());
		if (request.getTrangThai() != null) existing.setTrangThai(request.getTrangThai());
		if (request.getTongGioLam() != null) existing.setTongGioLam(request.getTongGioLam());
		if (request.getLoaiCa() != null) existing.setLoaiCa(request.getLoaiCa());
		if (request.getGhiChu() != null) existing.setGhiChu(request.getGhiChu());
		if (request.getLatitude() != null) existing.setLatitude(request.getLatitude());
		if (request.getLongitude() != null) existing.setLongitude(request.getLongitude());
		if (request.getDiaChiCheckin() != null) existing.setDiaChiCheckin(request.getDiaChiCheckin());
		if (request.getKhoangCach() != null) existing.setKhoangCach(request.getKhoangCach());
		if (request.getPhuongThuc() != null) existing.setPhuongThuc(request.getPhuongThuc());
		
		// Update nhân viên nếu có
		if (request.getNhanVien() != null) {
			NhanVien nhanVien = nhanVienService.getById(request.getNhanVien())
					.orElseThrow(() -> new IllegalArgumentException("Nhân viên không tồn tại: " + request.getNhanVien()));
			existing.setNhanVien(nhanVien);
		}
		
		return ResponseEntity.ok(service.update(id, existing));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		service.delete(id);
		return ResponseEntity.noContent().build();
	}

	@GetMapping("/by-ngay")
	public ResponseEntity<?> byNgay(@RequestParam Long nhanVienId,
			@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate ngay) {
		// For simplicity, just return 200 even if not found
		return ResponseEntity.ok().build();
	}
}










