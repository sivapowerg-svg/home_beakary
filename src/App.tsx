import React from 'react';
import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import ToastContainer from './components/common/ToastContainer.tsx';

// Layout
import Navbar from './components/layout/Navbar.tsx';
import Footer from './components/layout/Footer.tsx';

// Customer Pages
import HomePage from './pages/customer/HomePage.tsx';
import MenuPage from './pages/customer/MenuPage.tsx';
import ProductDetailPage from './pages/customer/ProductDetailPage.tsx';
import OrderCustomizePage from './pages/customer/OrderCustomizePage.tsx';
import OrderConfirmationPage from './pages/customer/OrderConfirmationPage.tsx';
import TrackOrderPage from './pages/customer/TrackOrderPage.tsx';
import AboutPage from './pages/customer/AboutPage.tsx';

// Admin Pages
import AdminLoginPage from './pages/admin/AdminLoginPage.tsx';
import AdminLayout from './pages/admin/AdminLayout.tsx';
import AdminDashboardPage from './pages/admin/AdminDashboardPage.tsx';
import AdminOrdersPage from './pages/admin/AdminOrdersPage.tsx';
import AdminProductsPage from './pages/admin/AdminProductsPage.tsx';
import AdminCustomersPage from './pages/admin/AdminCustomersPage.tsx';

function CustomerLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7] text-[#2B1E16]">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Customer Website Routes */}
            <Route element={<CustomerLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/customize" element={<OrderCustomizePage />} />
              <Route path="/customize/:productId" element={<OrderCustomizePage />} />
              <Route path="/confirmation/:orderNumber" element={<OrderConfirmationPage />} />
              <Route path="/track" element={<TrackOrderPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Route>

            {/* Admin Authentication */}
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Baker / Admin Area (Protected) */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
              <Route path="products" element={<AdminProductsPage />} />
              <Route path="customers" element={<AdminCustomersPage />} />
            </Route>

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          {/* Toast Notification Mount */}
          <ToastContainer />
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
