package QuanLy.QLNS.Repository;

import QuanLy.QLNS.Entity.TaiKhoan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface TaiKhoanRepository extends JpaRepository<TaiKhoan, Long> {
    
    // Tìm theo tên đăng nhập
    @Query("SELECT t FROM TaiKhoan t WHERE t.ten_dangnhap = :tenDangnhap")
    Optional<TaiKhoan> findByTenDangnhap(@Param("tenDangnhap") String tenDangnhap);
    
    // Kiểm tra tồn tại tên đăng nhập
    @Query("SELECT COUNT(t) > 0 FROM TaiKhoan t WHERE t.ten_dangnhap = :tenDangnhap")
    boolean existsByTenDangnhap(@Param("tenDangnhap") String tenDangnhap);
    
    // Tìm theo quyền hạn
    @Query("SELECT t FROM TaiKhoan t WHERE t.quyen_han = :quyenHan")
    List<TaiKhoan> findByQuyenHan(@Param("quyenHan") String quyenHan);
}