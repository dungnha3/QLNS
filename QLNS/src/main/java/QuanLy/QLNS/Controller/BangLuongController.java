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
import QuanLy.QLNS.Entity.NhanVien;
import QuanLy.QLNS.Service.BangLuongService;
import QuanLy.QLNS.Service.NhanVienService;
import QuanLy.QLNS.dto.CreateBangLuongRequest;
import QuanLy.QLNS.dto.UpdateBangLuongRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping(value = "/api/bangluong", produces = "application/json;charset=UTF-8")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class BangLuongController {

	private final BangLuongService service;
	private final NhanVienService nhanVienService;

	public BangLuongController(BangLuongService service, NhanVienService nhanVienService) {
		this.service = service;
		this.nhanVienService = nhanVienService;
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
	public ResponseEntity<BangLuong> create(@Valid @RequestBody CreateBangLuongRequest request) {
		// Tìm nhân viên
		NhanVien nhanVien = nhanVienService.getById(request.getNhanVien())
				.orElseThrow(() -> new IllegalArgumentException("Nhân viên không tồn tại: " + request.getNhanVien()));
		
		// Tạo entity BangLuong
		BangLuong bangLuong = new BangLuong();
		bangLuong.setNhanVien(nhanVien);
		bangLuong.setThang(request.getThang());
		bangLuong.setNam(request.getNam());
		bangLuong.setLuong_co_ban(request.getLuong_co_ban());
		bangLuong.setPhu_cap(request.getPhu_cap());
		bangLuong.setKhau_tru(request.getKhau_tru());
		bangLuong.setBhxh(request.getBhxh());
		bangLuong.setBhyt(request.getBhyt());
		bangLuong.setBhtn(request.getBhtn());
		bangLuong.setThueThuNhap(request.getThueThuNhap());
		bangLuong.setTong_cong(request.getTong_cong());
		bangLuong.setThuc_lanh(request.getThuc_lanh());
		bangLuong.setNgayThanhToan(request.getNgayThanhToan());
		bangLuong.setTrangThai(request.getTrangThai() != null ? request.getTrangThai() : "CHO_DUYET");
		
		BangLuong created = service.create(bangLuong);
		return ResponseEntity.created(URI.create("/api/bangluong/" + created.getBangluong_id())).body(created);
	}

	@PutMapping("/{id}")
	public ResponseEntity<BangLuong> update(@PathVariable Long id, @Valid @RequestBody UpdateBangLuongRequest request) {
		BangLuong existing = service.getById(id)
				.orElseThrow(() -> new IllegalArgumentException("Bảng lương không tồn tại: " + id));
		
		// Update fields
		if (request.getThang() != null) existing.setThang(request.getThang());
		if (request.getNam() != null) existing.setNam(request.getNam());
		if (request.getLuong_co_ban() != null) existing.setLuong_co_ban(request.getLuong_co_ban());
		if (request.getPhu_cap() != null) existing.setPhu_cap(request.getPhu_cap());
		if (request.getKhau_tru() != null) existing.setKhau_tru(request.getKhau_tru());
		if (request.getBhxh() != null) existing.setBhxh(request.getBhxh());
		if (request.getBhyt() != null) existing.setBhyt(request.getBhyt());
		if (request.getBhtn() != null) existing.setBhtn(request.getBhtn());
		if (request.getThueThuNhap() != null) existing.setThueThuNhap(request.getThueThuNhap());
		if (request.getTong_cong() != null) existing.setTong_cong(request.getTong_cong());
		if (request.getThuc_lanh() != null) existing.setThuc_lanh(request.getThuc_lanh());
		if (request.getNgayThanhToan() != null) existing.setNgayThanhToan(request.getNgayThanhToan());
		if (request.getTrangThai() != null) existing.setTrangThai(request.getTrangThai());
		
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





