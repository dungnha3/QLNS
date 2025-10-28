package QuanLy.QLNS.Service.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import QuanLy.QLNS.Entity.BangLuong;
import QuanLy.QLNS.Entity.ChamCong;
import QuanLy.QLNS.Entity.HopDong;
import QuanLy.QLNS.Entity.NhanVien;
import QuanLy.QLNS.Repository.BangLuongRepository;
import QuanLy.QLNS.Repository.ChamCongRepository;
import QuanLy.QLNS.Repository.HopDongRepository;
import QuanLy.QLNS.Repository.NhanVienRepository;
import QuanLy.QLNS.Service.BangLuongService;
import QuanLy.QLNS.exception.BusinessException;
import QuanLy.QLNS.exception.ResourceNotFoundException;

@Service
public class BangLuongServiceImpl implements BangLuongService {
	
	private static final Logger log = LoggerFactory.getLogger(BangLuongServiceImpl.class);

	private final BangLuongRepository repository;
	private final NhanVienRepository nhanVienRepository;
	private final HopDongRepository hopDongRepository;
	private final ChamCongRepository chamCongRepository;

	public BangLuongServiceImpl(BangLuongRepository repository, 
								NhanVienRepository nhanVienRepository,
								HopDongRepository hopDongRepository,
								ChamCongRepository chamCongRepository) {
		this.repository = repository;
		this.nhanVienRepository = nhanVienRepository;
		this.hopDongRepository = hopDongRepository;
		this.chamCongRepository = chamCongRepository;
	}

	@Override
	public Page<BangLuong> getAll(Pageable pageable) {
		return repository.findAll(pageable);
	}

	@Override
	public Optional<BangLuong> getById(Long id) {
		return repository.findById(id);
	}

	@Override
	@Transactional
	public BangLuong create(BangLuong bangLuong) {
		return repository.save(bangLuong);
	}

	@Override
	@Transactional
	public BangLuong update(Long id, BangLuong bangLuong) {
		log.info("Cập nhật bảng lương ID: {}", id);
		BangLuong existing = repository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Bảng lương", "id", id));
		existing.setKhau_tru(bangLuong.getKhau_tru());
		existing.setLuong_co_ban(bangLuong.getLuong_co_ban());
		existing.setPhu_cap(bangLuong.getPhu_cap());
		existing.setThuc_lanh(bangLuong.getThuc_lanh());
		existing.setTong_cong(bangLuong.getTong_cong());
		existing.setThang(bangLuong.getThang());
		existing.setNam(bangLuong.getNam());
		existing.setBhxh(bangLuong.getBhxh());
		existing.setBhyt(bangLuong.getBhyt());
		existing.setBhtn(bangLuong.getBhtn());
		existing.setThueThuNhap(bangLuong.getThueThuNhap());
		existing.setNgayThanhToan(bangLuong.getNgayThanhToan());
		existing.setTrangThai(bangLuong.getTrangThai());
		existing.setNhanVien(bangLuong.getNhanVien());
		return repository.save(existing);
	}

	@Override
	@Transactional
	public void delete(Long id) {
		repository.deleteById(id);
	}

	@Override
	public List<BangLuong> findByNhanVien(NhanVien nhanVien) {
		return repository.findByNhanVien(nhanVien);
	}

	@Override
	public List<BangLuong> findByTrangThai(String trangThai) {
		return repository.findByTrangThai(trangThai);
	}

	@Override
	public Page<BangLuong> findByTrangThai(String trangThai, Pageable pageable) {
		return repository.findByTrangThai(trangThai, pageable);
	}

	@Override
	@Transactional
	public BangLuong tinhLuongTuDong(Long nhanVienId, int thang, int nam) {
		log.info("Bắt đầu tính lương tự động cho nhân viên ID: {}, tháng {}/{}", nhanVienId, thang, nam);
		
		// 1. Lấy thông tin nhân viên
		NhanVien nhanVien = nhanVienRepository.findById(nhanVienId)
				.orElseThrow(() -> new ResourceNotFoundException("Nhân viên", "id", nhanVienId));
		log.debug("Tìm thấy nhân viên: {}", nhanVien.getHo_ten());
		
		// 2. Lấy hợp đồng còn hiệu lực
		HopDong hopDong = hopDongRepository.findActiveHopDongByNhanVien(nhanVien)
				.orElseThrow(() -> new BusinessException("Nhân viên chưa có hợp đồng còn hiệu lực"));
		log.debug("Lương cơ bản: {}", hopDong.getLuongCoBan());
		
		// 3. Lấy dữ liệu chấm công trong tháng
		YearMonth yearMonth = YearMonth.of(nam, thang);
		LocalDate startDate = yearMonth.atDay(1);
		LocalDate endDate = yearMonth.atEndOfMonth();
		
		List<ChamCong> chamCongs = chamCongRepository.findByNhanVienAndNgayLamBetween(nhanVien, startDate, endDate);
		
		// 4. Tính tổng giờ làm việc
		double tongGioLam = chamCongs.stream()
				.mapToDouble(cc -> cc.getTongGioLam() != null ? cc.getTongGioLam() : 0.0)
				.sum();
		
		// 5. Tính lương
		BigDecimal luongCoBan = hopDong.getLuongCoBan() != null ? hopDong.getLuongCoBan() : BigDecimal.ZERO;
		
		// Tính lương theo giờ (giả sử 1 tháng = 176 giờ làm việc chuẩn)
		BigDecimal luongTheoGio = luongCoBan.divide(new BigDecimal("176"), 2, RoundingMode.HALF_UP);
		BigDecimal tongLuongTheoGio = luongTheoGio.multiply(new BigDecimal(tongGioLam));
		
		// 6. Tính phụ cấp (10% lương cơ bản)
		BigDecimal phuCap = luongCoBan.multiply(new BigDecimal("0.10"));
		
		// 7. Tính bảo hiểm (BHXH: 8%, BHYT: 1.5%, BHTN: 1%)
		BigDecimal bhxh = tongLuongTheoGio.multiply(new BigDecimal("0.08"));
		BigDecimal bhyt = tongLuongTheoGio.multiply(new BigDecimal("0.015"));
		BigDecimal bhtn = tongLuongTheoGio.multiply(new BigDecimal("0.01"));
		
		// 8. Tính thuế thu nhập (giả sử 10% nếu lương > 11 triệu)
		BigDecimal tongTruocThue = tongLuongTheoGio.add(phuCap);
		BigDecimal thueThuNhap = BigDecimal.ZERO;
		if (tongTruocThue.compareTo(new BigDecimal("11000000")) > 0) {
			BigDecimal thuNhapChiuThue = tongTruocThue.subtract(new BigDecimal("11000000"));
			thueThuNhap = thuNhapChiuThue.multiply(new BigDecimal("0.10"));
		}
		
		// 9. Tính tổng khấu trừ
		BigDecimal tongKhauTru = bhxh.add(bhyt).add(bhtn).add(thueThuNhap);
		
		// 10. Tính thực lãnh
		BigDecimal thucLanh = tongTruocThue.subtract(tongKhauTru);
		
		// 11. Tạo bảng lương
		BangLuong bangLuong = new BangLuong();
		bangLuong.setNhanVien(nhanVien);
		bangLuong.setThang(thang);
		bangLuong.setNam(nam);
		bangLuong.setLuong_co_ban(luongCoBan);
		bangLuong.setPhu_cap(phuCap);
		bangLuong.setBhxh(bhxh);
		bangLuong.setBhyt(bhyt);
		bangLuong.setBhtn(bhtn);
		bangLuong.setThueThuNhap(thueThuNhap);
		bangLuong.setTong_cong(tongTruocThue);
		bangLuong.setKhau_tru(tongKhauTru);
		bangLuong.setThuc_lanh(thucLanh);
		bangLuong.setTrangThai("CHO_DUYET");
		bangLuong.setNgayThanhToan(null);
		
		BangLuong saved = repository.save(bangLuong);
		log.info("Tính lương thành công cho nhân viên: {} - Thực lãnh: {}", nhanVien.getHo_ten(), thucLanh);
		return saved;
	}
	
	@Override
	public Map<String, Object> previewTinhLuong(Long nhanVienId, int thang, int nam) {
		log.info("Preview tính lương cho nhân viên ID: {}, tháng {}/{}", nhanVienId, thang, nam);
		
		// 1. Lấy thông tin nhân viên
		NhanVien nhanVien = nhanVienRepository.findById(nhanVienId)
				.orElseThrow(() -> new ResourceNotFoundException("Nhân viên", "id", nhanVienId));
		
		// 2. Lấy hợp đồng còn hiệu lực
		HopDong hopDong = hopDongRepository.findActiveHopDongByNhanVien(nhanVien)
				.orElseThrow(() -> new BusinessException("Nhân viên chưa có hợp đồng còn hiệu lực"));
		
		// 3. Lấy dữ liệu chấm công
		YearMonth yearMonth = YearMonth.of(nam, thang);
		LocalDate startDate = yearMonth.atDay(1);
		LocalDate endDate = yearMonth.atEndOfMonth();
		List<ChamCong> chamCongs = chamCongRepository.findByNhanVienAndNgayLamBetween(nhanVien, startDate, endDate);
		
		// 4. Tính toán
		double tongGioLam = chamCongs.stream()
				.mapToDouble(cc -> cc.getTongGioLam() != null ? cc.getTongGioLam() : 0.0)
				.sum();
		int soNgayLam = chamCongs.size();
		
		BigDecimal luongCoBan = hopDong.getLuongCoBan() != null ? hopDong.getLuongCoBan() : BigDecimal.ZERO;
		BigDecimal luongTheoGio = luongCoBan.divide(new BigDecimal("176"), 2, RoundingMode.HALF_UP);
		BigDecimal tongLuongTheoGio = luongTheoGio.multiply(new BigDecimal(tongGioLam));
		BigDecimal phuCap = luongCoBan.multiply(new BigDecimal("0.10"));
		BigDecimal bhxh = tongLuongTheoGio.multiply(new BigDecimal("0.08"));
		BigDecimal bhyt = tongLuongTheoGio.multiply(new BigDecimal("0.015"));
		BigDecimal bhtn = tongLuongTheoGio.multiply(new BigDecimal("0.01"));
		
		BigDecimal tongTruocThue = tongLuongTheoGio.add(phuCap);
		BigDecimal thueThuNhap = BigDecimal.ZERO;
		if (tongTruocThue.compareTo(new BigDecimal("11000000")) > 0) {
			BigDecimal thuNhapChiuThue = tongTruocThue.subtract(new BigDecimal("11000000"));
			thueThuNhap = thuNhapChiuThue.multiply(new BigDecimal("0.10"));
		}
		
		BigDecimal tongKhauTru = bhxh.add(bhyt).add(bhtn).add(thueThuNhap);
		BigDecimal thucLanh = tongTruocThue.subtract(tongKhauTru);
		
		// 5. Tạo response
		Map<String, Object> preview = new HashMap<>();
		
		Map<String, Object> nhanVienInfo = new HashMap<>();
		nhanVienInfo.put("id", nhanVien.getNhanvien_id());
		nhanVienInfo.put("hoTen", nhanVien.getHo_ten());
		nhanVienInfo.put("email", nhanVien.getEmail());
		nhanVienInfo.put("chucVu", nhanVien.getChucVu() != null ? nhanVien.getChucVu().getTen_chucvu() : "");
		nhanVienInfo.put("phongBan", nhanVien.getPhongBan() != null ? nhanVien.getPhongBan().getTen_phongban() : "");
		preview.put("nhanVien", nhanVienInfo);
		
		preview.put("thang", thang);
		preview.put("nam", nam);
		
		Map<String, Object> chamCongInfo = new HashMap<>();
		chamCongInfo.put("soNgayLam", soNgayLam);
		chamCongInfo.put("tongGioLam", tongGioLam);
		chamCongInfo.put("gioLamChuan", 176);
		preview.put("chamCong", chamCongInfo);
		preview.put("luongCoBan", luongCoBan);
		preview.put("phuCap", phuCap);
		preview.put("bhxh", bhxh);
		preview.put("bhyt", bhyt);
		preview.put("bhtn", bhtn);
		preview.put("thueThuNhap", thueThuNhap);
		preview.put("tongCong", tongTruocThue);
		preview.put("khauTru", tongKhauTru);
		preview.put("thucLanh", thucLanh);
		
		return preview;
	}
	
	@Override
	@Transactional
	public List<BangLuong> tinhLuongHangLoat(int thang, int nam, Long phongBanId) {
		log.info("Bắt đầu tính lương hàng loạt cho tháng {}/{}, phòng ban ID: {}", thang, nam, phongBanId);
		
		List<NhanVien> nhanViens;
		if (phongBanId != null) {
			nhanViens = nhanVienRepository.findByPhongBan_PhongbanId(phongBanId);
		} else {
			nhanViens = nhanVienRepository.findAll();
		}
		
		List<BangLuong> results = new java.util.ArrayList<>();
		int success = 0;
		int failed = 0;
		
		for (NhanVien nv : nhanViens) {
			try {
				// Kiểm tra xem đã có bảng lương chưa
				Optional<BangLuong> existing = repository.findByNhanVienAndThangAndNam(nv, thang, nam);
				if (existing.isPresent()) {
					log.warn("Nhân viên {} đã có bảng lương tháng {}/{}", nv.getHo_ten(), thang, nam);
					continue;
				}
				
				BangLuong bangLuong = tinhLuongTuDong(nv.getNhanvien_id(), thang, nam);
				results.add(bangLuong);
				success++;
			} catch (Exception e) {
				log.error("Lỗi tính lương cho nhân viên {}: {}", nv.getHo_ten(), e.getMessage());
				failed++;
			}
		}
		
		log.info("Hoàn thành tính lương hàng loạt: {} thành công, {} thất bại", success, failed);
		return results;
	}
	
	@Override
	@Transactional
	public BangLuong capNhatTrangThai(Long id, String trangThai) {
		log.info("Cập nhật trạng thái bảng lương ID: {} -> {}", id, trangThai);
		BangLuong bangLuong = repository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Bảng lương", "id", id));
		
		// Validate trạng thái
		if (!List.of("CHO_DUYET", "DA_DUYET", "DA_THANH_TOAN", "TU_CHOI").contains(trangThai)) {
			throw new BusinessException("Trạng thái không hợp lệ: " + trangThai);
		}
		
		bangLuong.setTrangThai(trangThai);
		
		// Nếu thanh toán thì set ngày thanh toán
		if ("DA_THANH_TOAN".equals(trangThai)) {
			bangLuong.setNgayThanhToan(LocalDate.now());
		}
		
		return repository.save(bangLuong);
	}
}




