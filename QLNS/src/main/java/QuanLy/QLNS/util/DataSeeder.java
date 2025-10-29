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
    private final BangLuongRepository bangLuongRepo;
    private final NghiPhepRepository nghiPhepRepo;
    private final PasswordEncoder passwordEncoder;
    
    public DataSeeder(
            TaiKhoanRepository taiKhoanRepo,
            NhanVienRepository nhanVienRepo,
            PhongBanRepository phongBanRepo,
            ChucVuRepository chucVuRepo,
            HopDongRepository hopDongRepo,
            ChamCongRepository chamCongRepo,
            BangLuongRepository bangLuongRepo,
            NghiPhepRepository nghiPhepRepo,
            PasswordEncoder passwordEncoder) {
        this.taiKhoanRepo = taiKhoanRepo;
        this.nhanVienRepo = nhanVienRepo;
        this.phongBanRepo = phongBanRepo;
        this.chucVuRepo = chucVuRepo;
        this.hopDongRepo = hopDongRepo;
        this.chamCongRepo = chamCongRepo;
        this.bangLuongRepo = bangLuongRepo;
        this.nghiPhepRepo = nghiPhepRepo;
        this.passwordEncoder = passwordEncoder;
    }
    
    @Override
    @Transactional
    public void run(String... args) {
        // Check if data already exists
        if (phongBanRepo.count() > 0) {
            log.info("Database đã có dữ liệu, bỏ qua seed.");
            return;
        }
        
        log.info("Database trống, bắt đầu seed dữ liệu mẫu...");
        
        PhongBan[] phongBans = seedPhongBan();
        ChucVu[] chucVus = seedChucVu();
        NhanVien[] nhanViens = seedNhanVien(phongBans, chucVus);
        seedHopDong(nhanViens);
        seedChamCong(nhanViens);
        seedBangLuong(nhanViens);
        seedNghiPhep(nhanViens);
        
        printSummary();
    }
    
    private PhongBan[] seedPhongBan() {
        PhongBan[] phongBans = {
            phongBanRepo.save(new PhongBan(null, "Tầng 3, Tòa A", "Phòng Công nghệ thông tin",
                "Phụ trách phát triển phần mềm và hệ thống", 10, null)),
            phongBanRepo.save(new PhongBan(null, "Tầng 2, Tòa A", "Phòng Kế toán",
                "Quản lý tài chính và kế toán", 10, null)),
            phongBanRepo.save(new PhongBan(null, "Tầng 1, Tòa A", "Phòng Nhân sự",
                "Quản lý nhân sự và tuyển dụng", 10, null)),
            phongBanRepo.save(new PhongBan(null, "Tầng 5, Tòa B", "Phòng Marketing",
                "Phát triển thương hiệu và marketing", 10, null)),
            phongBanRepo.save(new PhongBan(null, "Tầng 1, Tòa B", "Phòng Kinh doanh",
                "Phát triển thị trường và bán hàng", 10, null)),
            phongBanRepo.save(new PhongBan(null, "Tầng 6, Tòa B", "Phòng Hành chính",
                "Quản lý hành chính và tổng vụ", 10, null)),
            phongBanRepo.save(new PhongBan(null, "Tầng 3, Tòa B", "Phòng Nghiên cứu",
                "Nghiên cứu và phát triển sản phẩm", 10, null)),
            phongBanRepo.save(new PhongBan(null, "Tầng 2, Tòa B", "Phòng Chăm sóc khách hàng",
                "Hỗ trợ và chăm sóc khách hàng", 10, null)),
            phongBanRepo.save(new PhongBan(null, "Tầng 4, Tòa B", "Phòng Pháp chế",
                "Tư vấn pháp lý và hợp đồng", 10, null)),
            phongBanRepo.save(new PhongBan(null, "Tầng 5, Tòa A", "Phòng Đào tạo",
                "Đào tạo và phát triển nhân viên", 10, null))
        };
        log.info("✓ Đã tạo {} phòng ban", phongBans.length);
        return phongBans;
    }
    
    private ChucVu[] seedChucVu() {
        ChucVu[] chucVus = {
            chucVuRepo.save(new ChucVu(null, "50000000", "Điều hành toàn bộ công ty", "Giám đốc", 
                new BigDecimal("45000000"), new BigDecimal("80000000"), null)),
            chucVuRepo.save(new ChucVu(null, "40000000", "Hỗ trợ giám đốc điều hành", "Phó giám đốc",
                new BigDecimal("35000000"), new BigDecimal("60000000"), null)),
            chucVuRepo.save(new ChucVu(null, "25000000", "Quản lý phòng ban", "Trưởng phòng",
                new BigDecimal("20000000"), new BigDecimal("35000000"), null)),
            chucVuRepo.save(new ChucVu(null, "18000000", "Hỗ trợ trưởng phòng", "Phó phòng",
                new BigDecimal("15000000"), new BigDecimal("25000000"), null)),
            chucVuRepo.save(new ChucVu(null, "15000000", "Quản lý nhóm dự án", "Trưởng nhóm",
                new BigDecimal("12000000"), new BigDecimal("20000000"), null)),
            chucVuRepo.save(new ChucVu(null, "12000000", "Thực hiện công việc chuyên môn", "Nhân viên chính thức",
                new BigDecimal("10000000"), new BigDecimal("18000000"), null)),
            chucVuRepo.save(new ChucVu(null, "8000000", "Thời gian thử việc", "Nhân viên thử việc",
                new BigDecimal("7000000"), new BigDecimal("10000000"), null)),
            chucVuRepo.save(new ChucVu(null, "20000000", "Chuyên gia trong lĩnh vực", "Chuyên viên cao cấp",
                new BigDecimal("18000000"), new BigDecimal("30000000"), null)),
            chucVuRepo.save(new ChucVu(null, "13000000", "Công việc kỹ thuật", "Kỹ sư",
                new BigDecimal("11000000"), new BigDecimal("19000000"), null)),
            chucVuRepo.save(new ChucVu(null, "5000000", "Học tập và làm việc", "Thực tập sinh",
                new BigDecimal("4000000"), new BigDecimal("6000000"), null))
        };
        log.info("✓ Đã tạo {} chức vụ", chucVus.length);
        return chucVus;
    }
    
    private NhanVien[] seedNhanVien(PhongBan[] phongBans, ChucVu[] chucVus) {
        TaiKhoan tkAdmin = createTaiKhoan("admin", "Admin@123456", "ADMIN");
        NhanVien nvAdmin = createNhanVien("Nguyễn Văn An", "admin@qlns.com", "0901234567", 
            "Hà Nội", "Nam", LocalDate.of(1985, 1, 1), LocalDate.of(2020, 1, 1), 
            "001085001234", phongBans[2], chucVus[0], tkAdmin);
        log.info("✓ Tài khoản admin (admin / Admin@123456)");
        
        TaiKhoan tkManager = createTaiKhoan("manager", "Manager@123", "MANAGER");
        NhanVien nvManager = createNhanVien("Trần Thị Hương", "huong.tran@qlns.com", "0912345678",
            "Hà Nội", "Nữ", LocalDate.of(1990, 5, 15), LocalDate.of(2021, 6, 1),
            "001090005432", phongBans[0], chucVus[2], tkManager);
        log.info("✓ Tài khoản manager (manager / Manager@123)");
        
        TaiKhoan tkEmployee = createTaiKhoan("employee", "Employee@123", "EMPLOYEE");
        NhanVien nvEmployee = createNhanVien("Lê Minh Tuấn", "tuan.le@qlns.com", "0923456789",
            "Hồ Chí Minh", "Nam", LocalDate.of(1995, 8, 20), LocalDate.of(2022, 3, 15),
            "001095008765", phongBans[0], chucVus[5], tkEmployee);
        log.info("✓ Tài khoản employee (employee / Employee@123)");
        
        TaiKhoan tk4 = createTaiKhoan("mai.nguyen", "Employee@123", "EMPLOYEE");
        NhanVien nv4 = createNhanVien("Nguyễn Thị Mai", "mai.nguyen@qlns.com", "0934567890",
            "Đà Nẵng", "Nữ", LocalDate.of(1992, 3, 10), LocalDate.of(2021, 9, 1),
            "001092003456", phongBans[1], chucVus[5], tk4);
        
        TaiKhoan tk5 = createTaiKhoan("nam.pham", "Employee@123", "EMPLOYEE");
        NhanVien nv5 = createNhanVien("Phạm Văn Nam", "nam.pham@qlns.com", "0945678901",
            "Hải Phòng", "Nam", LocalDate.of(1993, 7, 18), LocalDate.of(2021, 9, 10),
            "001093056789", phongBans[3], chucVus[5], tk5);
        
        TaiKhoan tk6 = createTaiKhoan("linh.hoang", "Employee@123", "EMPLOYEE");
        NhanVien nv6 = createNhanVien("Hoàng Thị Linh", "linh.hoang@qlns.com", "0956789012",
            "Cần Thơ", "Nữ", LocalDate.of(1991, 11, 30), LocalDate.of(2020, 7, 15),
            "001091067890", phongBans[4], chucVus[4], tk6);
        
        TaiKhoan tk7 = createTaiKhoan("duc.vo", "Employee@123", "EMPLOYEE");
        NhanVien nv7 = createNhanVien("Võ Minh Đức", "duc.vo@qlns.com", "0967890123",
            "Huế", "Nam", LocalDate.of(1994, 2, 14), LocalDate.of(2022, 5, 20),
            "001094078901", phongBans[5], chucVus[5], tk7);
        
        TaiKhoan tk8 = createTaiKhoan("thao.dang", "Employee@123", "EMPLOYEE");
        NhanVien nv8 = createNhanVien("Đặng Thị Thảo", "thao.dang@qlns.com", "0978901234",
            "Vinh", "Nữ", LocalDate.of(1996, 9, 5), LocalDate.of(2023, 2, 1),
            "001096089012", phongBans[6], chucVus[6], tk8);
        
        TaiKhoan tk9 = createTaiKhoan("hung.bui", "Employee@123", "EMPLOYEE");
        NhanVien nv9 = createNhanVien("Bùi Văn Hùng", "hung.bui@qlns.com", "0989012345",
            "Nha Trang", "Nam", LocalDate.of(1989, 4, 22), LocalDate.of(2019, 11, 10),
            "001089090123", phongBans[7], chucVus[1], tk9);
        
        TaiKhoan tk10 = createTaiKhoan("lan.ly", "Employee@123", "EMPLOYEE");
        NhanVien nv10 = createNhanVien("Lý Thị Lan", "lan.ly@qlns.com", "0990123456",
            "Đà Lạt", "Nữ", LocalDate.of(1997, 6, 8), LocalDate.of(2023, 8, 15),
            "001097001234", phongBans[8], chucVus[3], tk10);
        
        log.info("✓ Đã tạo 10 nhân viên với tài khoản:");
        log.info("  - admin / Admin@123456 (ADMIN)");
        log.info("  - manager / Manager@123 (MANAGER)");
        log.info("  - employee / Employee@123 (EMPLOYEE)");
        log.info("  - mai.nguyen / Employee@123 (EMPLOYEE)");
        log.info("  - nam.pham / Employee@123 (EMPLOYEE)");
        log.info("  - linh.hoang / Employee@123 (EMPLOYEE)");
        log.info("  - duc.vo / Employee@123 (EMPLOYEE)");
        log.info("  - thao.dang / Employee@123 (EMPLOYEE)");
        log.info("  - hung.bui / Employee@123 (EMPLOYEE)");
        log.info("  - lan.ly / Employee@123 (EMPLOYEE)");
        return new NhanVien[]{nvAdmin, nvManager, nvEmployee, nv4, nv5, nv6, nv7, nv8, nv9, nv10};
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
        hopDongRepo.save(createHopDong(nhanViens[0], LocalDate.of(2020, 1, 1),
            null, "50000000", "Hợp đồng không thời hạn"));
        hopDongRepo.save(createHopDong(nhanViens[1], LocalDate.of(2021, 6, 1),
            null, "25000000", "Hợp đồng không thời hạn"));
        hopDongRepo.save(createHopDong(nhanViens[2], LocalDate.of(2022, 3, 15),
            LocalDate.of(2025, 3, 15), "12000000", "Hợp đồng 3 năm"));
        hopDongRepo.save(createHopDong(nhanViens[3], LocalDate.of(2021, 9, 1),
            LocalDate.of(2024, 9, 1), "12000000", "Hợp đồng 3 năm"));
        hopDongRepo.save(createHopDong(nhanViens[4], LocalDate.of(2021, 9, 10),
            LocalDate.of(2023, 9, 10), "12000000", "Hợp đồng 2 năm"));
        hopDongRepo.save(createHopDong(nhanViens[5], LocalDate.of(2020, 7, 15),
            null, "15000000", "Hợp đồng không thời hạn"));
        hopDongRepo.save(createHopDong(nhanViens[6], LocalDate.of(2022, 5, 20),
            LocalDate.of(2024, 5, 20), "12000000", "Hợp đồng 2 năm"));
        hopDongRepo.save(createHopDong(nhanViens[7], LocalDate.of(2023, 2, 1),
            LocalDate.of(2023, 4, 1), "8000000", "Hợp đồng thử việc"));
        hopDongRepo.save(createHopDong(nhanViens[8], LocalDate.of(2019, 11, 10),
            null, "40000000", "Hợp đồng không thời hạn"));
        hopDongRepo.save(createHopDong(nhanViens[9], LocalDate.of(2023, 8, 15),
            null, "18000000", "Hợp đồng không thời hạn"));
        log.info("✓ Đã tạo 10 hợp đồng");
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
    
    private void seedChamCong(NhanVien[] nhanViens) {
        LocalDate today = LocalDate.now();
        int totalCount = 0;
        
        // Varied check-in times and patterns
        LocalTime[] checkInTimes = {
            LocalTime.of(7, 45),  // Đến sớm
            LocalTime.of(8, 0),   // Đúng giờ
            LocalTime.of(8, 0),   // Đúng giờ
            LocalTime.of(8, 10),  // Muộn 10 phút
            LocalTime.of(8, 20),  // Muộn 20 phút
            LocalTime.of(8, 5),   // Muộn 5 phút
            LocalTime.of(7, 55),  // Sớm 5 phút
            LocalTime.of(8, 30),  // Muộn 30 phút
        };
        
        LocalTime[] checkOutTimes = {
            LocalTime.of(17, 30),
            LocalTime.of(17, 45),
            LocalTime.of(18, 0),
            LocalTime.of(17, 20),
            LocalTime.of(18, 30),
            LocalTime.of(17, 0),
        };
        
        String[] loaiCa = {"FULL", "FULL", "FULL", "SANG", "CHIEU", "FULL", "TOI"};
        
        for (int nvIdx = 0; nvIdx < nhanViens.length; nvIdx++) {
            NhanVien nv = nhanViens[nvIdx];
            
            // Create attendance records for the last 30 days
            for (int i = 0; i < 30; i++) {
                LocalDate ngayLam = today.minusDays(i);
                
                // Skip weekends (Saturday=6, Sunday=7)
                if (ngayLam.getDayOfWeek().getValue() >= 6) {
                    continue;
                }
                
                // Randomly skip some days (nghỉ phép, ốm, etc.)
                if ((nvIdx + i) % 11 == 0) {
                    continue;
                }
                
                ChamCong cc = new ChamCong();
                cc.setNhanVien(nv);
                cc.setNgay_lam(ngayLam);
                
                // Varied attendance patterns
                int patternIdx = (nvIdx * 7 + i) % checkInTimes.length;
                LocalTime gioVao = checkInTimes[patternIdx];
                LocalTime gioRa = checkOutTimes[i % checkOutTimes.length];
                
                cc.setGio_vao(gioVao);
                cc.setGio_ra(gioRa);
                
                // Calculate working hours
                double hours = (gioRa.toSecondOfDay() - gioVao.toSecondOfDay()) / 3600.0;
                // Subtract lunch break (1 hour)
                if (hours > 4) {
                    hours -= 1.0;
                }
                cc.setTongGioLam(Math.round(hours * 10.0) / 10.0);
                
                // Set shift type
                String ca = loaiCa[i % loaiCa.length];
                cc.setLoaiCa(ca);
                
                // Determine status based on check-in time
                String trangThai;
                String ghiChu;
                if (gioVao.isAfter(LocalTime.of(8, 15))) {
                    trangThai = "DI_MUON";
                    int minutesLate = gioVao.getHour() * 60 + gioVao.getMinute() - (8 * 60);
                    ghiChu = "Đi muộn " + minutesLate + " phút";
                } else if (gioVao.isBefore(LocalTime.of(7, 50))) {
                    trangThai = "DUNG_GIO";
                    ghiChu = "Đến sớm";
                } else {
                    trangThai = "DUNG_GIO";
                    ghiChu = "Làm việc bình thường";
                }
                
                // Some records with early leave
                if ((nvIdx + i) % 13 == 0 && gioRa.isBefore(LocalTime.of(17, 30))) {
                    trangThai = "VE_SOM";
                    ghiChu = "Về sớm - có việc gia đình";
                }
                
                cc.setTrangThai(trangThai);
                cc.setGhiChu(ghiChu);
                
                chamCongRepo.save(cc);
                totalCount++;
            }
        }
        log.info("✓ Đã tạo {} bản ghi chấm công (30 ngày gần nhất, trừ cuối tuần)", totalCount);
    }
    
    private void seedBangLuong(NhanVien[] nhanViens) {
        int count = 0;
        LocalDate today = LocalDate.now();
        for (NhanVien nv : nhanViens) {
            // Create salary records for the last 6 months
            for (int i = 0; i < 6; i++) {
                BangLuong bl = new BangLuong();
                bl.setNhanVien(nv);
                LocalDate salaryDate = today.minusMonths(i);
                bl.setThang(salaryDate.getMonthValue());
                bl.setNam(salaryDate.getYear());

                BigDecimal luongCoBan = nv.getChucVu() != null && nv.getChucVu().getLuong_co_ban() != null
                    ? new BigDecimal(nv.getChucVu().getLuong_co_ban())
                    : new BigDecimal("12000000");

                bl.setLuong_co_ban(luongCoBan);
                bl.setPhu_cap(luongCoBan.multiply(new BigDecimal("0.1")));
                bl.setBhxh(luongCoBan.multiply(new BigDecimal("0.08")));
                bl.setBhyt(luongCoBan.multiply(new BigDecimal("0.03")));
                bl.setBhtn(luongCoBan.multiply(new BigDecimal("0.02")));
                bl.setThueThuNhap(luongCoBan.multiply(new BigDecimal("0.1")));

                BigDecimal khauTru = bl.getBhxh().add(bl.getBhyt()).add(bl.getBhtn()).add(bl.getThueThuNhap());
                bl.setKhau_tru(khauTru);

                BigDecimal tongCong = luongCoBan.add(bl.getPhu_cap());
                bl.setTong_cong(tongCong);
                bl.setThuc_lanh(tongCong.subtract(khauTru));

                bl.setTrangThai((count + i) % 3 == 0 ? "DA_THANH_TOAN" : (count + i) % 3 == 1 ? "DA_DUYET" : "CHO_DUYET");
                if (bl.getTrangThai().equals("DA_THANH_TOAN")) {
                    bl.setNgayThanhToan(salaryDate.withDayOfMonth(5));
                }

                bangLuongRepo.save(bl);
                count++;
            }
        }
        log.info("✓ Đã tạo {} bảng lương", count);
    }
    
    private void seedNghiPhep(NhanVien[] nhanViens) {
        String[] loaiNghi = {"PHEP_NAM", "OM", "KHONG_LUONG", "KET_HON", "TANG", "CON_OM"};
        String[] lyDo = {
            "Về quê nghỉ lễ", "Bị cảm sốt", "Việc gia đình",
            "Đám cưới", "Tang lễ người thân", "Con bị ốm",
            "Du lịch gia đình", "Đau răng", "Nghỉ ngơi", "Về thăm nhà"
        };

        int count = 0;
        // Only create leave requests for some employees (not all)
        for (int i = 0; i < nhanViens.length; i++) {
            // Skip every 3rd employee to have some with no leave requests
            if (i % 3 == 2) continue;

            NghiPhep np = new NghiPhep();
            np.setNhanVien(nhanViens[i]);
            np.setLoaiNghi(loaiNghi[i % loaiNghi.length]);
            np.setNgayBatDau(LocalDate.now().plusDays(i * 5));
            np.setNgayKetThuc(LocalDate.now().plusDays(i * 5 + 2));
            np.setSoNgayNghi(3);
            np.setLyDo(lyDo[i % lyDo.length]);
            np.setTrangThai(i < 5 ? "DA_DUYET" : "CHO_DUYET");
            np.setNgayTao(LocalDate.now().minusDays(i).atStartOfDay());

            if (i < 5 && nhanViens.length > 1) {
                np.setNguoiDuyet(nhanViens[1]); // Manager duyệt
                np.setNgayDuyet(LocalDate.now().minusDays(i-1).atStartOfDay());
                np.setGhiChuDuyet("Đồng ý");
            }

            nghiPhepRepo.save(np);
            count++;
        }
        log.info("✓ Đã tạo {} đơn nghỉ phép", count);
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
