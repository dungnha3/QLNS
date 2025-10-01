package QuanLy.QLNS.Repository;

import QuanLy.QLNS.Entity.NghiPhep;
import QuanLy.QLNS.Entity.NhanVien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface NghiPhepRepository extends JpaRepository<NghiPhep, Long> {
    
    // Tìm đơn nghỉ phép theo nhân viên
    List<NghiPhep> findByNhanVien(NhanVien nhanVien);
    
    // Tìm theo trạng thái
    @Query("SELECT n FROM NghiPhep n WHERE n.trangThai = :trangThai")
    List<NghiPhep> findByTrangThai(@Param("trangThai") String trangThai);
    
    // Tìm đơn chờ duyệt
    @Query("SELECT n FROM NghiPhep n WHERE n.trangThai = 'CHO_DUYET' ORDER BY n.ngayTao ASC")
    List<NghiPhep> findDonChoDuyet();
    
    // Tìm theo nhân viên và trạng thái
    @Query("SELECT n FROM NghiPhep n WHERE n.nhanVien = :nhanVien AND n.trangThai = :trangThai")
    List<NghiPhep> findByNhanVienAndTrangThai(@Param("nhanVien") NhanVien nhanVien, @Param("trangThai") String trangThai);
    
    // Tìm theo loại nghỉ
    @Query("SELECT n FROM NghiPhep n WHERE n.loaiNghi = :loaiNghi")
    List<NghiPhep> findByLoaiNghi(@Param("loaiNghi") String loaiNghi);
    
    // Tìm đơn nghỉ trong khoảng thời gian
    @Query("SELECT n FROM NghiPhep n WHERE " +
           "(n.ngayBatDau BETWEEN :startDate AND :endDate) OR " +
           "(n.ngayKetThuc BETWEEN :startDate AND :endDate)")
    List<NghiPhep> findByNgayBetween(@Param("startDate") LocalDate startDate,
                                      @Param("endDate") LocalDate endDate);
    
    // Tính tổng số ngày nghỉ của nhân viên trong năm
    @Query("SELECT SUM(n.soNgayNghi) FROM NghiPhep n WHERE n.nhanVien = :nhanVien " +
           "AND YEAR(n.ngayBatDau) = :year AND n.trangThai = 'DA_DUYET'")
    Integer getTongNgayNghiTrongNam(@Param("nhanVien") NhanVien nhanVien, @Param("year") int year);
    
    // Tính số ngày nghỉ phép năm đã dùng
    @Query("SELECT SUM(n.soNgayNghi) FROM NghiPhep n WHERE n.nhanVien = :nhanVien " +
           "AND n.loaiNghi = 'PHEP_NAM' AND YEAR(n.ngayBatDau) = :year AND n.trangThai = 'DA_DUYET'")
    Integer getSoNgayPhepDaDung(@Param("nhanVien") NhanVien nhanVien, @Param("year") int year);
    
    // Tìm đơn nghỉ theo người duyệt
    @Query("SELECT n FROM NghiPhep n WHERE n.nguoiDuyet = :nguoiDuyet")
    List<NghiPhep> findByNguoiDuyet(@Param("nguoiDuyet") NhanVien nguoiDuyet);
}