package QuanLy.QLNS.Service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import QuanLy.QLNS.Entity.TaiKhoan;
import QuanLy.QLNS.Repository.TaiKhoanRepository;
import QuanLy.QLNS.Service.impl.TaiKhoanServiceImpl;

@ExtendWith(MockitoExtension.class)
class TaiKhoanServiceTest {

    @Mock
    private TaiKhoanRepository taiKhoanRepository;

    @InjectMocks
    private TaiKhoanServiceImpl taiKhoanService;

    private TaiKhoan taiKhoan;

    @BeforeEach
    void setUp() {
        taiKhoan = new TaiKhoan();
        taiKhoan.setTaikhoan_id(1L);
        taiKhoan.setTen_dangnhap("testuser");
        taiKhoan.setMat_khau("password123");
        taiKhoan.setQuyen_han("EMPLOYEE");
    }

    @Test
    void testSave() {
        // Given
        when(taiKhoanRepository.save(any(TaiKhoan.class))).thenReturn(taiKhoan);

        // When
        TaiKhoan result = taiKhoanService.save(taiKhoan);

        // Then
        assertNotNull(result);
        assertEquals("testuser", result.getTen_dangnhap());
        assertEquals("EMPLOYEE", result.getQuyen_han());
        verify(taiKhoanRepository, times(1)).save(taiKhoan);
    }

    @Test
    void testFindById() {
        // Given
        when(taiKhoanRepository.findById(1L)).thenReturn(Optional.of(taiKhoan));

        // When
        Optional<TaiKhoan> result = taiKhoanService.findById(1L);

        // Then
        assertTrue(result.isPresent());
        assertEquals("testuser", result.get().getTen_dangnhap());
        verify(taiKhoanRepository, times(1)).findById(1L);
    }

    @Test
    void testFindByTenDangnhap() {
        // Given
        when(taiKhoanRepository.findByTenDangnhap("testuser")).thenReturn(Optional.of(taiKhoan));

        // When
        Optional<TaiKhoan> result = taiKhoanService.findByTenDangnhap("testuser");

        // Then
        assertTrue(result.isPresent());
        assertEquals("testuser", result.get().getTen_dangnhap());
        verify(taiKhoanRepository, times(1)).findByTenDangnhap("testuser");
    }

    @Test
    void testExistsByTenDangnhap() {
        // Given
        when(taiKhoanRepository.existsByTenDangnhap("testuser")).thenReturn(true);

        // When
        boolean result = taiKhoanService.existsByTenDangnhap("testuser");

        // Then
        assertTrue(result);
        verify(taiKhoanRepository, times(1)).existsByTenDangnhap("testuser");
    }

    @Test
    void testUpdate() {
        // Given
        when(taiKhoanRepository.existsById(1L)).thenReturn(true);
        when(taiKhoanRepository.save(any(TaiKhoan.class))).thenReturn(taiKhoan);

        // When
        TaiKhoan result = taiKhoanService.update(1L, taiKhoan);

        // Then
        assertNotNull(result);
        assertEquals(1L, result.getTaikhoan_id());
        verify(taiKhoanRepository, times(1)).existsById(1L);
        verify(taiKhoanRepository, times(1)).save(taiKhoan);
    }

    @Test
    void testUpdateNotFound() {
        // Given
        when(taiKhoanRepository.existsById(1L)).thenReturn(false);

        // When & Then
        assertThrows(IllegalArgumentException.class, () -> {
            taiKhoanService.update(1L, taiKhoan);
        });
        verify(taiKhoanRepository, times(1)).existsById(1L);
        verify(taiKhoanRepository, never()).save(any());
    }
}

