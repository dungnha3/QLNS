package QuanLy.QLNS.Controller;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import QuanLy.QLNS.Entity.NhanVien;
import QuanLy.QLNS.Entity.TaiKhoan;
import QuanLy.QLNS.Service.NhanVienService;
import QuanLy.QLNS.Service.TaiKhoanService;
import QuanLy.QLNS.dto.ApiResponse;
import QuanLy.QLNS.dto.CreateAccountWithEmployeeRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping(value = "/api/tai-khoan", produces = "application/json;charset=UTF-8")
@CrossOrigin(origins = "*")
public class TaiKhoanController {
    
    private final TaiKhoanService taiKhoanService;
    private final NhanVienService nhanVienService;
    private final PasswordEncoder passwordEncoder;
    
    public TaiKhoanController(TaiKhoanService taiKhoanService, NhanVienService nhanVienService, PasswordEncoder passwordEncoder) {
        this.taiKhoanService = taiKhoanService;
        this.nhanVienService = nhanVienService;
        this.passwordEncoder = passwordEncoder;
    }
    
    // Tạo tài khoản kèm nhân viên (Transaction)
    @PostMapping("/with-employee")
    @org.springframework.transaction.annotation.Transactional
    public ResponseEntity<ApiResponse<NhanVien>> createTaiKhoanWithEmployee(@Valid @RequestBody CreateAccountWithEmployeeRequest request) {
        try {
            // Kiểm tra tên đăng nhập đã tồn tại
            if (taiKhoanService.existsByTenDangnhap(request.getTen_dangnhap())) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Tên đăng nhập đã tồn tại"));
            }
            
            // Kiểm tra email đã tồn tại
            if (nhanVienService.existsByEmail(request.getEmail())) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Email đã tồn tại"));
            }
            
            // Tạo tài khoản
            TaiKhoan taiKhoan = new TaiKhoan();
            taiKhoan.setTen_dangnhap(request.getTen_dangnhap());
            taiKhoan.setMat_khau(passwordEncoder.encode(request.getMat_khau()));
            taiKhoan.setQuyen_han(request.getQuyen_han());
            TaiKhoan savedTaiKhoan = taiKhoanService.save(taiKhoan);
            
            // Tạo nhân viên
            NhanVien nhanVien = new NhanVien();
            nhanVien.setHo_ten(request.getHo_ten());
            nhanVien.setEmail(request.getEmail());
            nhanVien.setGioi_tinh(request.getGioi_tinh() != null ? request.getGioi_tinh() : "Nam");
            nhanVien.setDia_chi(request.getDia_chi());
            nhanVien.setNgay_sinh(request.getNgay_sinh());
            nhanVien.setNgay_vao_lam(request.getNgay_vao_lam());
            nhanVien.setSo_dien_thoai(request.getSo_dien_thoai());
            nhanVien.setCccd(request.getCccd());
            nhanVien.setTrangThai("DANG_LAM_VIEC");
            nhanVien.setTaiKhoan(savedTaiKhoan);
            
            NhanVien savedNhanVien = nhanVienService.save(nhanVien);
            
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Tạo tài khoản và nhân viên thành công", savedNhanVien));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Tạo tài khoản thất bại: " + e.getMessage()));
        }
    }
    
    // Tạo tài khoản mới (chỉ tài khoản)
    @PostMapping
    public ResponseEntity<ApiResponse<TaiKhoan>> createTaiKhoan(@Valid @RequestBody TaiKhoan taiKhoan) {
        try {
            // Kiểm tra tên đăng nhập đã tồn tại chưa
            if (taiKhoanService.existsByTenDangnhap(taiKhoan.getTen_dangnhap())) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Tên đăng nhập đã tồn tại"));
            }
            
            // Mã hóa mật khẩu
            taiKhoan.setMat_khau(passwordEncoder.encode(taiKhoan.getMat_khau()));
            
            TaiKhoan savedTaiKhoan = taiKhoanService.save(taiKhoan);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Tạo tài khoản thành công", savedTaiKhoan));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Tạo tài khoản thất bại: " + e.getMessage()));
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




