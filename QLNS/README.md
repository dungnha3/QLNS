# QLNS - Hệ thống Quản lý Nhân sự

## Mô tả
QLNS là một hệ thống quản lý nhân sự được xây dựng bằng Spring Boot, cung cấp các chức năng quản lý nhân viên, phòng ban, chức vụ, hợp đồng, chấm công, lương, đánh giá và nghỉ phép.

## Công nghệ sử dụng
- **Backend**: Spring Boot 3.5.6
- **Database**: H2 Database (in-memory)
- **Java**: JDK 21
- **Build Tool**: Maven
- **ORM**: JPA/Hibernate

## Cấu trúc dự án
```
src/main/java/QuanLy/QLNS/
├── Config/                 # Cấu hình bảo mật
├── Controller/             # REST API Controllers
├── Entity/                 # JPA Entities
├── Repository/             # Data Access Layer
├── Service/                # Business Logic Layer
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

## Cách chạy ứng dụng

### Yêu cầu hệ thống
- JDK 21 hoặc cao hơn
- Maven 3.6+

### Cách 1: Sử dụng Maven
```bash
cd QLNS
mvn spring-boot:run
```

### Cách 2: Sử dụng file batch (Windows)
```bash
cd QLNS
run.bat
```

### Cách 3: Build và chạy JAR
```bash
cd QLNS
mvn clean package
java -jar target/QLNS-0.0.1-SNAPSHOT.war
```

## Truy cập ứng dụng

- **API Base URL**: http://localhost:8080
- **H2 Database Console**: http://localhost:8080/h2-console
  - JDBC URL: `jdbc:h2:mem:qlnsdb`
  - Username: `sa`
  - Password: `password`

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

## Lưu ý

- Ứng dụng sử dụng H2 in-memory database, dữ liệu sẽ mất khi restart
- Security đã được disable để dễ dàng test API
- Tất cả endpoints đều hỗ trợ CORS
- Logging được bật để debug

## Phát triển thêm

Để phát triển thêm ứng dụng, bạn có thể:
1. Thêm validation cho các input
2. Implement authentication và authorization
3. Thêm unit tests
4. Tích hợp với database thật (MySQL, PostgreSQL)
5. Thêm frontend (React, Vue, Angular)
6. Deploy lên cloud (AWS, Azure, GCP)

