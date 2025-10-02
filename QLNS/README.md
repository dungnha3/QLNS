# QLNS - Hệ thống Quản lý Nhân sự

## Mô tả
QLNS là một hệ thống quản lý nhân sự được xây dựng bằng Spring Boot, cung cấp các chức năng quản lý nhân viên, phòng ban, chức vụ, hợp đồng, chấm công, lương, đánh giá và nghỉ phép.

## Công nghệ sử dụng
- **Backend**: Spring Boot 3.5.6
- **Database**: SQL Server 2019+
- **Java**: JDK 21
- **Build Tool**: Maven
- **ORM**: JPA/Hibernate
- **Security**: Spring Security + JWT
- **Authentication**: Bearer Token (JWT)

## Cấu trúc dự án
```
src/main/java/QuanLy/QLNS/
├── Config/                 # Security & Configuration
├── Controller/             # REST API Controllers
├── dto/                    # Data Transfer Objects
├── Entity/                 # JPA Entities
├── Repository/             # Data Access Layer
├── Security/               # JWT Authentication Filter
├── Service/                # Business Logic Layer
├── util/                   # Utilities (JWT, Validation)
└── QlnsApplication.java    # Main Application Class
```

## Các chức năng chính

### 1. Quản lý Nhân viên
- CRUD operations cho nhân viên
- Tìm kiếm và phân trang
- Quản lý thông tin cá nhân

### 2. Quản lý Phòng ban
- Tạo, sửa, xóa phòng ban
- Quản lý cấu trúc tổ chức

### 3. Quản lý Chức vụ
- Quản lý các chức vụ trong công ty
- Phân quyền theo chức vụ

### 4. Quản lý Hợp đồng
- Tạo và quản lý hợp đồng lao động
- Theo dõi thời hạn hợp đồng

### 5. Chấm công
- Ghi nhận thời gian làm việc
- Tính toán giờ làm việc

### 6. Quản lý Lương
- Tính toán lương theo tháng
- Quản lý các khoản phụ cấp

### 7. Đánh giá Nhân viên
- Hệ thống đánh giá hiệu suất
- Theo dõi tiến độ công việc

### 8. Quản lý Nghỉ phép
- Đăng ký và phê duyệt nghỉ phép
- Theo dõi số ngày nghỉ còn lại

### 9. Quản lý Tài khoản
- Hệ thống đăng nhập
- Phân quyền người dùng

## 🚀 Khởi động nhanh

### Xem hướng dẫn chi tiết: [SETUP_GUIDE.md](SETUP_GUIDE.md)

### Các bước cơ bản:

1. **Setup Database:**
   - SQL Server 2019+
   - Database: `quanlynhansu`
   - User: `nhombay` / Password: `123`

2. **Chạy ứng dụng:**
   ```bash
   cd QLNS
   mvn spring-boot:run
   ```

3. **Tạo tài khoản admin đầu tiên:**
   ```bash
   curl -X POST http://localhost:8080/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"ten_dangnhap":"admin","mat_khau":"Admin@123456","quyen_han":"ADMIN"}'
   ```

4. **Đăng nhập:**
   ```bash
   curl -X POST http://localhost:8080/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"tenDangnhap":"admin","matKhau":"Admin@123456"}'
   ```

## 📚 Tài liệu

- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Hướng dẫn cài đặt chi tiết
- **[API_GUIDE.md](API_GUIDE.md)** - Tài liệu API đầy đủ
- **[FRONTEND_INTEGRATION.md](FRONTEND_INTEGRATION.md)** - Tích hợp Frontend
- **[QLNS_Postman_Collection.json](QLNS_Postman_Collection.json)** - Postman Collection
- **[frontend-demo.html](frontend-demo.html)** - Demo Frontend

## API Endpoints

### Test Endpoints
- `GET /` - Trang chủ
- `GET /api/test` - Kiểm tra API

### Nhân viên
- `GET /api/nhan-vien` - Lấy danh sách nhân viên
- `POST /api/nhan-vien` - Tạo nhân viên mới
- `GET /api/nhan-vien/{id}` - Lấy thông tin nhân viên
- `PUT /api/nhan-vien/{id}` - Cập nhật nhân viên
- `DELETE /api/nhan-vien/{id}` - Xóa nhân viên

### Phòng ban
- `GET /api/phong-ban` - Lấy danh sách phòng ban
- `POST /api/phong-ban` - Tạo phòng ban mới
- `GET /api/phong-ban/{id}` - Lấy thông tin phòng ban
- `PUT /api/phong-ban/{id}` - Cập nhật phòng ban
- `DELETE /api/phong-ban/{id}` - Xóa phòng ban

### Chức vụ
- `GET /api/chuc-vu` - Lấy danh sách chức vụ
- `POST /api/chuc-vu` - Tạo chức vụ mới
- `GET /api/chuc-vu/{id}` - Lấy thông tin chức vụ
- `PUT /api/chuc-vu/{id}` - Cập nhật chức vụ
- `DELETE /api/chuc-vu/{id}` - Xóa chức vụ

### Hợp đồng
- `GET /api/hop-dong` - Lấy danh sách hợp đồng
- `POST /api/hop-dong` - Tạo hợp đồng mới
- `GET /api/hop-dong/{id}` - Lấy thông tin hợp đồng
- `PUT /api/hop-dong/{id}` - Cập nhật hợp đồng
- `DELETE /api/hop-dong/{id}` - Xóa hợp đồng

### Chấm công
- `GET /api/cham-cong` - Lấy danh sách chấm công
- `POST /api/cham-cong` - Tạo bản ghi chấm công
- `GET /api/cham-cong/{id}` - Lấy thông tin chấm công
- `PUT /api/cham-cong/{id}` - Cập nhật chấm công
- `DELETE /api/cham-cong/{id}` - Xóa chấm công

### Bảng lương
- `GET /api/bang-luong` - Lấy danh sách bảng lương
- `POST /api/bang-luong` - Tạo bảng lương mới
- `GET /api/bang-luong/{id}` - Lấy thông tin bảng lương
- `PUT /api/bang-luong/{id}` - Cập nhật bảng lương
- `DELETE /api/bang-luong/{id}` - Xóa bảng lương

### Đánh giá
- `GET /api/danh-gia` - Lấy danh sách đánh giá
- `POST /api/danh-gia` - Tạo đánh giá mới
- `GET /api/danh-gia/{id}` - Lấy thông tin đánh giá
- `PUT /api/danh-gia/{id}` - Cập nhật đánh giá
- `DELETE /api/danh-gia/{id}` - Xóa đánh giá

### Nghỉ phép
- `GET /api/nghi-phep` - Lấy danh sách nghỉ phép
- `POST /api/nghi-phep` - Tạo đơn nghỉ phép
- `GET /api/nghi-phep/{id}` - Lấy thông tin nghỉ phép
- `PUT /api/nghi-phep/{id}` - Cập nhật nghỉ phép
- `DELETE /api/nghi-phep/{id}` - Xóa nghỉ phép

### Tài khoản
- `GET /api/tai-khoan` - Lấy danh sách tài khoản
- `POST /api/tai-khoan` - Tạo tài khoản mới
- `GET /api/tai-khoan/{id}` - Lấy thông tin tài khoản
- `PUT /api/tai-khoan/{id}` - Cập nhật tài khoản
- `DELETE /api/tai-khoan/{id}` - Xóa tài khoản

## Testing với Postman

Sử dụng file `QLNS_API_Collection.json` để import các API endpoints vào Postman để test.

## 🔒 Bảo mật

### ✅ Đã implement:
- JWT Authentication với Bearer Token
- BCrypt Password Hashing
- Role-based Authorization (ADMIN, MANAGER, EMPLOYEE)
- Password Policy (8+ chars, complex requirements)
- Input Validation
- CORS Configuration
- Secure Random Password Generator

### 🔐 Phân quyền:
- **ADMIN**: Quản lý tài khoản
- **ADMIN + MANAGER**: Quản lý nhân viên, phòng ban, chức vụ, hợp đồng, lương, đánh giá
- **ALL**: Chấm công, nghỉ phép

## 🧪 Testing

### Postman:
```bash
# Import collection
Import file: QLNS_Postman_Collection.json
```

### Frontend Demo:
```bash
# Mở trong browser
start frontend-demo.html
```

### Unit Tests:
```bash
mvn test
```

## 📦 Deployment

### Development:
```bash
mvn spring-boot:run
```

### Production:
```bash
java -jar QLNS.war --spring.profiles.active=prod
```

Xem chi tiết: [SETUP_GUIDE.md](SETUP_GUIDE.md)

## 📞 Hỗ trợ

- Xem [API_GUIDE.md](API_GUIDE.md) để biết chi tiết API
- Xem [SETUP_GUIDE.md](SETUP_GUIDE.md) để troubleshooting
- Test với Postman Collection để debug

---
**Built with ❤️ using Spring Boot 3.5.6**





