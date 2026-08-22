import React from 'react';
import { Truck, LayoutDashboard, PackagePlus, ArrowLeftRight, Search, LogIn, LogOut, User, ShieldCheck } from 'lucide-react';

const Navbar = ({ activeTab, setActiveTab, user, onLogout }) => {
  const role = user?.role?.toUpperCase() || 'GUEST';

  // Define tab navigation items with role-based permissions
  const allNavItems = [
    {
      id: 'tracking',
      label: 'Tra Cứu Đơn',
      icon: Search,
      roles: ['GUEST', 'CUSTOMER', 'SHIPPER', 'ADMIN'], // Public
    },
    {
      id: 'orders',
      label: 'Tạo & Quản Lý Đơn',
      icon: PackagePlus,
      roles: ['CUSTOMER', 'ADMIN'],
    },
    {
      id: 'shipments',
      label: 'Điều Phối Shipper',
      icon: ArrowLeftRight,
      roles: ['SHIPPER', 'ADMIN'],
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      roles: ['ADMIN'],
    },
  ];

  // Filter items visible to current role
  const visibleNavItems = allNavItems.filter((item) =>
    user ? item.roles.includes(role) : item.roles.includes('GUEST')
  );

  const getRoleBadge = (roleName) => {
    switch (roleName) {
      case 'ADMIN':
        return { label: 'ADMIN', color: 'bg-amber-400 text-amber-950 font-black' };
      case 'SHIPPER':
        return { label: 'SHIPPER', color: 'bg-blue-300 text-blue-950 font-bold' };
      case 'CUSTOMER':
        return { label: 'KHÁCH HÀNG', color: 'bg-emerald-300 text-emerald-950 font-bold' };
      default:
        return { label: 'KHÁCH', color: 'bg-white/20 text-white font-medium' };
    }
  };

  const badge = getRoleBadge(role);

  return (
    <header className="bg-red-600 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div
            className="flex items-center space-x-3 cursor-pointer select-none"
            onClick={() => setActiveTab(user ? (role === 'ADMIN' ? 'dashboard' : role === 'SHIPPER' ? 'shipments' : 'orders') : 'tracking')}
          >
            <div className="bg-white p-2 rounded-xl text-red-600 shadow-sm flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight block leading-tight">
                Viettel <span className="text-red-100 font-medium">Delivery</span>
              </span>
              <span className="text-[10px] text-red-200 block font-light tracking-wider uppercase">
                Hệ Thống Giao Nhận Thông Minh
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 sm:space-x-2">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-white text-red-600 shadow-md'
                      : 'text-white hover:bg-red-700/80 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-red-600' : 'text-red-200'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* User Account / Auth Section */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {user ? (
              <div className="flex items-center space-x-2 sm:space-x-3 bg-red-700/60 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-red-500/50">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 bg-white text-red-600 rounded-full flex items-center justify-center font-bold text-xs shadow-inner">
                    {user.username?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="hidden sm:block text-left leading-tight">
                    <p className="text-xs font-bold text-white truncate max-w-[110px]">
                      {user.username}
                    </p>
                    <span className={`inline-block text-[9px] px-1.5 py-0.2 rounded mt-0.5 ${badge.color}`}>
                      {badge.label}
                    </span>
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  title="Đăng xuất"
                  className="p-1.5 text-red-100 hover:text-white hover:bg-red-800 rounded-lg transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setActiveTab('login')}
                className={`flex items-center space-x-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition shadow-sm cursor-pointer ${
                  activeTab === 'login'
                    ? 'bg-white text-red-600'
                    : 'bg-white/10 hover:bg-white text-white hover:text-red-600'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>Đăng Nhập</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation bar for smaller screens */}
        <div className="flex md:hidden overflow-x-auto py-2 border-t border-red-500/40 gap-1 scrollbar-none">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex-shrink-0 flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-red-600'
                    : 'text-white hover:bg-red-700/80'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
