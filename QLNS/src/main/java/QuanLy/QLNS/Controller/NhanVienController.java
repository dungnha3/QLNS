package QuanLy.QLNS.Controller;

import java.net.URI;
import java.util.List;
import java.util.Optional;

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

import QuanLy.QLNS.Entity.NhanVien;
import QuanLy.QLNS.Service.NhanVienService;

@RestController
@RequestMapping(value = "/api/nhanvien", produces = "application/json;charset=UTF-8")
public class NhanVienController {

	private final NhanVienService nhanVienService;

	public NhanVienController(NhanVienService nhanVienService) {
		this.nhanVienService = nhanVienService;
	}

	@GetMapping
	public ResponseEntity<Page<NhanVien>> list(
			@RequestParam(defaultValue = "0") int page,
			@RequestParam(defaultValue = "10") int size) {
		Pageable pageable = PageRequest.of(page, size);
		return ResponseEntity.ok(nhanVienService.getAll(pageable));
	}

	@GetMapping("/{id}")
	public ResponseEntity<NhanVien> get(@PathVariable Long id) {
		Optional<NhanVien> nv = nhanVienService.getById(id);
		return nv.map(ResponseEntity::ok)
				.orElse(ResponseEntity.notFound().build());
	}

	@PostMapping
	public ResponseEntity<NhanVien> create(@RequestBody NhanVien nhanVien) {
		NhanVien created = nhanVienService.create(nhanVien);
		return ResponseEntity.created(URI.create("/api/nhanvien/" + created.getNhanvien_id()))
				.body(created);
	}

	@PutMapping("/{id}")
	public ResponseEntity<NhanVien> update(@PathVariable Long id, @RequestBody NhanVien nhanVien) {
		NhanVien updated = nhanVienService.update(id, nhanVien);
		return ResponseEntity.ok(updated);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		nhanVienService.delete(id);
		return ResponseEntity.noContent().build();
	}

	@GetMapping("/search")
	public ResponseEntity<List<NhanVien>> search(@RequestParam("q") String keyword) {
		return ResponseEntity.ok(nhanVienService.searchByHoTen(keyword));
	}
}



