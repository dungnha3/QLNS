package QuanLy.QLNS.Repository;

import QuanLy.QLNS.Entity.HopDong;
import QuanLy.QLNS.Entity.NhanVien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface HopDongRepository extends JpaRepository<HopDong, Long> {
    
    // Tìm hợp đồng theo nhân viên
    List<HopDong> findByNhanVien(NhanVien nhanVien);
    
    // Tìm hợp đồng đang hiệu lực của nhân viên
    @Query("SELECT h FROM HopDong h WHERE h.nhanVien = :nhanVien AND h.trangThai = 'CON_HIEU_LUC'")
    Optional<HopDong> findActiveHopDongByNhanVien(@Param("nhanVien") NhanVien nhanVien);
    
    // Tìm theo loại hợp đồng
    @Query("SELECT h FROM HopDong h WHERE h.loai_hopdong = :loaiHopdong")
    List<HopDong> findByLoaiHopdong(@Param("loaiHopdong") String loaiHopdong);
    
    // Tìm theo trạng thái
    @Query("SELECT h FROM HopDong h WHERE h.trangThai = :trangThai")
    List<HopDong> findByTrangThai(@Param("trangThai") String trangThai);
    
    // Tìm hợp đồng sắp hết hạn
    @Query("SELECT h FROM HopDong h WHERE h.ngay_ketthuc BETWEEN :startDate AND :endDate AND h.trangThai = 'CON_HIEU_LUC'")
    List<HopDong> findHopDongSapHetHan(@Param("startDate") LocalDate startDate, 
                                        @Param("endDate") LocalDate endDate);
    
    // Đếm hợp đồng theo loại
    @Query("SELECT COUNT(h) FROM HopDong h WHERE h.loai_hopdong = :loaiHopdong")
    long countByLoaiHopdong(@Param("loaiHopdong") String loaiHopdong);
    
    // Tìm hợp đồng theo nhân viên và trạng thái
    @Query("SELECT h FROM HopDong h WHERE h.nhanVien = :nhanVien AND h.trangThai = :trangThai")
    List<HopDong> findByNhanVienAndTrangThai(@Param("nhanVien") NhanVien nhanVien, @Param("trangThai") String trangThai);
}
