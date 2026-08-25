import React, { useState, useEffect } from "react";
import {
  Truck,
  LayoutDashboard,
  PackagePlus,
  ArrowLeftRight,
  Search,
  LogIn,
  LogOut,
  User,
  ShieldCheck,
  Bell,
  Check,
  X,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../api/deliveryApi";

export const Navbar = ({ activeTab, setActiveTab, user, onLogout }) => {
  const role = user?.role?.toUpperCase() || "GUEST";

  // Navigation Items
  const allNavItems = [
    {
      id: "tracking",
      label: "Tra Cứu Đơn",
      icon: Search,
      roles: ["GUEST", "CUSTOMER", "SHIPPER", "ADMIN"],
    },
    {
      id: "orders",
      label: "Tạo & Quản Lý Đơn",
      icon: PackagePlus,
      roles: ["CUSTOMER", "ADMIN"],
    },
    {
      id: "shipments",
      label: "Điều Phối Shipper",
      icon: ArrowLeftRight,
      roles: ["SHIPPER", "ADMIN"],
    },
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      roles: ["ADMIN"],
    },
  ];

  const visibleNavItems = allNavItems.filter((item) =>
    user ? item.roles.includes(role) : item.roles.includes("GUEST")
  );

  const getRoleBadge = (roleName) => {
    switch (roleName) {
      case "ADMIN":
        return {
          label: "ADMIN",
          className:
            "bg-amber-100 text-amber-900 border border-amber-300 font-extrabold",
        };
      case "SHIPPER":
        return {
          label: "SHIPPER",
          className:
            "bg-blue-100 text-blue-900 border border-blue-300 font-bold",
        };
      case "CUSTOMER":
        return {
          label: "KHÁCH HÀNG",
          className:
            "bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold",
        };
      default:
        return {
          label: "KHÁCH",
          className: "bg-slate-100 text-slate-700 border border-slate-200 font-medium",
        };
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
      const count =
        typeof countRes === "number"
          ? countRes
          : countRes.data ??
            (Array.isArray(notifs) ? notifs.filter((n) => !n.isRead).length : 0);
      setUnreadCount(count);
    } catch (e) {
      console.warn("Failed to load notifications:", e);
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
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (e) {
      console.error(e);
    }
  };

  const badge = getRoleBadge(role);

  return (
    <header className="sticky top-0 z-50 w-full pt-3 px-3 sm:px-6 lg:px-8">
      {/* Floating Clean Light Island Container */}
      <div className="max-w-7xl mx-auto rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200 shadow-sm transition-all duration-300">
        <div className="px-4 sm:px-6 flex items-center justify-between h-16 sm:h-18">
          {/* Logo & Brand */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none group"
            onClick={() =>
              setActiveTab(
                user
                  ? role === "ADMIN"
                    ? "dashboard"
                    : role === "SHIPPER"
                    ? "shipments"
                    : "orders"
                  : "tracking"
              )
            }
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 via-rose-600 to-red-700 text-white shadow-glow-red group-hover:scale-105 transition-transform duration-300">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 leading-tight">
                  Viettel
                </span>
                <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-red-50 text-red-600 border border-red-200">
                  Delivery
                </span>
              </div>
              <span className="text-[10px] text-slate-500 block font-medium tracking-wider uppercase">
                Hệ Thống Giao Nhận Thông Minh
              </span>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-xl border border-slate-200/60">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "text-white"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavPill"
                      className="absolute inset-0 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 shadow-glow-red -z-10"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-white" : "text-slate-500"
                    }`}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Section */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notification Bell */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-600 hover:text-slate-900 transition-all cursor-pointer relative"
                  title="Thông báo"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-sm animate-pulse">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                <AnimatePresence>
                  {showNotifDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden z-50 text-slate-800"
                    >
                      <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Bell className="w-4 h-4 text-red-600" />
                          <span className="font-bold text-xs uppercase tracking-wider text-slate-700">
                            Thông Báo Hệ Thống
                          </span>
                          {unreadCount > 0 && (
                            <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold">
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
                            className="text-slate-400 hover:text-slate-600 p-1 rounded-md cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center text-xs text-slate-400">
                            Chưa có thông báo nào trong hộp thư
                          </div>
                        ) : (
                          notifications.slice(0, 15).map((n) => (
                            <div
                              key={n.id}
                              className={`p-3.5 text-left transition hover:bg-slate-50 flex items-start justify-between gap-3 ${
                                !n.isRead ? "bg-red-50/50 font-medium" : ""
                              }`}
                            >
                              <div className="flex-1 space-y-1">
                                <p className="text-xs font-bold text-slate-900">
                                  {n.title}
                                </p>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                  {n.message}
                                </p>
                                <span className="text-[10px] text-slate-400 block font-mono">
                                  {n.createdAt
                                    ? new Date(n.createdAt).toLocaleTimeString(
                                        "vi-VN"
                                      )
                                    : ""}
                                </span>
                              </div>
                              {!n.isRead && (
                                <button
                                  onClick={(e) => handleMarkAsRead(n.id, e)}
                                  title="Đánh dấu đã đọc"
                                  className="p-1 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition cursor-pointer"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* User Account / Auth Button */}
            {user ? (
              <div className="flex items-center gap-2 bg-slate-100 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    {user.username?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div className="hidden sm:block text-left leading-tight">
                    <p className="text-xs font-bold text-slate-900 truncate max-w-[110px]">
                      {user.username}
                    </p>
                    <span
                      className={`inline-block text-[9px] px-1.5 py-0.2 rounded mt-0.5 ${badge.className}`}
                    >
                      {badge.label}
                    </span>
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  title="Đăng xuất"
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setActiveTab("login")}
                className={`relative inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === "login"
                    ? "bg-red-600 text-white shadow-glow-red"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200"
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>Đăng Nhập</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden overflow-x-auto px-4 py-2 border-t border-slate-100 gap-1 scrollbar-none">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-red-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
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
