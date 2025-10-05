# 🚀 HƯỚNG DẪN KHỞI ĐỘNG VÀ SETUP QLNS

## 📋 Yêu cầu hệ thống
- Java 21+
- Maven 3.6+
- SQL Server 2019+
- Postman (để test API)

## 1️⃣ CÀI ĐẶT VÀ KHỞI ĐỘNG

### **Bước 1: Chuẩn bị Database**

```sql
-- Tạo database
CREATE DATABASE quanlynhansu;

-- Tạo user
CREATE LOGIN nhombay WITH PASSWORD = '123';
USE quanlynhansu;
CREATE USER nhombay FOR LOGIN nhombay;
ALTER ROLE db_owner ADD MEMBER nhombay;
```

### **Bước 2: Cấu hình application.properties**

File đã được config sẵn:
```properties
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=quanlynhansu
spring.datasource.username=nhombay
spring.datasource.password=123
```

### **Bước 3: Build và chạy**

```bash
cd QLNS
mvn clean install
mvn spring-boot:run
```

Hoặc build thành file JAR:
```bash
mvn clean package
java -jar target/QLNS-0.0.1-SNAPSHOT.jar
```

## 2️⃣ TẠO TÀI KHOẢN ADMIN ĐẦU TIÊN

**⚠️ QUAN TRỌNG**: Không có tài khoản mặc định vì lý do bảo mật!

### **Cách 1: Dùng Postman**

1. Import file `QLNS_Postman_Collection.json`
2. Gọi API Register:

```http
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
    "ten_dangnhap": "admin",
    "mat_khau": "Admin@123456",
    "quyen_han": "ADMIN"
}
```

### **Cách 2: Dùng curl**

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "ten_dangnhap": "admin",
    "mat_khau": "Admin@123456",
    "quyen_han": "ADMIN"
  }'
```

### **Cách 3: Dùng PowerShell**

```powershell
$body = @{
    ten_dangnhap = "admin"
    mat_khau = "Admin@123456"
    quyen_han = "ADMIN"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/api/auth/register" `
  -Method Post `
  -Body $body `
  -ContentType "application/json"
```

### **Cách 4: Dùng frontend-demo.html**

1. Mở file `frontend-demo.html` trong browser
2. Sửa code tạm thời để gọi register API
3. Sau khi tạo xong, login bình thường

## 3️⃣ ĐĂNG NHẬP

Sau khi tạo tài khoản admin:

```http
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
    "tenDangnhap": "admin",
    "matKhau": "Admin@123456"
}
```

Response sẽ trả về token:
```json
{
    "success": true,
    "message": "Đăng nhập thành công",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "type": "Bearer",
        "tenDangnhap": "admin",
        "quyenHan": "ADMIN"
    }
}
```

## 4️⃣ SỬ DỤNG TOKEN

Thêm token vào header của mọi request:

```http
GET http://localhost:8080/api/nhanvien
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 5️⃣ TẠO TÀI KHOẢN KHÁC

Sau khi login với admin, tạo các tài khoản khác:

### **Manager:**
```http
POST http://localhost:8080/api/tai-khoan
Authorization: Bearer <admin-token>
Content-Type: application/json

{
    "ten_dangnhap": "manager",
    "mat_khau": "Manager@123456",
    "quyen_han": "MANAGER"
}
```

### **Employee:**
```http
POST http://localhost:8080/api/tai-khoan
Authorization: Bearer <admin-token>
Content-Type: application/json

{
    "ten_dangnhap": "employee",
    "mat_khau": "Employee@123456",
    "quyen_han": "EMPLOYEE"
}
```

## 6️⃣ YÊU CẦU MẬT KHẨU

Mật khẩu phải thỏa mãn:
- ✅ Ít nhất 8 ký tự
- ✅ Có chữ hoa (A-Z)
- ✅ Có chữ thường (a-z)
- ✅ Có số (0-9)
- ✅ Có ký tự đặc biệt (@$!%*?&)

Ví dụ mật khẩu hợp lệ:
- `Admin@123456`
- `SecurePass123!`
- `MyP@ssw0rd`

## 7️⃣ PHÂN QUYỀN API

### **🔴 ADMIN Only:**
- `/api/tai-khoan/**` - Quản lý tài khoản

### **🟡 ADMIN + MANAGER:**
- `/api/nhanvien/**` - Nhân viên
- `/api/phong-ban/**` - Phòng ban
- `/api/chuc-vu/**` - Chức vụ
- `/api/hop-dong/**` - Hợp đồng
- `/api/bang-luong/**` - Lương
- `/api/danh-gia/**` - Đánh giá

### **🟢 ALL (Đã đăng nhập):**
- `/api/cham-cong/**` - Chấm công
- `/api/nghi-phep/**` - Nghỉ phép

### **⚪ PUBLIC:**
- `/api/auth/login` - Đăng nhập
- `/api/auth/register` - Đăng ký

## 8️⃣ TEST API

### **Dùng Postman Collection:**

1. Import `QLNS_Postman_Collection.json`
2. Chạy request "Register" để tạo admin
3. Chạy request "Login" (token tự động lưu)
4. Test các API khác

### **Dùng Frontend Demo:**

```bash
# Mở trong browser
start frontend-demo.html
```

## 9️⃣ TROUBLESHOOTING

### **Lỗi: Database connection failed**
```
✅ Kiểm tra SQL Server đang chạy
✅ Kiểm tra username/password trong application.properties
✅ Kiểm tra database đã được tạo
```

### **Lỗi: 401 Unauthorized**
```
✅ Kiểm tra token có hợp lệ
✅ Token đã hết hạn (24h) → login lại
✅ Token đúng format: Bearer <token>
```

### **Lỗi: 403 Forbidden**
```
✅ Kiểm tra quyền hạn của tài khoản
✅ ADMIN mới có quyền /api/tai-khoan
✅ EMPLOYEE không được truy cập /api/nhanvien
```

### **Lỗi: Password validation failed**
```
✅ Mật khẩu phải ≥ 8 ký tự
✅ Phải có chữ hoa, chữ thường, số, ký tự đặc biệt
✅ Không được dùng mật khẩu phổ biến (password, 123456, admin...)
```

## 🔟 PRODUCTION DEPLOYMENT

### **Bước 1: Thay đổi cấu hình**

```properties
# Sử dụng environment variables
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
app.jwt.secret=${JWT_SECRET}
```

### **Bước 2: Set profile production**

```bash
java -jar QLNS.war --spring.profiles.active=prod
```

### **Bước 3: Enable HTTPS**

Uncomment trong `application-prod.properties`:
```properties
server.ssl.enabled=true
server.ssl.key-store=${SSL_KEYSTORE_PATH}
server.ssl.key-store-password=${SSL_KEYSTORE_PASSWORD}
```

### **Bước 4: Tạo admin qua API**

Không có tài khoản mặc định trong production!
- Dùng API `/api/auth/register` để tạo admin đầu tiên
- Hoặc insert trực tiếp vào database với mật khẩu đã mã hóa BCrypt

## 📚 TÀI LIỆU THAM KHẢO

- **API_GUIDE.md** - Hướng dẫn sử dụng API chi tiết
- **FRONTEND_INTEGRATION.md** - Tích hợp Frontend
- **QLNS_Postman_Collection.json** - Collection test API
- **frontend-demo.html** - Demo Frontend

## 🔒 BẢO MẬT

### ✅ **Đã implement:**
- JWT Authentication
- BCrypt password hashing
- Role-based authorization
- Password policy (8+ chars, complex)
- CORS configuration
- Input validation

### 🚨 **Khuyến nghị:**
- Đổi JWT secret trong production
- Sử dụng HTTPS
- Enable rate limiting
- Add audit logging
- Regular security updates

## 📞 HỖ TRỢ

Nếu gặp vấn đề:
1. Kiểm tra logs trong console
2. Xem file API_GUIDE.md
3. Test với Postman Collection
4. Kiểm tra database connection

---

**🎉 Chúc bạn triển khai thành công!**

