package QuanLy.QLNS.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import QuanLy.QLNS.Entity.TaiKhoan;

public interface TaiKhoanService {
    
    // CRUD operations
    TaiKhoan save(TaiKhoan taiKhoan);
    Optional<TaiKhoan> findById(Long id);
    List<TaiKhoan> findAll();
    void deleteById(Long id);
    TaiKhoan update(Long id, TaiKhoan taiKhoan);
    
    // Pagination
    Page<TaiKhoan> findAll(Pageable pageable);
    
    // Search operations
    Optional<TaiKhoan> findByTenDangnhap(String tenDangnhap);
    List<TaiKhoan> findByQuyenHan(String quyenHan);
    boolean existsByTenDangnhap(String tenDangnhap);
    
    // Statistics
    long count();
    long countByQuyenHan(String quyenHan);
}

