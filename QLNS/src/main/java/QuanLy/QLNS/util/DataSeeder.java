package QuanLy.QLNS.util;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import QuanLy.QLNS.Entity.*;
import QuanLy.QLNS.Repository.*;

@Component
public class DataSeeder implements CommandLineRunner {
    
    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);
    
    private final TaiKhoanRepository taiKhoanRepo;
    private final NhanVienRepository nhanVienRepo;
    private final PhongBanRepository phongBanRepo;
    private final ChucVuRepository chucVuRepo;
    private final HopDongRepository hopDongRepo;
    private final ChamCongRepository chamCongRepo;
    private final PasswordEncoder passwordEncoder;
    
    public DataSeeder(
            TaiKhoanRepository taiKhoanRepo,
            NhanVienRepository nhanVienRepo,
            PhongBanRepository phongBanRepo,
            ChucVuRepository chucVuRepo,
            HopDongRepository hopDongRepo,
            ChamCongRepository chamCongRepo,
            PasswordEncoder passwordEncoder) {
        this.taiKhoanRepo = taiKhoanRepo;
        this.nhanVienRepo = nhanVienRepo;
        this.phongBanRepo = phongBanRepo;
        this.chucVuRepo = chucVuRepo;
        this.hopDongRepo = hopDongRepo;
        this.chamCongRepo = chamCongRepo;
        this.passwordEncoder = passwordEncoder;
    }
    
    @Override
    @Transactional
    public void run(String... args) {
        if (taiKhoanRepo.count() > 0) {
            log.info("Database đã có dữ liệu, bỏ qua seed.");
            return;
        }
        
        log.info("Bắt đầu seed dữ liệu mẫu...");
        
        PhongBan[] phongBans = seedPhongBan();
        ChucVu[] chucVus = seedChucVu();
        NhanVien[] nhanViens = seedNhanVien(phongBans, chucVus);
        seedHopDong(nhanViens);
        seedChamCong(nhanViens[2]);
        
        printSummary();
    }
    
    private PhongBan[] seedPhongBan() {
        PhongBan[] phongBans = {
            phongBanRepo.save(new PhongBan(null, "Phòng Công nghệ thông tin", "Tầng 3, Tòa A",
                "Phụ trách phát triển phần mềm và hệ thống", 10, null)),
            phongBanRepo.save(new PhongBan(null, "Phòng Kế toán", "Tầng 2, Tòa A",
                "Quản lý tài chính và kế toán", 5, null)),
            phongBanRepo.save(new PhongBan(null, "Phòng Nhân sự", "Tầng 1, Tòa A",
                "Quản lý nhân sự và tuyển dụng", 5, null))
        };
        log.info("✓ Đã tạo {} phòng ban", phongBans.length);
        return phongBans;
    }
    
    private ChucVu[] seedChucVu() {
        ChucVu[] chucVus = {
            chucVuRepo.save(new ChucVu(null, null, "Quản lý toàn bộ công ty", "Giám đốc", null, null, null)),
            chucVuRepo.save(new ChucVu(null, null, "Quản lý phòng ban", "Trưởng phòng", null, null, null)),
            chucVuRepo.save(new ChucVu(null, null, "Thực hiện công việc", "Nhân viên", null, null, null)),
            chucVuRepo.save(new ChucVu(null, null, "Học tập và hỗ trợ", "Thực tập sinh", null, null, null))
        };
        log.info("✓ Đã tạo {} chức vụ", chucVus.length);
        return chucVus;
    }
    
    private NhanVien[] seedNhanVien(PhongBan[] phongBans, ChucVu[] chucVus) {
        TaiKhoan tkAdmin = createTaiKhoan("admin", "Admin@123456", "ADMIN");
        NhanVien nvAdmin = createNhanVien("Nguyễn Văn Admin", "admin@qlns.com", "0901234567", 
            "Hà Nội", "Nam", LocalDate.of(1985, 1, 1), LocalDate.of(2020, 1, 1), 
            "001085001234", phongBans[2], chucVus[0], tkAdmin);
        log.info("✓ Tài khoản admin (admin / Admin@123456)");
        
        TaiKhoan tkManager = createTaiKhoan("manager", "Manager@123", "MANAGER");
        NhanVien nvManager = createNhanVien("Trần Thị Hương", "huong.tran@qlns.com", "0912345678",
            "Hà Nội", "Nữ", LocalDate.of(1990, 5, 15), LocalDate.of(2021, 6, 1),
            "001090005432", phongBans[0], chucVus[1], tkManager);
        log.info("✓ Tài khoản manager (manager / Manager@123)");
        
        TaiKhoan tkEmployee = createTaiKhoan("employee", "Employee@123", "EMPLOYEE");
        NhanVien nvEmployee = createNhanVien("Lê Minh Tuấn", "tuan.le@qlns.com", "0923456789",
            "Hồ Chí Minh", "Nam", LocalDate.of(1995, 8, 20), LocalDate.of(2022, 3, 15),
            "001095008765", phongBans[0], chucVus[2], tkEmployee);
        log.info("✓ Tài khoản employee (employee / Employee@123)");
        
        NhanVien nvKeToan = createNhanVien("Phạm Thu Hà", "ha.pham@qlns.com", "0934567890",
            "Đà Nẵng", "Nữ", LocalDate.of(1992, 3, 10), LocalDate.of(2021, 9, 1),
            "001092003456", phongBans[1], chucVus[2], null);
        
        log.info("✓ Đã tạo 4 nhân viên");
        return new NhanVien[]{nvAdmin, nvManager, nvEmployee, nvKeToan};
    }
    
    private TaiKhoan createTaiKhoan(String username, String password, String role) {
        TaiKhoan tk = new TaiKhoan();
        tk.setTen_dangnhap(username);
        tk.setMat_khau(passwordEncoder.encode(password));
        tk.setQuyen_han(role);
        return taiKhoanRepo.save(tk);
    }
    
    private NhanVien createNhanVien(String hoTen, String email, String sdt, String diaChi,
            String gioiTinh, LocalDate ngaySinh, LocalDate ngayVaoLam, String cccd,
            PhongBan phongBan, ChucVu chucVu, TaiKhoan taiKhoan) {
        NhanVien nv = new NhanVien();
        nv.setHo_ten(hoTen);
        nv.setEmail(email);
        nv.setSo_dien_thoai(sdt);
        nv.setDia_chi(diaChi);
        nv.setGioi_tinh(gioiTinh);
        nv.setNgay_sinh(ngaySinh);
        nv.setNgay_vao_lam(ngayVaoLam);
        nv.setCccd(cccd);
        nv.setTrangThai("DANG_LAM_VIEC");
        nv.setPhongBan(phongBan);
        nv.setChucVu(chucVu);
        nv.setTaiKhoan(taiKhoan);
        return nhanVienRepo.save(nv);
    }
    
    private void seedHopDong(NhanVien[] nhanViens) {
        hopDongRepo.save(createHopDong(nhanViens[1], LocalDate.of(2021, 6, 1),
            LocalDate.of(2026, 6, 1), "20000000", "Hợp đồng 5 năm"));
        hopDongRepo.save(createHopDong(nhanViens[2], LocalDate.of(2022, 3, 15),
            LocalDate.of(2025, 3, 15), "15000000", "Hợp đồng 3 năm"));
        log.info("✓ Đã tạo 2 hợp đồng");
    }
    
    private HopDong createHopDong(NhanVien nv, LocalDate start, LocalDate end, 
            String luong, String ghiChu) {
        HopDong hd = new HopDong();
        hd.setNhanVien(nv);
        hd.setLoai_hopdong("CHINH_THUC");
        hd.setNgay_batdau(start);
        hd.setNgay_ketthuc(end);
        hd.setNgay_ky(start.minusDays(5));
        hd.setLuongCoBan(new BigDecimal(luong));
        hd.setTrangThai("CON_HIEU_LUC");
        hd.setGhiChu(ghiChu);
        return hd;
    }
    
    private void seedChamCong(NhanVien nhanVien) {
        LocalDate today = LocalDate.now();
        for (int i = 1; i <= 10; i++) {
            ChamCong cc = new ChamCong();
            cc.setNhanVien(nhanVien);
            cc.setNgay_lam(today.minusDays(i));
            cc.setGio_vao(LocalTime.of(8, 0));
            cc.setGio_ra(LocalTime.of(17, 30));
            cc.setLoaiCa("FULL");
            cc.setGhiChu("Làm việc bình thường");
            chamCongRepo.save(cc);
        }
        log.info("✓ Đã tạo 10 bản ghi chấm công");
    }
    
    private void printSummary() {
        log.info("========================================");
        log.info("SEED DỮ LIỆU HOÀN TẤT!");
        log.info("========================================");
        log.info("Tài khoản demo:");
        log.info("  Admin:    admin / Admin@123456");
        log.info("  Manager:  manager / Manager@123");
        log.info("  Employee: employee / Employee@123");
        log.info("========================================");
    }
}
