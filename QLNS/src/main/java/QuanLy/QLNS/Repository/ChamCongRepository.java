package QuanLy.QLNS.Repository;

import QuanLy.QLNS.Entity.ChamCong;
import QuanLy.QLNS.Entity.NhanVien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ChamCongRepository extends JpaRepository<ChamCong, Long>, JpaSpecificationExecutor<ChamCong> {
    
    // Tìm chấm công theo nhân viên
    List<ChamCong> findByNhanVien(NhanVien nhanVien);
    
    // Tìm chấm công theo nhân viên và ngày
    @Query("SELECT c FROM ChamCong c WHERE c.nhanVien = :nhanVien AND c.ngay_lam = :ngay_lam")
    Optional<ChamCong> findByNhanVienAndNgayLam(@Param("nhanVien") NhanVien nhanVien, @Param("ngay_lam") LocalDate ngay_lam);
    
    // Tìm chấm công theo nhân viên trong khoảng thời gian
    @Query("SELECT c FROM ChamCong c WHERE c.nhanVien = :nhanVien AND c.ngay_lam BETWEEN :startDate AND :endDate")
    List<ChamCong> findByNhanVienAndNgayLamBetween(@Param("nhanVien") NhanVien nhanVien,
                                                      @Param("startDate") LocalDate startDate,
                                                      @Param("endDate") LocalDate endDate);
    
    // Tìm theo loại ca
    List<ChamCong> findByLoaiCa(String loaiCa);
    
    // Tính tổng giờ làm của nhân viên trong tháng
    @Query("SELECT SUM(c.tongGioLam) FROM ChamCong c WHERE c.nhanVien = :nhanVien " +
           "AND MONTH(c.ngay_lam) = :month AND YEAR(c.ngay_lam) = :year")
    Double getTongGioLamThang(@Param("nhanVien") NhanVien nhanVien,
                              @Param("month") int month,
                              @Param("year") int year);
    
    // Đếm số ngày làm việc trong tháng
    @Query("SELECT COUNT(c) FROM ChamCong c WHERE c.nhanVien = :nhanVien " +
           "AND MONTH(c.ngay_lam) = :month AND YEAR(c.ngay_lam) = :year")
    long countNgayLamThang(@Param("nhanVien") NhanVien nhanVien,
                           @Param("month") int month,
                           @Param("year") int year);
}