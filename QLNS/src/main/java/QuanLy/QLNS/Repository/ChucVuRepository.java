package QuanLy.QLNS.Repository;

import QuanLy.QLNS.Entity.ChucVu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ChucVuRepository extends JpaRepository<ChucVu, Long> {
    
    // Tìm theo tên chức vụ
    @Query("SELECT c FROM ChucVu c WHERE c.ten_chucvu = :tenChucvu")
    Optional<ChucVu> findByTenChucvu(@Param("tenChucvu") String tenChucvu);
}