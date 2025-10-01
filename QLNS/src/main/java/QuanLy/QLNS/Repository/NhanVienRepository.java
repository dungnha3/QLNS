package QuanLy.QLNS.Repository;

import QuanLy.QLNS.Entity.NhanVien;
import QuanLy.QLNS.Entity.PhongBan;
import QuanLy.QLNS.Entity.ChucVu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface NhanVienRepository extends JpaRepository<NhanVien, Long> {
    
    // Tìm theo email
    Optional<NhanVien> findByEmail(String email);
    
    // Tìm theo CCCD
    Optional<NhanVien> findByCccd(String cccd);
    
    // Kiểm tra tồn tại email
    boolean existsByEmail(String email);
    
    // Kiểm tra tồn tại CCCD
    boolean existsByCccd(String cccd);
    
    // Tìm theo phòng ban
    List<NhanVien> findByPhongBan(PhongBan phongBan);
    
    // Tìm theo chức vụ
    List<NhanVien> findByChucVu(ChucVu chucVu);
    
    // Tìm theo trạng thái
    @Query("SELECT n FROM NhanVien n WHERE n.trangThai = :trangThai")
    List<NhanVien> findByTrangThai(@Param("trangThai") String trangThai);
    
    // Tìm theo phòng ban và trạng thái
    @Query("SELECT n FROM NhanVien n WHERE n.phongBan = :phongBan AND n.trangThai = :trangThai")
    List<NhanVien> findByPhongBanAndTrangThai(@Param("phongBan") PhongBan phongBan, @Param("trangThai") String trangThai);
    
    // Tìm kiếm theo tên (LIKE)
    @Query("SELECT n FROM NhanVien n WHERE LOWER(n.ho_ten) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<NhanVien> searchByHoTen(@Param("keyword") String keyword);
    
    // Đếm nhân viên theo phòng ban
    long countByPhongBan(PhongBan phongBan);
    
    // Tìm nhân viên vào làm trong khoảng thời gian
    @Query("SELECT n FROM NhanVien n WHERE n.ngay_vao_lam BETWEEN :startDate AND :endDate")
    List<NhanVien> findByNgayVaoLamBetween(@Param("startDate") LocalDate startDate, 
                                           @Param("endDate") LocalDate endDate);
    
    // Tìm nhân viên theo giới tính
    @Query("SELECT n FROM NhanVien n WHERE n.gioi_tinh = :gioiTinh")
    List<NhanVien> findByGioiTinh(@Param("gioiTinh") String gioiTinh);
}