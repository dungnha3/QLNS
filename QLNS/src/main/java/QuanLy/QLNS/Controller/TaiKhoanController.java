package QuanLy.QLNS.Controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import QuanLy.QLNS.Entity.TaiKhoan;
import QuanLy.QLNS.Service.TaiKhoanService;

@RestController
@RequestMapping("/api/tai-khoan")
@CrossOrigin(origins = "*")
public class TaiKhoanController {
    
    @Autowired
    private TaiKhoanService taiKhoanService;
    
    // Tạo tài khoản mới
    @PostMapping
    public ResponseEntity<TaiKhoan> createTaiKhoan(@RequestBody TaiKhoan taiKhoan) {
        try {
            // Kiểm tra tên đăng nhập đã tồn tại chưa
            if (taiKhoanService.existsByTenDangnhap(taiKhoan.getTen_dangnhap())) {
                return ResponseEntity.badRequest().build();
            }
            TaiKhoan savedTaiKhoan = taiKhoanService.save(taiKhoan);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedTaiKhoan);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Lấy tất cả tài khoản
    @GetMapping
    public ResponseEntity<List<TaiKhoan>> getAllTaiKhoan() {
        List<TaiKhoan> taiKhoans = taiKhoanService.findAll();
        return ResponseEntity.ok(taiKhoans);
    }
    
    // Lấy tài khoản theo ID
    @GetMapping("/{id}")
    public ResponseEntity<TaiKhoan> getTaiKhoanById(@PathVariable Long id) {
        Optional<TaiKhoan> taiKhoan = taiKhoanService.findById(id);
        return taiKhoan.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }
    
    // Cập nhật tài khoản
    @PutMapping("/{id}")
    public ResponseEntity<TaiKhoan> updateTaiKhoan(@PathVariable Long id, @RequestBody TaiKhoan taiKhoan) {
        try {
            TaiKhoan updatedTaiKhoan = taiKhoanService.update(id, taiKhoan);
            return ResponseEntity.ok(updatedTaiKhoan);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    // Xóa tài khoản
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTaiKhoan(@PathVariable Long id) {
        try {
            taiKhoanService.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Phân trang
    @GetMapping("/page")
    public ResponseEntity<Page<TaiKhoan>> getTaiKhoanPage(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "taikhoan_id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                   Sort.by(sortBy).descending() : 
                   Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<TaiKhoan> taiKhoanPage = taiKhoanService.findAll(pageable);
        return ResponseEntity.ok(taiKhoanPage);
    }
    
    // Tìm kiếm theo tên đăng nhập
    @GetMapping("/search/ten-dang-nhap")
    public ResponseEntity<TaiKhoan> getTaiKhoanByTenDangnhap(@RequestParam String tenDangnhap) {
        Optional<TaiKhoan> taiKhoan = taiKhoanService.findByTenDangnhap(tenDangnhap);
        return taiKhoan.map(ResponseEntity::ok)
                      .orElse(ResponseEntity.notFound().build());
    }
    
    // Tìm kiếm theo quyền hạn
    @GetMapping("/search/quyen-han")
    public ResponseEntity<List<TaiKhoan>> getTaiKhoanByQuyenHan(@RequestParam String quyenHan) {
        List<TaiKhoan> taiKhoans = taiKhoanService.findByQuyenHan(quyenHan);
        return ResponseEntity.ok(taiKhoans);
    }
    
    // Kiểm tra tên đăng nhập tồn tại
    @GetMapping("/check/ten-dang-nhap")
    public ResponseEntity<Boolean> checkTenDangnhapExists(@RequestParam String tenDangnhap) {
        boolean exists = taiKhoanService.existsByTenDangnhap(tenDangnhap);
        return ResponseEntity.ok(exists);
    }
    
    // Thống kê
    @GetMapping("/stats/count")
    public ResponseEntity<Long> getTotalCount() {
        long count = taiKhoanService.count();
        return ResponseEntity.ok(count);
    }
    
    @GetMapping("/stats/count-by-quyen-han")
    public ResponseEntity<Long> getCountByQuyenHan(@RequestParam String quyenHan) {
        long count = taiKhoanService.countByQuyenHan(quyenHan);
        return ResponseEntity.ok(count);
    }
}

