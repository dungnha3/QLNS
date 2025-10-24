package QuanLy.QLNS.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import QuanLy.QLNS.Entity.NghiPhep;
import QuanLy.QLNS.Entity.NhanVien;

public interface NghiPhepService {

	Page<NghiPhep> getAll(Pageable pageable);

	Optional<NghiPhep> getById(Long id);

	NghiPhep create(NghiPhep nghiPhep);

	NghiPhep update(Long id, NghiPhep nghiPhep);

	void delete(Long id);

	List<NghiPhep> findByNhanVien(NhanVien nhanVien);

	List<NghiPhep> findByTrangThai(String trangThai);

    Page<NghiPhep> findByTrangThai(String trangThai, Pageable pageable);
    
    /**
     * Phê duyệt hoặc từ chối đơn nghỉ phép
     * @param nghiPhepId ID đơn nghỉ phép
     * @param nguoiDuyetId ID người phê duyệt
     * @param trangThai Trạng thái mới (DA_DUYET hoặc TU_CHOI)
     * @param ghiChu Ghi chú khi phê duyệt
     * @return NghiPhep đã được cập nhật
     */
    NghiPhep pheDuyet(Long nghiPhepId, Long nguoiDuyetId, String trangThai, String ghiChu);
}



