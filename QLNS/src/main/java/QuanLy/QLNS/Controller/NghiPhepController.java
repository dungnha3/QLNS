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
import QuanLy.QLNS.Service.NghiPhepService;

@RestController
@RequestMapping("/api/nghiphep")
public class NghiPhepController {

	private final NghiPhepService service;

	public NghiPhepController(NghiPhepService service) {
		this.service = service;
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
	public ResponseEntity<NghiPhep> create(@RequestBody NghiPhep body) {
		NghiPhep created = service.create(body);
		return ResponseEntity.created(URI.create("/api/nghiphep/" + created.getNghiphep_id())).body(created);
	}

	@PutMapping("/{id}")
	public ResponseEntity<NghiPhep> update(@PathVariable Long id, @RequestBody NghiPhep body) {
		return ResponseEntity.ok(service.update(id, body));
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		service.delete(id);
		return ResponseEntity.noContent().build();
	}

    // merged into list via query param 'trangThai'
}










