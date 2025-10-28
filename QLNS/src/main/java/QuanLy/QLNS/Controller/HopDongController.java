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
import QuanLy.QLNS.Service.HopDongService;

@RestController
@RequestMapping(value = "/api/hopdong", produces = "application/json;charset=UTF-8")
public class HopDongController {

	private final HopDongService service;

	public HopDongController(HopDongService service) {
		this.service = service;
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
	public ResponseEntity<HopDong> create(@RequestBody HopDong body) {
		HopDong created = service.create(body);
		return ResponseEntity.created(URI.create("/api/hopdong/" + created.getHopdong_id())).body(created);
	}

	@PutMapping("/{id}")
	public ResponseEntity<HopDong> update(@PathVariable Long id, @RequestBody HopDong body) {
		return ResponseEntity.ok(service.update(id, body));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		service.delete(id);
		return ResponseEntity.noContent().build();
	}
}










