package QuanLy.QLNS.Repository;

import QuanLy.QLNS.Entity.PhongBan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface PhongBanRepository extends JpaRepository<PhongBan, Long> {
    
    // Tìm theo tên phòng ban
    @Query("SELECT p FROM PhongBan p WHERE p.ten_phongban = :tenPhongban")
    Optional<PhongBan> findByTenPhongban(@Param("tenPhongban") String tenPhongban);
    
    // Tìm theo địa điểm
    @Query("SELECT p FROM PhongBan p WHERE p.dia_diem = :diaDiem")
    List<PhongBan> findByDiaDiem(@Param("diaDiem") String diaDiem);
    
    // Đếm số phòng ban theo địa điểm
    @Query("SELECT COUNT(p) FROM PhongBan p WHERE p.dia_diem = :diaDiem")
    long countByDiaDiem(@Param("diaDiem") String diaDiem);
}