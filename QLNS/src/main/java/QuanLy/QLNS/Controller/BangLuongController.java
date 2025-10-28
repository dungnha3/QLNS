package QuanLy.QLNS.Controller;

import java.net.URI;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import QuanLy.QLNS.Entity.BangLuong;
import QuanLy.QLNS.Service.BangLuongService;

@RestController
@RequestMapping(value = "/api/bangluong", produces = "application/json;charset=UTF-8")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class BangLuongController {

	private final BangLuongService service;

	public BangLuongController(BangLuongService service) {
		this.service = service;
	}

    @GetMapping
    public ResponseEntity<Page<BangLuong>> list(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String trangThai) {
        Pageable pageable = PageRequest.of(page, size);
        if (trangThai != null && !trangThai.isBlank()) {
            return ResponseEntity.ok(service.findByTrangThai(trangThai, pageable));
        }
        return ResponseEntity.ok(service.getAll(pageable));
    }

	@GetMapping("/{id}")
	public ResponseEntity<BangLuong> get(@PathVariable Long id) {
		return service.getById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
	}

	@PostMapping
	public ResponseEntity<BangLuong> create(@RequestBody BangLuong body) {
		BangLuong created = service.create(body);
		return ResponseEntity.created(URI.create("/api/bang-luong/" + created.getBangluong_id())).body(created);
	}

	@PutMapping("/{id}")
	public ResponseEntity<BangLuong> update(@PathVariable Long id, @RequestBody BangLuong body) {
		return ResponseEntity.ok(service.update(id, body));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		service.delete(id);
		return ResponseEntity.noContent().build();
	}
	
	/**
	 * Tính lương tự động cho nhân viên
	 * POST /api/bangluong/tinh-luong?nhanVienId=1&thang=10&nam=2024
	 */
	@PostMapping("/tinh-luong")
	public ResponseEntity<BangLuong> tinhLuongTuDong(
			@RequestParam Long nhanVienId,
			@RequestParam int thang,
			@RequestParam int nam) {
		try {
			BangLuong bangLuong = service.tinhLuongTuDong(nhanVienId, thang, nam);
			return ResponseEntity.ok(bangLuong);
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().build();
		}
	}
	
	/**
	 * Preview tính lương (không lưu vào DB)
	 * GET /api/bangluong/preview?nhanVienId=1&thang=10&nam=2024
	 */
	@GetMapping("/preview")
	public ResponseEntity<Map<String, Object>> previewTinhLuong(
			@RequestParam Long nhanVienId,
			@RequestParam int thang,
			@RequestParam int nam) {
		try {
			Map<String, Object> preview = service.previewTinhLuong(nhanVienId, thang, nam);
			return ResponseEntity.ok(preview);
		} catch (Exception e) {
			return ResponseEntity.badRequest().build();
		}
	}
	
	/**
	 * Tính lương hàng loạt
	 * POST /api/bangluong/tinh-hang-loat?thang=10&nam=2024&phongBanId=1
	 */
	@PostMapping("/tinh-hang-loat")
	public ResponseEntity<Map<String, Object>> tinhLuongHangLoat(
			@RequestParam int thang,
			@RequestParam int nam,
			@RequestParam(required = false) Long phongBanId) {
		try {
			List<BangLuong> results = service.tinhLuongHangLoat(thang, nam, phongBanId);
			Map<String, Object> response = new java.util.HashMap<>();
			response.put("success", true);
			response.put("count", results.size());
			response.put("data", results);
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			Map<String, Object> error = new java.util.HashMap<>();
			error.put("success", false);
			error.put("message", e.getMessage());
			return ResponseEntity.badRequest().body(error);
		}
	}
	
	/**
	 * Cập nhật trạng thái bảng lương
	 * PATCH /api/bangluong/{id}/trang-thai
	 */
	@PatchMapping("/{id}/trang-thai")
	public ResponseEntity<BangLuong> capNhatTrangThai(
			@PathVariable Long id,
			@RequestBody Map<String, String> body) {
		try {
			String trangThai = body.get("trangThai");
			BangLuong updated = service.capNhatTrangThai(id, trangThai);
			return ResponseEntity.ok(updated);
		} catch (Exception e) {
			return ResponseEntity.badRequest().build();
		}
	}

    // merged into list via query param 'trangThai'
}





