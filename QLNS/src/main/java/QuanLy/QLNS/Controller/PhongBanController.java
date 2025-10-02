package QuanLy.QLNS.Controller;

import java.net.URI;
import java.util.List;

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

import QuanLy.QLNS.Entity.PhongBan;
import QuanLy.QLNS.Service.PhongBanService;

@RestController
@RequestMapping("/api/phongban")
public class PhongBanController {

	private final PhongBanService service;

	public PhongBanController(PhongBanService service) {
		this.service = service;
	}

	@GetMapping
	public ResponseEntity<Page<PhongBan>> list(@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size) {
		Pageable pageable = PageRequest.of(page, size);
		return ResponseEntity.ok(service.getAll(pageable));
	}

	@GetMapping("/{id}")
	public ResponseEntity<PhongBan> get(@PathVariable Long id) {
		return service.getById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
	}

	@PostMapping
	public ResponseEntity<PhongBan> create(@RequestBody PhongBan body) {
		PhongBan created = service.create(body);
		return ResponseEntity.created(URI.create("/api/phongban/" + created.getPhongban_id())).body(created);
	}

	@PutMapping("/{id}")
	public ResponseEntity<PhongBan> update(@PathVariable Long id, @RequestBody PhongBan body) {
		return ResponseEntity.ok(service.update(id, body));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		service.delete(id);
		return ResponseEntity.noContent().build();
	}

	@GetMapping("/by-dia-diem")
	public ResponseEntity<List<PhongBan>> byDiaDiem(@RequestParam String diaDiem) {
		return ResponseEntity.ok(service.findByDiaDiem(diaDiem));
	}
}






