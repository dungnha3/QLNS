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

import QuanLy.QLNS.Entity.ChamCong;
import QuanLy.QLNS.Service.ChamCongService;

@RestController
@RequestMapping("/api/chamcong")
public class ChamCongController {

	private final ChamCongService service;

	public ChamCongController(ChamCongService service) {
		this.service = service;
	}

	@GetMapping
	public ResponseEntity<Page<ChamCong>> list(@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size) {
		Pageable pageable = PageRequest.of(page, size);
		return ResponseEntity.ok(service.getAll(pageable));
	}

	@GetMapping("/{id}")
	public ResponseEntity<ChamCong> get(@PathVariable Long id) {
		return service.getById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
	}

	@PostMapping
	public ResponseEntity<ChamCong> create(@RequestBody ChamCong body) {
		ChamCong created = service.create(body);
		return ResponseEntity.created(URI.create("/api/chamcong/" + created.getChamcong_id())).body(created);
	}

	@PutMapping("/{id}")
	public ResponseEntity<ChamCong> update(@PathVariable Long id, @RequestBody ChamCong body) {
		return ResponseEntity.ok(service.update(id, body));
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










