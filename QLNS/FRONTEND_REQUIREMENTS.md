# 📋 DANH SÁCH CHỨC NĂNG FRONTEND - QLNS

**Backend API:** http://localhost:8080  
**Demo:** admin / Admin@123456

---

## DANH SÁCH CHỨC NĂNG

### **1. Authentication** 🔐
**Mô tả:** Đăng nhập/đăng ký, lưu JWT token, protected routes theo role (ADMIN/MANAGER/EMPLOYEE)
**API:** `POST /api/auth/login`, `POST /api/auth/register`

### **2. Dashboard** 📊
**Mô tả:** Trang tổng quan với 4 cards thống kê (Tổng NV, Đơn nghỉ phép chờ, Bảng lương chờ, HĐ hết hạn)
**API:** `GET /api/dashboard/tong-quan`

### **3. Quản lý Nhân viên** 👥
**Mô tả:** CRUD nhân viên, table có pagination/search/filter, xem chi tiết với 6 tabs (Thông tin, HĐ, Chấm công, Lương, Nghỉ phép, Đánh giá)
**API:** `GET/POST/PUT/DELETE /api/nhanvien`, `GET /api/nhanvien/{id}`

### **4. Quản lý Phòng ban** 🏢
**Mô tả:** CRUD phòng ban, xem danh sách nhân viên trong phòng
**API:** `GET/POST/PUT/DELETE /api/phongban`

### **5. Quản lý Chức vụ** 👔
**Mô tả:** CRUD chức vụ
**API:** `GET/POST/PUT/DELETE /api/chucvu`

### **6. Quản lý Hợp đồng** 📄
**Mô tả:** CRUD hợp đồng, highlight HĐ sắp hết hạn (<30 ngày) bằng màu vàng/đỏ
**API:** `GET/POST/PUT/DELETE /api/hopdong`

### **7. Chấm công** ⏰
**Mô tả:** Ghi nhận giờ vào/ra, tự động tính tổng giờ làm, xem theo tháng (calendar view)
**API:** `GET/POST/PUT/DELETE /api/chamcong`

### **8. Quản lý Lương** 💰 ⭐⭐⭐
**Mô tả:** CRUD bảng lương, **TÍNH LƯƠNG TỰ ĐỘNG** (chọn NV + tháng/năm → tự tính BHXH/BHYT/BHTN/Thuế), phê duyệt/thanh toán
**API:** `GET/POST/PUT/DELETE /api/bangluong`, `POST /api/bangluong/tinh-luong?nhanVienId=1&thang=10&nam=2024`

### **9. Nghỉ phép** 🏖️ ⭐⭐
**Mô tả:** Đăng ký nghỉ phép, **PHÊ DUYỆT ĐƠN** (modal duyệt/từ chối + ghi chú), xem lịch sử theo trạng thái
**API:** `GET/POST/PUT/DELETE /api/nghiphep`, `POST /api/nghiphep/{id}/phe-duyet`

### **10. Đánh giá** 📝
**Mô tả:** CRUD đánh giá nhân viên (xếp loại: XUẤT_SẮC, TỐT, TRUNG_BÌNH, YẾU)
**API:** `GET/POST/PUT/DELETE /api/danhgia`

### **11. Quản lý Tài khoản** 🔐
**Mô tả:** CRUD tài khoản (chỉ ADMIN), đổi mật khẩu
**API:** `GET/POST/PUT/DELETE /api/tai-khoan`

---

## PHÂN QUYỀN

| Chức năng | ADMIN | MANAGER | EMPLOYEE |
|-----------|-------|---------|----------|
| Dashboard | ✅    | ✅     | ✅       |
| Nhân viên | ✅    | ✅ | ❌ |
| Phòng ban | ✅ | ✅ | ❌ |
| Chức vụ | ✅ | ✅ | ❌ |
| Hợp đồng | ✅ | ✅ | ✅ (chỉ xem của mình) |
| Chấm công | ✅ | ✅ | ✅ |
| Bảng lương | ✅ | ✅ | ✅ (chỉ xem của mình) |
| Nghỉ phép | ✅ | ✅ | ✅ |
| Đánh giá | ✅ | ✅ | ✅ (chỉ xem của mình) |
| Tài khoản | ✅ | ❌ | ❌ |

---

## LƯU Ý QUAN TRỌNG

### **Authentication:**
```javascript
// Mỗi request cần header:
Authorization: Bearer YOUR_TOKEN

// Response format:
{ "success": true/false, "message": "...", "data": {...} }
```

### **Pagination:**
```javascript
GET /api/nhanvien?page=0&size=10&sort=ho_ten,asc
```

### **2 Tính năng đặc biệt:**
1. **Tính lương tự động:** Button riêng → Modal chọn NV + tháng/năm → Hiển thị breakdown (Lương CB, Phụ cấp, BHXH, BHYT, BHTN, Thuế, Thực lãnh)
2. **Phê duyệt nghỉ phép:** Tab "Chờ duyệt" → Button Duyệt/Từ chối → Modal nhập ghi chú

---

**Xem thêm:** `API_GUIDE.md`, `SETUP_GUIDE.md`
