import React, { useState, useEffect } from "react";
import {
  Package,
  CheckCircle2,
  XCircle,
  Banknote,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  Activity,
  ShieldCheck,
  Server,
} from "lucide-react";
import { getDashboardStats } from "../api/deliveryApi";
import { BorderBeam } from "../components/BorderBeam";

export const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    successfulOrders: 0,
    cancelledOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getDashboardStats();
      const data = response?.data || response || {};
      setStats({
        totalOrders:
          data.totalOrders ?? data.total_orders ?? data.totalOrderCount ?? 0,
        successfulOrders:
          data.successfulOrders ??
          data.successful_orders ??
          data.deliveredOrders ??
          data.completedOrders ??
          0,
        cancelledOrders:
          data.cancelledOrders ??
          data.cancelled_orders ??
          data.canceledOrders ??
          0,
        totalRevenue:
          data.totalRevenue ?? data.total_revenue ?? data.revenue ?? 0,
      });
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
      setError(err.message || "Không thể tải dữ liệu thống kê từ hệ thống.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount || 0);
  };

  const statCards = [
    {
      id: "total",
      title: "Tổng Đơn Hàng",
      value: (stats.totalOrders || 0).toLocaleString("vi-VN"),
      icon: Package,
      iconColor: "text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10 border-cyan-200 dark:border-cyan-500/20",
      subText: "Tất cả đơn đã tiếp nhận",
    },
    {
      id: "success",
      title: "Đơn Thành Công",
      value: (stats.successfulOrders || 0).toLocaleString("vi-VN"),
      icon: CheckCircle2,
      iconColor: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20",
      subText: "Giao hàng hoàn tất",
    },
    {
      id: "cancelled",
      title: "Đơn Bị Hủy",
      value: (stats.cancelledOrders || 0).toLocaleString("vi-VN"),
      icon: XCircle,
      iconColor: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20",
      subText: "Đơn bị từ chối / hoàn trả",
    },
    {
      id: "revenue",
      title: "Tổng Doanh Thu",
      value: formatCurrency(stats.totalRevenue),
      icon: Banknote,
      iconColor: "text-amber-600 dark:text-amber-300 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20",
      subText: "Cước vận chuyển thực thu",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-200 dark:border-white/10 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <Activity className="w-7 h-7 text-red-600 dark:text-red-500" />
            Tổng Quan Hệ Thống (Analytics)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400 mt-1">
            Báo cáo thống kê thời gian thực số liệu vận hành và doanh thu Viettel Delivery
          </p>
        </div>
        <button
          onClick={fetchStats}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-800 dark:text-white rounded-xl transition font-semibold text-xs border border-slate-200 dark:border-white/10 shadow-sm disabled:opacity-60 cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span>{loading ? "Đang cập nhật..." : "Làm mới dữ liệu"}</span>
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-500/30 flex items-start gap-3 text-rose-800 dark:text-rose-200">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
          <div className="flex-1">
            <p className="font-bold text-sm">Lỗi kết nối Backend API</p>
            <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5">{error}</p>
          </div>
          <button
            onClick={fetchStats}
            className="text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition cursor-pointer"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              className="relative overflow-hidden rounded-3xl bg-white dark:bg-neutral-900/80 border border-slate-200 dark:border-white/10 p-6 backdrop-blur-2xl shadow-sm dark:shadow-glass-md hover:border-red-300 dark:hover:border-white/20 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500 dark:text-neutral-400 uppercase tracking-wider">
                    {card.title}
                  </p>
                  <p className="text-2xl sm:text-3xl font-black mt-2 text-slate-900 dark:text-white font-mono tracking-tight">
                    {loading ? (
                      <span className="inline-block w-24 h-8 bg-slate-200 dark:bg-white/10 animate-pulse rounded-lg" />
                    ) : (
                      card.value
                    )}
                  </p>
                </div>
                <div
                  className={`p-3.5 rounded-2xl border ${card.iconColor}`}
                >
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs text-slate-500 dark:text-neutral-400">
                <span>{card.subText}</span>
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          );
        })}
      </div>

      {/* System Status Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 via-rose-600 to-red-800 p-6 sm:p-8 text-white shadow-xl">
        <BorderBeam size={200} duration={8} delay={1} colorFrom="#ffffff" colorTo="#fef08a" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Hệ Thống Trực Tuyến 24/7 (High Availability)
            </span>
            <h2 className="text-xl sm:text-2xl font-black">
              Viettel Delivery Core API Services
            </h2>
            <p className="text-red-100 text-xs sm:text-sm font-normal">
              Đồng bộ dữ liệu thời gian thực qua REST API:{" "}
              <code className="bg-black/30 border border-white/20 px-2.5 py-1 rounded-lg text-white font-mono text-xs">
                {import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1"}
              </code>
            </p>
          </div>

          <div className="flex items-center gap-4 bg-black/20 backdrop-blur-md p-4 rounded-2xl border border-white/10">
            <div className="text-right">
              <p className="text-xs text-red-200 uppercase font-semibold">Tỉ lệ giao thành công</p>
              <p className="text-2xl font-black text-amber-300 font-mono">
                {stats.totalOrders > 0
                  ? `${Math.round((stats.successfulOrders / stats.totalOrders) * 100)}%`
                  : "100%"}
              </p>
            </div>
            <ShieldCheck className="w-10 h-10 text-emerald-400 flex-shrink-0" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
