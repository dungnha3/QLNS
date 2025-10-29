package QuanLy.QLNS.Controller;

import java.net.URI;

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

import QuanLy.QLNS.Entity.HopDong;
import QuanLy.QLNS.Entity.NhanVien;
import QuanLy.QLNS.Service.HopDongService;
import QuanLy.QLNS.Service.NhanVienService;
import QuanLy.QLNS.dto.CreateHopDongRequest;
import QuanLy.QLNS.dto.UpdateHopDongRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping(value = "/api/hopdong", produces = "application/json;charset=UTF-8")
public class HopDongController {

	private final HopDongService service;
	private final NhanVienService nhanVienService;

	public HopDongController(HopDongService service, NhanVienService nhanVienService) {
		this.service = service;
		this.nhanVienService = nhanVienService;
	}

	@GetMapping
	public ResponseEntity<Page<HopDong>> list(@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size) {
		Pageable pageable = PageRequest.of(page, size);
		return ResponseEntity.ok(service.getAll(pageable));
	}

	@GetMapping("/{id}")
	public ResponseEntity<HopDong> get(@PathVariable Long id) {
		return service.getById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
	}

	@PostMapping
	public ResponseEntity<HopDong> create(@Valid @RequestBody CreateHopDongRequest request) {
		// Tìm nhân viên
		NhanVien nhanVien = nhanVienService.getById(request.getNhanVien())
				.orElseThrow(() -> new IllegalArgumentException("Nhân viên không tồn tại: " + request.getNhanVien()));
		
		// Tạo entity HopDong
		HopDong hopDong = new HopDong();
		hopDong.setLoai_hopdong(request.getLoai_hopdong());
		hopDong.setNgay_batdau(request.getNgay_batdau());
		hopDong.setNgay_ketthuc(request.getNgay_ketthuc());
		hopDong.setNgay_ky(request.getNgay_ky());
		hopDong.setLuongCoBan(request.getLuongCoBan());
		hopDong.setTrangThai(request.getTrangThai() != null ? request.getTrangThai() : "CON_HIEU_LUC");
		hopDong.setGhiChu(request.getGhiChu());
		hopDong.setNhanVien(nhanVien);
		
		HopDong created = service.create(hopDong);
		return ResponseEntity.created(URI.create("/api/hopdong/" + created.getHopdong_id())).body(created);
	}

	@PutMapping("/{id}")
	public ResponseEntity<HopDong> update(@PathVariable Long id, @Valid @RequestBody UpdateHopDongRequest request) {
		HopDong existing = service.getById(id)
				.orElseThrow(() -> new IllegalArgumentException("Hợp đồng không tồn tại: " + id));
		
		// Update fields
		if (request.getLoai_hopdong() != null) {
			existing.setLoai_hopdong(request.getLoai_hopdong());
		}
		if (request.getNgay_batdau() != null) {
			existing.setNgay_batdau(request.getNgay_batdau());
		}
		// Cho phép set null cho ngày kết thúc (vô thời hạn)
		existing.setNgay_ketthuc(request.getNgay_ketthuc());
		
		if (request.getNgay_ky() != null) {
			existing.setNgay_ky(request.getNgay_ky());
		}
		if (request.getLuongCoBan() != null) {
			existing.setLuongCoBan(request.getLuongCoBan());
		}
		if (request.getTrangThai() != null) {
			existing.setTrangThai(request.getTrangThai());
		}
		if (request.getGhiChu() != null) {
			existing.setGhiChu(request.getGhiChu());
		}
		
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
}










