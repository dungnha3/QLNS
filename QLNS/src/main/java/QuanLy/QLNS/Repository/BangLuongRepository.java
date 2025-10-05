package QuanLy.QLNS.Repository;

import QuanLy.QLNS.Entity.BangLuong;
import QuanLy.QLNS.Entity.NhanVien;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BangLuongRepository extends JpaRepository<BangLuong, Long> {
    
    // Tìm bảng lương theo nhân viên
    List<BangLuong> findByNhanVien(NhanVien nhanVien);
    
    // Tìm bảng lương theo tháng năm
    List<BangLuong> findByThangAndNam(int thang, int nam);
    
    // Tìm bảng lương của nhân viên theo tháng năm
    Optional<BangLuong> findByNhanVienAndThangAndNam(NhanVien nhanVien, int thang, int nam);
    
    // Tìm theo trạng thái
    @Query("SELECT b FROM BangLuong b WHERE b.trangThai = :trangThai")
    List<BangLuong> findByTrangThai(@Param("trangThai") String trangThai);

    @Query("SELECT b FROM BangLuong b WHERE b.trangThai = :trangThai")
    Page<BangLuong> findByTrangThai(@Param("trangThai") String trangThai, Pageable pageable);
    
    // Tìm bảng lương chưa thanh toán
    @Query("SELECT b FROM BangLuong b WHERE b.trangThai IN ('CHO_DUYET', 'DA_DUYET')")
    List<BangLuong> findChuaThanhToan();
    
    // Tính tổng lương đã thanh toán trong tháng
    @Query("SELECT SUM(CAST(b.thuc_lanh AS double)) FROM BangLuong b " +
           "WHERE b.thang = :thang AND b.nam = :nam AND b.trangThai = 'DA_THANH_TOAN'")
    Double getTongLuongThanhToanThang(@Param("thang") int thang, @Param("nam") int nam);
    
    // Đếm số bảng lương theo trạng thái
    @Query("SELECT COUNT(b) FROM BangLuong b WHERE b.trangThai = :trangThai")
    long countByTrangThai(@Param("trangThai") String trangThai);
}