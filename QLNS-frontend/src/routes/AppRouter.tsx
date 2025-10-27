import React from 'react'
import { BrowserRouter, Navigate, Route, Routes, Outlet } from 'react-router-dom'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import MainLayout from '../layouts/MainLayout'
import { useAuthStore } from '../stores/auth'
import NhanVienList from '../pages/nhanvien/List'
import NhanVienDetail from '../pages/nhanvien/Detail'
import PhongBanList from '../pages/phongban/List'
import PhongBanDetail from '../pages/phongban/Detail'
import ChucVuList from '../pages/chucvu/List'
import HopDongList from '../pages/hopdong/List'
import ChamCongList from '../pages/chamcong/List'
import BangLuongList from '../pages/bangluong/List'
import NghiPhepList from '../pages/nghiphep/List'
import TaiKhoanList from '../pages/taikhoan/List'

function RequireAuth({ children, allow }: { children: React.ReactElement; allow?: Array<'ADMIN'|'MANAGER'|'EMPLOYEE'> }) {
  const { token, user } = useAuthStore()
  if (!token) return <Navigate to="/login" replace />
  if (allow && user && user.role && !allow.includes(user.role)) return <Navigate to="/" replace />
  return children
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/** Removed register and change-password routes per request */}
        <Route
          path="/"
          element={
            <RequireAuth>
              <MainLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Dashboard />} />
          <Route
            path="phongban"
            element={
              <RequireAuth allow={['ADMIN','MANAGER']}>
                <SectionOutlet />
              </RequireAuth>
            }
          >
            <Route index element={<PhongBanList />} />
            <Route path=":id" element={<PhongBanDetail />} />
          </Route>
          <Route
            path="hopdong"
            element={
              <RequireAuth allow={['ADMIN','MANAGER','EMPLOYEE']}>
                <SectionOutlet />
              </RequireAuth>
            }
          >
            <Route index element={<HopDongList />} />
          </Route>
          <Route
            path="chamcong"
            element={
              <RequireAuth allow={['ADMIN','MANAGER','EMPLOYEE']}>
                <SectionOutlet />
              </RequireAuth>
            }
          >
            <Route index element={<ChamCongList />} />
          </Route>
          <Route
            path="bangluong"
            element={
              <RequireAuth allow={['ADMIN','MANAGER','EMPLOYEE']}>
                <SectionOutlet />
              </RequireAuth>
            }
          >
            <Route index element={<BangLuongList />} />
          </Route>
          <Route
            path="nghiphep"
            element={
              <RequireAuth allow={['ADMIN','MANAGER','EMPLOYEE']}>
                <SectionOutlet />
              </RequireAuth>
            }
          >
            <Route index element={<NghiPhepList />} />
          </Route>
          {/** Đã ẩn/xoá module Đánh giá khỏi routes */}
          <Route
            path="tai-khoan"
            element={
              <RequireAuth allow={['ADMIN']}>
                <SectionOutlet />
              </RequireAuth>
            }
          >
            <Route index element={<TaiKhoanList />} />
          </Route>
          <Route
            path="chucvu"
            element={
              <RequireAuth allow={['ADMIN','MANAGER']}>
                <SectionOutlet />
              </RequireAuth>
            }
          >
            <Route index element={<ChucVuList />} />
          </Route>
          <Route
            path="nhanvien"
            element={
              <RequireAuth allow={['ADMIN']}>
                <SectionOutlet />
              </RequireAuth>
            }
          >
            <Route index element={<NhanVienList />} />
            <Route path=":id" element={<NhanVienDetail />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

function GuestOnly({ children }: { children: React.ReactElement }) {
  const { token } = useAuthStore()
  if (token) return <Navigate to="/" replace />
  return children
}

function SectionOutlet() {
  return <Outlet />
}
