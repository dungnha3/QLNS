# 🎨 HƯỚNG DẪN TÍCH HỢP FRONTEND

## 📋 Tổng quan

Backend QLNS cung cấp RESTful API với JWT authentication. Frontend chỉ cần:
1. Gọi API qua HTTP
2. Gửi JWT token trong header
3. Xử lý response JSON

## 🔐 Authentication Flow

### 1. Đăng nhập
```javascript
// Request
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "tenDangnhap": "admin",
  "matKhau": "your-password"
}

// Response
{
  "success": true,
  "message": "Đăng nhập thành công",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "type": "Bearer",
    "tenDangnhap": "admin",
    "quyenHan": "ADMIN",
    "nhanVienId": null
  }
}
```

### 2. Lưu token
```javascript
localStorage.setItem('token', response.data.token);
localStorage.setItem('quyenHan', response.data.quyenHan);
```

### 3. Sử dụng token
```javascript
fetch('http://localhost:8080/api/nhanvien', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
```

## 🛠️ Tích hợp với Framework

### React + Axios

#### Setup
```bash
npm install axios
```

#### API Service (`services/api.js`)
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api'
});

// Interceptor: Tự động thêm token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor: Xử lý lỗi
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

#### Login Component
```jsx
import { useState } from 'react';
import api from '../services/api';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const response = await api.post('/auth/login', {
        tenDangnhap: username,
        matKhau: password
      });
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('quyenHan', response.data.data.quyenHan);
        window.location.href = '/dashboard';
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input 
        value={username} 
        onChange={e => setUsername(e.target.value)}
        placeholder="Tên đăng nhập" 
      />
      <input 
        type="password"
        value={password} 
        onChange={e => setPassword(e.target.value)}
        placeholder="Mật khẩu" 
      />
      <button type="submit">Đăng nhập</button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
```

#### Data Fetching
```jsx
import { useState, useEffect } from 'react';
import api from '../services/api';

function NhanVienList() {
  const [nhanViens, setNhanViens] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNhanViens();
  }, []);

  const fetchNhanViens = async () => {
    try {
      const response = await api.get('/nhanvien');
      if (response.data.success) {
        setNhanViens(response.data.data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {nhanViens.map(nv => (
        <div key={nv.nhanvien_id}>
          <h3>{nv.ho_ten}</h3>
          <p>{nv.email}</p>
        </div>
      ))}
    </div>
  );
}
```

### Vue 3 + Axios

#### API Service (`services/api.js`)
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api'
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

#### Composable (`composables/useAuth.js`)
```javascript
import { ref } from 'vue';
import api from '../services/api';
import { useRouter } from 'vue-router';

export function useAuth() {
  const router = useRouter();
  const error = ref('');
  const loading = ref(false);

  const login = async (username, password) => {
    loading.value = true;
    error.value = '';

    try {
      const response = await api.post('/auth/login', {
        tenDangnhap: username,
        matKhau: password
      });

      if (response.data.success) {
        const { token, quyenHan } = response.data.data;
        localStorage.setItem('token', token);
        localStorage.setItem('quyenHan', quyenHan);
        router.push('/dashboard');
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Đăng nhập thất bại';
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    localStorage.clear();
    router.push('/login');
  };

  return { login, logout, error, loading };
}
```

#### Component
```vue
<template>
  <div>
    <form @submit.prevent="handleLogin">
      <input v-model="username" placeholder="Tên đăng nhập" />
      <input v-model="password" type="password" placeholder="Mật khẩu" />
      <button :disabled="loading">Đăng nhập</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuth } from '../composables/useAuth';

const username = ref('');
const password = ref('');
const { login, error, loading } = useAuth();

const handleLogin = () => {
  login(username.value, password.value);
};
</script>
```

### Angular + HttpClient

#### Service (`services/auth.service.ts`)
```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, {
      tenDangnhap: username,
      matKhau: password
    }).pipe(
      tap((response: any) => {
        if (response.success) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('quyenHan', response.data.quyenHan);
        }
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.clear();
  }
}
```

#### Interceptor (`interceptors/auth.interceptor.ts`)
```typescript
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = this.authService.getToken();
    
    if (token) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(cloned);
    }
    
    return next.handle(req);
  }
}
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/logout` - Đăng xuất
- `POST /api/auth/change-password` - Đổi mật khẩu

### Nhân viên (ADMIN/MANAGER)
- `GET /api/nhanvien` - Danh sách nhân viên
- `POST /api/nhanvien` - Tạo nhân viên
- `GET /api/nhanvien/{id}` - Chi tiết nhân viên
- `PUT /api/nhanvien/{id}` - Cập nhật nhân viên
- `DELETE /api/nhanvien/{id}` - Xóa nhân viên

### Phòng ban (ADMIN/MANAGER)
- `GET /api/phong-ban` - Danh sách phòng ban
- `POST /api/phong-ban` - Tạo phòng ban
- `GET /api/phong-ban/{id}` - Chi tiết phòng ban
- `PUT /api/phong-ban/{id}` - Cập nhật phòng ban
- `DELETE /api/phong-ban/{id}` - Xóa phòng ban

### Chấm công (ALL)
- `GET /api/cham-cong` - Danh sách chấm công
- `POST /api/cham-cong` - Tạo bản ghi chấm công

## 🔒 Phân quyền trong Frontend

```javascript
const quyenHan = localStorage.getItem('quyenHan');

// Kiểm tra quyền
function canAccessAdminPanel() {
  return quyenHan === 'ADMIN';
}

function canManageNhanVien() {
  return ['ADMIN', 'MANAGER'].includes(quyenHan);
}

// React example
function AdminPanel() {
  const quyenHan = localStorage.getItem('quyenHan');
  
  if (quyenHan !== 'ADMIN') {
    return <Navigate to="/unauthorized" />;
  }
  
  return <div>Admin Content</div>;
}
```

## ⚠️ Lưu ý quan trọng

1. **CORS**: Backend đã cấu hình CORS cho `localhost:*`
2. **Token expiry**: Token có hiệu lực 24h
3. **Error handling**: Luôn xử lý lỗi 401 (Unauthorized) để redirect về login
4. **Security**: Không lưu mật khẩu, chỉ lưu token
5. **HTTPS**: Production phải dùng HTTPS

## 🎯 Checklist Frontend

- [ ] Setup API service với base URL
- [ ] Implement login/logout
- [ ] Lưu token vào localStorage
- [ ] Tự động thêm token vào headers
- [ ] Xử lý lỗi 401/403
- [ ] Implement protected routes
- [ ] Kiểm tra quyền truy cập
- [ ] Clear token khi logout
- [ ] Handle token expiry

## 📞 Test API

Dùng file `frontend-demo.html` để test nhanh hoặc dùng Postman/Thunder Client.


