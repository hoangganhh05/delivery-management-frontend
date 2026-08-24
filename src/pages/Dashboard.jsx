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
} from "lucide-react";
import { getDashboardStats } from "../api/deliveryApi";

const Dashboard = () => {
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
      // Handle response directly or nested under data property
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
      color: "bg-blue-500",
      lightBg: "bg-blue-50",
      textColor: "text-blue-600",
      borderColor: "border-blue-200",
      subText: "Tất cả đơn đã tiếp nhận",
    },
    {
      id: "success",
      title: "Đơn Thành Công",
      value: (stats.successfulOrders || 0).toLocaleString("vi-VN"),
      icon: CheckCircle2,
      color: "bg-emerald-500",
      lightBg: "bg-emerald-50",
      textColor: "text-emerald-600",
      borderColor: "border-emerald-200",
      subText: "Giao hàng thành công",
    },
    {
      id: "cancelled",
      title: "Đơn Bị Hủy",
      value: (stats.cancelledOrders || 0).toLocaleString("vi-VN"),
      icon: XCircle,
      color: "bg-rose-500",
      lightBg: "bg-rose-50",
      textColor: "text-rose-600",
      borderColor: "border-rose-200",
      subText: "Đơn bị từ chối / trả hàng",
    },
    {
      id: "revenue",
      title: "Tổng Doanh Thu",
      value: formatCurrency(stats.totalRevenue),
      icon: Banknote,
      color: "bg-amber-500",
      lightBg: "bg-amber-50",
      textColor: "text-amber-600",
      borderColor: "border-amber-200",
      subText: "Doanh thu cước vận chuyển",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gray-200 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Activity className="w-7 h-7 text-red-600" />
            Tổng Quan Hệ Thống
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Báo cáo thống kê thời gian thực hoạt động giao hàng của Viettel Post
          </p>
        </div>
        <button
          onClick={fetchStats}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 active:bg-red-800 transition font-medium text-sm shadow-sm disabled:opacity-60 cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Đang cập nhật..." : "Làm mới dữ liệu"}
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium">Lỗi kết nối Backend API</p>
            <p className="text-sm text-red-600 mt-0.5">{error}</p>
          </div>
          <button
            onClick={fetchStats}
            className="text-xs bg-red-600 text-white px-3 py-1.5 rounded hover:bg-red-700 transition"
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
              className={`bg-white rounded-xl shadow-sm border ${card.borderColor} p-6 transition-all duration-200 hover:shadow-md relative overflow-hidden`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {card.title}
                  </p>
                  <p
                    className={`text-2xl sm:text-3xl font-extrabold mt-2 ${card.textColor}`}
                  >
                    {loading ? (
                      <span className="inline-block w-24 h-8 bg-gray-200 animate-pulse rounded"></span>
                    ) : (
                      card.value
                    )}
                  </p>
                </div>
                <div
                  className={`p-3.5 rounded-xl ${card.lightBg} ${card.textColor}`}
                >
                  <Icon className="w-7 h-7" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span>{card.subText}</span>
                <TrendingUp className="w-3.5 h-3.5 text-gray-400" />
              </div>
            </div>
          );
        })}
      </div>

      {/* System Status Banner */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-xl p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white mb-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-ping"></span>
              Hệ thống đang hoạt động ổn định
            </span>
            <h2 className="text-xl font-bold">
              Viettel Delivery Backend Service
            </h2>
            <p className="text-red-100 text-sm mt-1">
              Kết nối trực tiếp tới cổng API Gateway{" "}
              <code className="bg-red-800/60 px-2 py-0.5 rounded text-white font-mono">
                {import.meta.env.VITE_API_BASE_URL ||
                  "http://localhost:8080/api/v1"}
              </code>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-red-200">Tỉ lệ giao thành công</p>
              <p className="text-xl font-bold">
                {stats.totalOrders > 0
                  ? `${Math.round((stats.successfulOrders / stats.totalOrders) * 100)}%`
                  : "100%"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
