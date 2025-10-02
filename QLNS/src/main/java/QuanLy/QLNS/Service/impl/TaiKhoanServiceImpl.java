package QuanLy.QLNS.Service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import QuanLy.QLNS.Entity.TaiKhoan;
import QuanLy.QLNS.Repository.TaiKhoanRepository;
import QuanLy.QLNS.Service.TaiKhoanService;

@Service
@Transactional
public class TaiKhoanServiceImpl implements TaiKhoanService {
    
    @Autowired
    private TaiKhoanRepository taiKhoanRepository;
    
    @Override
    public TaiKhoan save(TaiKhoan taiKhoan) {
        return taiKhoanRepository.save(taiKhoan);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<TaiKhoan> findById(Long id) {
        return taiKhoanRepository.findById(id);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<TaiKhoan> findAll() {
        return taiKhoanRepository.findAll();
    }
    
    @Override
    public void deleteById(Long id) {
        taiKhoanRepository.deleteById(id);
    }
    
    @Override
    public TaiKhoan update(Long id, TaiKhoan taiKhoan) {
        if (!taiKhoanRepository.existsById(id)) {
            throw new IllegalArgumentException("Tài khoản không tồn tại với ID: " + id);
        }
        taiKhoan.setTaikhoan_id(id);
        return taiKhoanRepository.save(taiKhoan);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Page<TaiKhoan> findAll(Pageable pageable) {
        return taiKhoanRepository.findAll(pageable);
    }
    
    @Override
    @Transactional(readOnly = true)
    public Optional<TaiKhoan> findByTenDangnhap(String tenDangnhap) {
        return taiKhoanRepository.findByTenDangnhap(tenDangnhap);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<TaiKhoan> findByQuyenHan(String quyenHan) {
        return taiKhoanRepository.findByQuyenHan(quyenHan);
    }
    
    @Override
    @Transactional(readOnly = true)
    public boolean existsByTenDangnhap(String tenDangnhap) {
        return taiKhoanRepository.existsByTenDangnhap(tenDangnhap);
    }
    
    @Override
    @Transactional(readOnly = true)
    public long count() {
        return taiKhoanRepository.count();
    }
    
    @Override
    @Transactional(readOnly = true)
    public long countByQuyenHan(String quyenHan) {
        return taiKhoanRepository.countByQuyenHan(quyenHan);
    }
}





