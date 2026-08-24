import React, { useState, useEffect } from 'react';
import { Truck, LayoutDashboard, PackagePlus, ArrowLeftRight, Search, LogIn, LogOut, User, ShieldCheck, Bell, Check, X } from 'lucide-react';
import { getNotifications, getUnreadNotificationCount, markNotificationAsRead, markAllNotificationsAsRead } from '../api/deliveryApi';

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

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const fetchNotifs = async () => {
    if (!user) return;
    try {
      const res = await getNotifications();
      const notifs = res.data || res || [];
      setNotifications(Array.isArray(notifs) ? notifs : []);
      
      const countRes = await getUnreadNotificationCount();
      const count = typeof countRes === 'number' ? countRes : countRes.data ?? (Array.isArray(notifs) ? notifs.filter(n => !n.isRead).length : 0);
      setUnreadCount(count);
    } catch (e) {
      console.warn('Failed to load notifications:', e);
    }
  };

  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 15000);
    return () => clearInterval(interval);
  }, [user]);

  const handleMarkAsRead = async (id, e) => {
    e.stopPropagation();
    try {
      await markNotificationAsRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (e) {
      console.error(e);
    }
  };
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

          {/* User Account / Notification / Auth Section */}
          <div className="flex items-center space-x-2 sm:space-x-3 relative">
            {/* Notification Bell */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                  className="p-2 bg-red-700/60 hover:bg-red-800 rounded-xl relative text-white transition cursor-pointer"
                  title="Thông báo hệ thống"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-amber-400 text-amber-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown Modal */}
                {showNotifDropdown && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-gray-800 rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="p-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-red-600" />
                        <span className="font-bold text-xs uppercase tracking-wide text-gray-700">Thông Báo</span>
                        {unreadCount > 0 && (
                          <span className="px-1.5 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded-full">
                            {unreadCount} mới
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                          <button
                            onClick={handleMarkAllAsRead}
                            className="text-[11px] text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                          >
                            Đọc tất cả
                          </button>
                        )}
                        <button
                          onClick={() => setShowNotifDropdown(false)}
                          className="text-gray-400 hover:text-gray-600 p-1 rounded cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-xs text-gray-400">
                          Chưa có thông báo nào
                        </div>
                      ) : (
                        notifications.slice(0, 15).map((n) => (
                          <div
                            key={n.id}
                            className={`p-3 text-left transition hover:bg-gray-50 flex items-start justify-between gap-2 ${
                              !n.isRead ? 'bg-red-50/40 font-medium' : ''
                            }`}
                          >
                            <div className="flex-1">
                              <p className="text-xs font-bold text-gray-800">{n.title}</p>
                              <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{n.message}</p>
                              <span className="text-[10px] text-gray-400 mt-1 block">
                                {n.createdAt ? new Date(n.createdAt).toLocaleTimeString('vi-VN') : ''}
                              </span>
                            </div>
                            {!n.isRead && (
                              <button
                                onClick={(e) => handleMarkAsRead(n.id, e)}
                                title="Đánh dấu đã đọc"
                                className="p-1 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded cursor-pointer flex-shrink-0"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

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
