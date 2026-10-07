import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import {
  LayoutDashboard,
  ShoppingBag,
  Cake,
  Users,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChefHat
} from 'lucide-react';

export default function AdminLayout() {
  const { isAuthenticated, logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Products', path: '/admin/products', icon: Cake },
    { label: 'Customers', path: '/admin/customers', icon: Users }
  ];

  const isActive = (path: string, exact?: boolean) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex">
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 bg-[#2B1E16] text-[#FDFBF7] border-r border-[#3E2C22] fixed inset-y-0 z-30">
        {/* Brand */}
        <div className="p-6 border-b border-[#3E2C22]">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E07A5F]/20 text-[#E07A5F] flex items-center justify-center">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <span className="font-serif text-lg font-bold tracking-tight text-[#FDFBF7] block">
                SWEET CRUMBS
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#D4A373]">
                Baker Workspace
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.path, item.exact);
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? 'bg-[#C85A32] text-white shadow-sm'
                    : 'text-[#D9C8B5] hover:bg-[#3E2C22] hover:text-[#FDFBF7]'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Customer Portal Link & Baker Profile */}
        <div className="p-4 border-t border-[#3E2C22] space-y-3">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 text-xs text-[#D4A373] hover:text-[#FDFBF7] rounded-lg hover:bg-[#3E2C22] transition-colors"
          >
            <span>View Public Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <div className="pt-2 border-t border-[#3E2C22]/60 flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <p className="text-xs font-semibold text-[#FDFBF7] truncate">
                {user?.name || 'Chef Claire'}
              </p>
              <p className="text-[10px] text-[#A8927E] truncate">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-[#A8927E] hover:text-[#E07A5F] rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <div className="md:hidden fixed top-0 inset-x-0 h-16 bg-[#2B1E16] text-[#FDFBF7] border-b border-[#3E2C22] px-4 flex items-center justify-between z-30">
        <Link to="/admin" className="font-serif text-lg font-bold text-[#FDFBF7]">
          SWEET CRUMBS BAKER
        </Link>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 text-[#FDFBF7] hover:bg-[#3E2C22] rounded-lg"
        >
          {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* MOBILE SIDEBAR OVERLAY */}
      {mobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50 flex">
          <div className="w-64 bg-[#2B1E16] text-[#FDFBF7] flex flex-col p-6 space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-[#3E2C22]">
              <span className="font-serif font-bold text-lg">SWEET CRUMBS</span>
              <button onClick={() => setMobileSidebarOpen(false)}>
                <X className="w-5 h-5 text-stone-300" />
              </button>
            </div>
            <nav className="flex-1 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path, item.exact);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                      active ? 'bg-[#C85A32] text-white' : 'text-[#D9C8B5]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-xs text-[#E07A5F] pt-4 border-t border-[#3E2C22]"
            >
              <LogOut className="w-4 h-4" />
              <span>Log out</span>
            </button>
          </div>
          <div className="flex-1" onClick={() => setMobileSidebarOpen(false)} />
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 md:pl-64 pt-16 md:pt-0 min-h-screen">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
