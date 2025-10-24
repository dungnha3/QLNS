package QuanLy.QLNS.Controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import QuanLy.QLNS.Repository.BangLuongRepository;
import QuanLy.QLNS.Repository.ChucVuRepository;
import QuanLy.QLNS.Repository.HopDongRepository;
import QuanLy.QLNS.Repository.NghiPhepRepository;
import QuanLy.QLNS.Repository.NhanVienRepository;
import QuanLy.QLNS.Repository.PhongBanRepository;
import QuanLy.QLNS.dto.DashboardResponse;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {
    
    private final NhanVienRepository nhanVienRepo;
    private final PhongBanRepository phongBanRepo;
    private final ChucVuRepository chucVuRepo;
    private final NghiPhepRepository nghiPhepRepo;
    private final BangLuongRepository bangLuongRepo;
    private final HopDongRepository hopDongRepo;
    
    public DashboardController(
            NhanVienRepository nhanVienRepo,
            PhongBanRepository phongBanRepo,
            ChucVuRepository chucVuRepo,
            NghiPhepRepository nghiPhepRepo,
            BangLuongRepository bangLuongRepo,
            HopDongRepository hopDongRepo) {
        this.nhanVienRepo = nhanVienRepo;
        this.phongBanRepo = phongBanRepo;
        this.chucVuRepo = chucVuRepo;
        this.nghiPhepRepo = nghiPhepRepo;
        this.bangLuongRepo = bangLuongRepo;
        this.hopDongRepo = hopDongRepo;
    }
    
    /**
     * Lấy tổng quan hệ thống
     * GET /api/dashboard/tong-quan
     */
    @GetMapping("/tong-quan")
    public ResponseEntity<DashboardResponse> getTongQuan() {
        DashboardResponse response = new DashboardResponse();
        
        // Tổng số nhân viên
        response.setTongNhanVien(nhanVienRepo.count());
        
        // Nhân viên đang làm việc
        response.setNhanVienDangLam(nhanVienRepo.countByTrangThai("DANG_LAM_VIEC"));
        
        // Nhân viên nghỉ việc
        response.setNhanVienNghiViec(nhanVienRepo.countByTrangThai("NGHI_VIEC"));
        
        // Tổng phòng ban
        response.setTongPhongBan(phongBanRepo.count());
        
        // Tổng chức vụ
        response.setTongChucVu(chucVuRepo.count());
        
        // Đơn nghỉ phép chờ xử lý
        response.setDonNghiPhepChoXuLy(nghiPhepRepo.countByTrangThai("CHO_DUYET"));
        
        // Bảng lương chờ xử lý
        response.setBangLuongChoXuLy(bangLuongRepo.countByTrangThai("CHO_DUYET"));
        
        // Hợp đồng hết hạn (trong 30 ngày tới)
        response.setHopDongHetHan(hopDongRepo.countExpiringContracts(30));
        
        return ResponseEntity.ok(response);
    }
}
