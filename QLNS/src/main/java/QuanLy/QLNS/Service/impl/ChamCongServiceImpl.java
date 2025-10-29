package QuanLy.QLNS.Service.impl;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import QuanLy.QLNS.dto.ChamCongGPSRequest;
import QuanLy.QLNS.util.GPSUtil;
import QuanLy.QLNS.Entity.ChamCong;
import QuanLy.QLNS.Entity.NhanVien;
import QuanLy.QLNS.exception.ResourceNotFoundException;
import QuanLy.QLNS.Repository.ChamCongRepository;
import QuanLy.QLNS.Repository.NhanVienRepository;
import QuanLy.QLNS.Service.ChamCongService;

@Service
public class ChamCongServiceImpl implements ChamCongService {

	private static final Logger log = LoggerFactory.getLogger(ChamCongServiceImpl.class);
	
	// Tọa độ công ty (mặc định - có thể config trong application.properties)
	@Value("${company.latitude:21.0285}")
	private Double companyLatitude;
	
	@Value("${company.longitude:105.8542}")
	private Double companyLongitude;
	
	@Value("${company.radius:500}")
	private Double allowedRadius; // Bán kính cho phép (meters)

	private final ChamCongRepository repository;
	private final NhanVienRepository nhanVienRepository;

	public ChamCongServiceImpl(ChamCongRepository repository, NhanVienRepository nhanVienRepository) {
		this.repository = repository;
		this.nhanVienRepository = nhanVienRepository;
	}

	@Override
	public Page<ChamCong> getAll(Pageable pageable) {
		return repository.findAll(pageable);
	}
	
	@Override
	public Page<ChamCong> getAll(Pageable pageable, Long nhanVienId, Integer month, Integer year) {
		log.info("getAll - nhanVienId: {}, month: {}, year: {}", nhanVienId, month, year);
		
		// Nếu không có filter, trả về tất cả
		if (nhanVienId == null && month == null && year == null) {
			return repository.findAll(pageable);
		}
		
		// Tạo Specification để filter
		Specification<ChamCong> spec = (root, query, cb) -> {
			var predicates = new java.util.ArrayList<jakarta.persistence.criteria.Predicate>();
			
			if (nhanVienId != null) {
				predicates.add(cb.equal(root.get("nhanVien").get("nhanvien_id"), nhanVienId));
			}
			
			if (month != null && year != null) {
				// Filter theo tháng và năm
				predicates.add(cb.equal(cb.function("MONTH", Integer.class, root.get("ngay_lam")), month));
				predicates.add(cb.equal(cb.function("YEAR", Integer.class, root.get("ngay_lam")), year));
			} else if (year != null) {
				// Chỉ filter theo năm
				predicates.add(cb.equal(cb.function("YEAR", Integer.class, root.get("ngay_lam")), year));
			}
			
			// Sort by ngay_lam DESC để hiển thị ngày mới nhất trước
			if (query != null) {
				query.orderBy(cb.desc(root.get("ngay_lam")));
			}
			
			return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
		};
		
		Page<ChamCong> result = repository.findAll(spec, pageable);
		log.info("Found {} records", result.getTotalElements());
		return result;
	}

	@Override
	public Optional<ChamCong> getById(Long id) {
		return repository.findById(id);
	}

	@Override
	@Transactional
	public ChamCong create(ChamCong chamCong) {
		return repository.save(chamCong);
	}

	@Override
	@Transactional
	public ChamCong update(Long id, ChamCong chamCong) {
		ChamCong existing = repository.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("ChamCong not found: " + id));
		existing.setGio_ra(chamCong.getGio_ra());
		existing.setGio_vao(chamCong.getGio_vao());
		existing.setNgay_lam(chamCong.getNgay_lam());
		existing.setTrangThai(chamCong.getTrangThai());
		existing.setTongGioLam(chamCong.getTongGioLam());
		existing.setLoaiCa(chamCong.getLoaiCa());
		existing.setGhiChu(chamCong.getGhiChu());
		existing.setNhanVien(chamCong.getNhanVien());
		return repository.save(existing);
	}

	@Override
	@Transactional
	public void delete(Long id) {
		repository.deleteById(id);
	}

	@Override
	public List<ChamCong> findByNhanVien(NhanVien nhanVien) {
		return repository.findByNhanVien(nhanVien);
	}

	@Override
	public Optional<ChamCong> findByNhanVienAndNgay(NhanVien nhanVien, LocalDate ngayLam) {
		return repository.findByNhanVienAndNgayLam(nhanVien, ngayLam);
	}
	
	@Override
	@Transactional
	public Map<String, Object> chamCongGPS(ChamCongGPSRequest request) {
		log.info("Chấm công GPS cho nhân viên ID: {}", request.getNhanVienId());
		
		// 1. Lấy thông tin nhân viên
		NhanVien nhanVien = nhanVienRepository.findById(request.getNhanVienId())
				.orElseThrow(() -> new ResourceNotFoundException("Nhân viên", "id", request.getNhanVienId()));
		
		// 2. Tính khoảng cách từ công ty
		double distance = GPSUtil.calculateDistance(
			request.getLatitude(), request.getLongitude(),
			companyLatitude, companyLongitude
		);
		
		// 3. Kiểm tra trong bán kính cho phép
		if (distance > allowedRadius) {
			throw new IllegalArgumentException(String.format(
				"Vị trí của bạn cách công ty %.0fm. Vui lòng đến gần hơn (trong bán kính %.0fm)",
				distance, allowedRadius
			));
		}
		
		// 4. Lấy hoặc tạo bản ghi chấm công hôm nay
		LocalDate today = LocalDate.now();
		Optional<ChamCong> existingOpt = repository.findByNhanVienAndNgayLam(nhanVien, today);
		
		ChamCong chamCong;
		boolean isCheckIn;
		
		if (existingOpt.isEmpty()) {
			// Chấm công vào
			chamCong = new ChamCong();
			chamCong.setNhanVien(nhanVien);
			chamCong.setNgay_lam(today);
			chamCong.setGio_vao(LocalTime.now());
			chamCong.setLoaiCa("FULL");
			chamCong.setPhuongThuc("GPS");
			isCheckIn = true;
		} else {
			// Chấm công ra
			chamCong = existingOpt.get();
			if (chamCong.getGio_ra() != null) {
				throw new IllegalArgumentException("Bạn đã chấm công ra hôm nay rồi");
			}
			chamCong.setGio_ra(LocalTime.now());
			isCheckIn = false;
		}
		
		// 5. Lưu thông tin GPS
		chamCong.setLatitude(request.getLatitude());
		chamCong.setLongitude(request.getLongitude());
		chamCong.setDiaChiCheckin(request.getDiaChiCheckin());
		chamCong.setKhoangCach(distance);
		
		// 6. Lưu vào database
		chamCong = repository.save(chamCong);
		
		// 7. Tạo response
		Map<String, Object> response = new HashMap<>();
		response.put("success", true);
		response.put("message", isCheckIn ? "Chấm công vào thành công!" : "Chấm công ra thành công!");
		response.put("isCheckIn", isCheckIn);
		response.put("time", isCheckIn ? chamCong.getGio_vao() : chamCong.getGio_ra());
		response.put("distance", Math.round(distance));
		response.put("address", request.getDiaChiCheckin());
		
		return response;
	}
	
	@Override
	public Map<String, Object> getTrangThaiChamCongHomNay(Long nhanVienId) {
		NhanVien nhanVien = nhanVienRepository.findById(nhanVienId)
				.orElseThrow(() -> new ResourceNotFoundException("Nhân viên", "id", nhanVienId));
		
		LocalDate today = LocalDate.now();
		Optional<ChamCong> chamCongOpt = repository.findByNhanVienAndNgayLam(nhanVien, today);
		
		Map<String, Object> response = new HashMap<>();
		
		if (chamCongOpt.isEmpty()) {
			response.put("checkedIn", false);
			response.put("checkedOut", false);
			response.put("message", "Chưa chấm công hôm nay");
		} else {
			ChamCong chamCong = chamCongOpt.get();
			response.put("checkedIn", true);
			response.put("checkedOut", chamCong.getGio_ra() != null);
			response.put("gioVao", chamCong.getGio_vao());
			response.put("gioRa", chamCong.getGio_ra());
			response.put("tongGioLam", chamCong.getTongGioLam());
			response.put("message", chamCong.getGio_ra() != null ? "Đã chấm công đầy đủ" : "Đã chấm công vào");
		}
		
		return response;
	}
}










