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

import QuanLy.QLNS.Entity.DanhGia;
import QuanLy.QLNS.Service.DanhGiaService;

@RestController
@RequestMapping("/api/danhgia")
public class DanhGiaController {

	private final DanhGiaService service;

	public DanhGiaController(DanhGiaService service) {
		this.service = service;
	}

	@GetMapping
	public ResponseEntity<Page<DanhGia>> list(@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size) {
		Pageable pageable = PageRequest.of(page, size);
		return ResponseEntity.ok(service.getAll(pageable));
	}

	@GetMapping("/{id}")
	public ResponseEntity<DanhGia> get(@PathVariable Long id) {
		return service.getById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
	}

	@PostMapping
	public ResponseEntity<DanhGia> create(@RequestBody DanhGia body) {
		DanhGia created = service.create(body);
		return ResponseEntity.created(URI.create("/api/danhgia/" + created.getDanhgia_id())).body(created);
	}

	@PutMapping("/{id}")
	public ResponseEntity<DanhGia> update(@PathVariable Long id, @RequestBody DanhGia body) {
		return ResponseEntity.ok(service.update(id, body));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		service.delete(id);
		return ResponseEntity.noContent().build();
	}

	@GetMapping("/by-ky")
	public ResponseEntity<?> byKy(@RequestParam Long nhanVienId,
			@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate ky) {
		return ResponseEntity.ok().build();
	}
}










