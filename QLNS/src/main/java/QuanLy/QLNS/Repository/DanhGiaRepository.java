package QuanLy.QLNS.Repository;

import QuanLy.QLNS.Entity.DanhGia;
import QuanLy.QLNS.Entity.NhanVien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DanhGiaRepository extends JpaRepository<DanhGia, Long> {
    
    // Tìm đánh giá theo nhân viên
    List<DanhGia> findByNhanVien(NhanVien nhanVien);
    
    // Tìm đánh giá theo người đánh giá
    List<DanhGia> findByNguoiDanhGia(NhanVien nguoiDanhGia);
    
    // Tìm theo loại đánh giá
    @Query("SELECT d FROM DanhGia d WHERE d.loaiDanhGia = :loaiDanhGia")
    List<DanhGia> findByLoaiDanhGia(@Param("loaiDanhGia") String loaiDanhGia);
    
    // Tìm theo xếp loại
    @Query("SELECT d FROM DanhGia d WHERE d.xepLoai = :xepLoai")
    List<DanhGia> findByXepLoai(@Param("xepLoai") String xepLoai);
    
    // Tìm đánh giá của nhân viên theo kỳ
    @Query("SELECT d FROM DanhGia d WHERE d.nhanVien = :nhanVien AND d.kyDanhGia = :kyDanhGia")
    Optional<DanhGia> findByNhanVienAndKyDanhGia(@Param("nhanVien") NhanVien nhanVien, @Param("kyDanhGia") LocalDate kyDanhGia);
    
    // Tìm đánh giá trong khoảng thời gian
    @Query("SELECT d FROM DanhGia d WHERE d.kyDanhGia BETWEEN :startDate AND :endDate")
    List<DanhGia> findByKyDanhGiaBetween(@Param("startDate") LocalDate startDate,
                                         @Param("endDate") LocalDate endDate);
    
    // Tính điểm trung bình của nhân viên
    @Query("SELECT AVG(d.diemTrungBinh) FROM DanhGia d WHERE d.nhanVien = :nhanVien")
    Double getAverageDiemTrungBinh(@Param("nhanVien") NhanVien nhanVien);
    
    // Đếm số lần được đánh giá xuất sắc
    @Query("SELECT COUNT(d) FROM DanhGia d WHERE d.nhanVien = :nhanVien AND d.xepLoai = 'XUAT_SAC'")
    long countXuatSac(@Param("nhanVien") NhanVien nhanVien);
    
    // Tìm nhân viên có điểm cao nhất trong kỳ
    @Query("SELECT d FROM DanhGia d WHERE d.kyDanhGia = :kyDanhGia ORDER BY d.diemTrungBinh DESC")
    List<DanhGia> findTopPerformers(@Param("kyDanhGia") LocalDate kyDanhGia);
    
    // Đếm đánh giá theo xếp loại trong kỳ
    @Query("SELECT COUNT(d) FROM DanhGia d WHERE d.kyDanhGia = :kyDanhGia AND d.xepLoai = :xepLoai")
    long countByKyAndXepLoai(@Param("kyDanhGia") LocalDate kyDanhGia, @Param("xepLoai") String xepLoai);
}