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

import QuanLy.QLNS.Entity.NghiPhep;
import QuanLy.QLNS.Entity.NhanVien;
import QuanLy.QLNS.Service.NghiPhepService;
import QuanLy.QLNS.Service.NhanVienService;
import QuanLy.QLNS.dto.ApprovalRequest;
import QuanLy.QLNS.dto.CreateNghiPhepRequest;
import QuanLy.QLNS.dto.UpdateNghiPhepRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping(value = "/api/nghiphep", produces = "application/json;charset=UTF-8")
public class NghiPhepController {

	private final NghiPhepService service;
	private final NhanVienService nhanVienService;

	public NghiPhepController(NghiPhepService service, NhanVienService nhanVienService) {
		this.service = service;
		this.nhanVienService = nhanVienService;
	}

    @GetMapping
    public ResponseEntity<Page<NghiPhep>> list(@RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String trangThai) {
        Pageable pageable = PageRequest.of(page, size);
        if (trangThai != null && !trangThai.isBlank()) {
            return ResponseEntity.ok(service.findByTrangThai(trangThai, pageable));
        }
        return ResponseEntity.ok(service.getAll(pageable));
    }

	@GetMapping("/{id}")
	public ResponseEntity<NghiPhep> get(@PathVariable Long id) {
		return service.getById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
	}

	@PostMapping
	public ResponseEntity<NghiPhep> create(@Valid @RequestBody CreateNghiPhepRequest request) {
		// Tìm nhân viên
		NhanVien nhanVien = nhanVienService.getById(request.getNhanVien())
				.orElseThrow(() -> new IllegalArgumentException("Nhân viên không tồn tại: " + request.getNhanVien()));
		
		// Tạo entity NghiPhep
		NghiPhep nghiPhep = new NghiPhep();
		nghiPhep.setNhanVien(nhanVien);
		nghiPhep.setLoaiNghi(request.getLoaiNghi());
		nghiPhep.setNgayBatDau(request.getNgayBatDau());
		nghiPhep.setNgayKetThuc(request.getNgayKetThuc());
		nghiPhep.setSoNgayNghi(request.getSoNgayNghi());
		nghiPhep.setLyDo(request.getLyDo());
		nghiPhep.setTrangThai(request.getTrangThai() != null ? request.getTrangThai() : "CHO_DUYET");
		
		// Nếu có người duyệt
		if (request.getNguoiDuyet() != null) {
			NhanVien nguoiDuyet = nhanVienService.getById(request.getNguoiDuyet())
					.orElseThrow(() -> new IllegalArgumentException("Người duyệt không tồn tại: " + request.getNguoiDuyet()));
			nghiPhep.setNguoiDuyet(nguoiDuyet);
		}
		
		NghiPhep created = service.create(nghiPhep);
		return ResponseEntity.created(URI.create("/api/nghiphep/" + created.getNghiphep_id())).body(created);
	}

	@PutMapping("/{id}")
	public ResponseEntity<NghiPhep> update(@PathVariable Long id, @Valid @RequestBody UpdateNghiPhepRequest request) {
		NghiPhep existing = service.getById(id)
				.orElseThrow(() -> new IllegalArgumentException("Nghỉ phép không tồn tại: " + id));
		
		// Update fields
		if (request.getLoaiNghi() != null) existing.setLoaiNghi(request.getLoaiNghi());
		if (request.getNgayBatDau() != null) existing.setNgayBatDau(request.getNgayBatDau());
		if (request.getNgayKetThuc() != null) existing.setNgayKetThuc(request.getNgayKetThuc());
		if (request.getSoNgayNghi() != null) existing.setSoNgayNghi(request.getSoNgayNghi());
		if (request.getLyDo() != null) existing.setLyDo(request.getLyDo());
		if (request.getTrangThai() != null) existing.setTrangThai(request.getTrangThai());
		if (request.getGhiChuDuyet() != null) existing.setGhiChuDuyet(request.getGhiChuDuyet());
		
		// Update nhân viên nếu có
		if (request.getNhanVien() != null) {
			NhanVien nhanVien = nhanVienService.getById(request.getNhanVien())
					.orElseThrow(() -> new IllegalArgumentException("Nhân viên không tồn tại: " + request.getNhanVien()));
			existing.setNhanVien(nhanVien);
		}
		
		// Update người duyệt nếu có
		if (request.getNguoiDuyet() != null) {
			NhanVien nguoiDuyet = nhanVienService.getById(request.getNguoiDuyet())
					.orElseThrow(() -> new IllegalArgumentException("Người duyệt không tồn tại: " + request.getNguoiDuyet()));
			existing.setNguoiDuyet(nguoiDuyet);
		}
		
		return ResponseEntity.ok(service.update(id, existing));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		service.delete(id);
		return ResponseEntity.noContent().build();
	}
	
	/**
	 * Phê duyệt hoặc từ chối đơn nghỉ phép
	 * POST /api/nghiphep/{id}/phe-duyet
	 */
	@PostMapping("/{id}/phe-duyet")
	public ResponseEntity<NghiPhep> pheDuyet(
			@PathVariable Long id,
			@RequestBody ApprovalRequest request) {
		try {
			NghiPhep result = service.pheDuyet(
				id, 
				request.getNguoiDuyetId(), 
				request.getTrangThai(), 
				request.getGhiChu()
			);
			return ResponseEntity.ok(result);
		} catch (IllegalArgumentException | IllegalStateException e) {
			return ResponseEntity.badRequest().build();
		}
	}

    // merged into list via query param 'trangThai'
}










