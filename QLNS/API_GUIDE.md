# HƯỚNG DẪN SỬ DỤNG API QLNS VỚI AUTHENTICATION

## 🔐 Authentication

Hệ thống sử dụng JWT (JSON Web Token) để xác thực người dùng.

### 🔐 Tạo tài khoản đầu tiên:
⚠️ **LƯU Ý**: Hệ thống không có tài khoản mặc định vì lý do bảo mật. Bạn cần tạo tài khoản admin đầu tiên qua API đăng ký (xem bên dưới).

## 📝 API Endpoints

### 1. Authentication APIs

#### Đăng nhập
```http
POST /api/auth/login
Content-Type: application/json

{
    "tenDangnhap": "admin",
    "matKhau": "Admin@123456"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Đăng nhập thành công",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "type": "Bearer",
        "tenDangnhap": "admin",
        "quyenHan": "ADMIN",
        "nhanVienId": null
    },
    "timestamp": "2024-01-01T10:00:00"
}
```

#### Đăng ký tài khoản mới
```http
POST /api/auth/register
Content-Type: application/json

{
    "ten_dangnhap": "newuser",
    "mat_khau": "SecurePass123!",
    "quyen_han": "EMPLOYEE"
}
```

**Yêu cầu mật khẩu mạnh:**
- Ít nhất 8 ký tự
- Có chữ hoa, chữ thường, số và ký tự đặc biệt
- Không được là mật khẩu phổ biến

#### Đổi mật khẩu
```http
POST /api/auth/change-password
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
    "oldPassword": "currentPassword",
    "newPassword": "NewSecurePass123!"
}
```

#### Đăng xuất
```http
POST /api/auth/logout
Authorization: Bearer <your-jwt-token>
```
**Lưu ý**: Vì JWT là stateless, logout chỉ cần xóa token ở client (localStorage/sessionStorage). Endpoint này không thực hiện blacklist token.

### 2. Sử dụng Token

Sau khi đăng nhập thành công, sử dụng token trong header `Authorization`:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Phân quyền API

#### 🔴 ADMIN Only:
- `/api/tai-khoan/**` - Quản lý tài khoản

#### 🟡 ADMIN + MANAGER:
- `/api/nhanvien/**` - Quản lý nhân viên
- `/api/phongban/**` - Quản lý phòng ban
- `/api/chucvu/**` - Quản lý chức vụ

#### 🟢 ALL AUTHENTICATED (ADMIN + MANAGER + EMPLOYEE):
- `/api/chamcong/**` - Chấm công
- `/api/nghiphep/**` - Nghỉ phép
- `/api/bangluong/**` - Quản lý lương
- `/api/hopdong/**` - Quản lý hợp đồng
- `/api/danhgia/**` - Quản lý đánh giá

## 🧪 Test với Postman

### 1. Đăng nhập để lấy token:
```
POST http://localhost:8080/api/auth/login
```

### 2. Copy token từ response

### 3. Sử dụng token trong các request khác:
```
GET http://localhost:8080/api/nhanvien
Authorization: Bearer <your-token>
```

## 📋 Ví dụ CRUD với Authentication

### Tạo nhân viên mới (cần quyền ADMIN/MANAGER):
```http
POST /api/nhanvien
Authorization: Bearer <your-token>
Content-Type: application/json

{
    "ho_ten": "Nguyễn Văn A",
    "email": "nguyenvana@email.com",
    "so_dien_thoai": "0123456789",
    "dia_chi": "Hà Nội",
    "gioi_tinh": "Nam",
    "ngay_sinh": "1990-01-01",
    "ngay_vao_lam": "2024-01-01",
    "cccd": "123456789012",
    "trangThai": "DANG_LAM_VIEC"
}
```

### Lấy danh sách nhân viên:
```http
GET /api/nhanvien?page=0&size=10
Authorization: Bearer <your-token>
```

## ⚠️ Error Responses

### 401 Unauthorized:
```json
{
    "success": false,
    "message": "Token không hợp lệ hoặc đã hết hạn",
    "data": null,
    "timestamp": "2024-01-01T10:00:00"
}
```

### 403 Forbidden:
```json
{
    "success": false,
    "message": "Bạn không có quyền truy cập tài nguyên này",
    "data": null,
    "timestamp": "2024-01-01T10:00:00"
}
```

### 400 Validation Error:
```json
{
    "success": false,
    "message": "Dữ liệu không hợp lệ",
    "data": {
        "tenDangnhap": "Tên đăng nhập không được để trống",
        "matKhau": "Mật khẩu phải có ít nhất 6 ký tự"
    },
    "timestamp": "2024-01-01T10:00:00"
}
```

## 🔧 Cấu hình

### JWT Settings (application.properties):
```properties
app.jwt.secret=mySecretKey123456789012345678901234567890123456789012345678901234567890
app.jwt.expiration=86400000  # 24 hours
```

### CORS Settings:
- Allowed Origins: `http://localhost:*`, `http://127.0.0.1:*`
- Allowed Methods: `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`
- Allowed Headers: `*`

## 🚀 Khởi chạy ứng dụng

```bash
mvn spring-boot:run
```

Ứng dụng sẽ chạy tại: `http://localhost:8080`

## 📊 Database

- **Database**: SQL Server
- **Connection**: `jdbc:sqlserver://localhost:1433;databaseName=quanlynhansu`
- **Username**: `nhombay`
- **Password**: `123`

Tài khoản mặc định sẽ được tạo tự động khi khởi động ứng dụng.
