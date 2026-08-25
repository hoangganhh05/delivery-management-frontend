import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import OrderManagement from "./pages/OrderManagement";
import ShipmentManagement from "./pages/ShipmentManagement";
import Tracking from "./pages/Tracking";
import Login from "./pages/Login";
import { CursorGlow } from "./components/CursorGlow";
import { useLenis } from "./hooks/useLenis";
import { CheckCircle2, AlertCircle, X, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function App() {
  // 1. Initialize Lenis Smooth Scroll inertia
  useLenis();

  // 2. Authentication State
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");
    return token ? { token, username, role } : null;
  });

  // 3. Active Tab State: 'tracking', 'orders', 'shipments', 'dashboard', 'login'
  const [activeTab, setActiveTab] = useState(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token) return "tracking";
    if (role === "ADMIN") return "dashboard";
    if (role === "SHIPPER") return "shipments";
    return "orders";
  });

  // 4. VNPay payment result banner state
  const [paymentNotice, setPaymentNotice] = useState(null);

  // Check URL query parameters for VNPay Return Callback
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const responseCode = query.get("vnp_ResponseCode");
    const transactionNo = query.get("vnp_TransactionNo");
    const amount = query.get("vnp_Amount");

    if (responseCode) {
      if (responseCode === "00") {
        const formattedAmount = amount
          ? new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(parseInt(amount, 10) / 100)
          : "";
        setPaymentNotice({
          type: "success",
          message: `Giao dịch VNPay thành công! Mã GD: ${
            transactionNo || "N/A"
          }${formattedAmount ? ` - Số tiền: ${formattedAmount}` : ""}`,
        });
      } else {
        setPaymentNotice({
          type: "error",
          message: `Thanh toán VNPay không thành công hoặc đã bị hủy (Mã lỗi: ${responseCode}).`,
        });
      }
      // Clean up URL query parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Listen to 401 unauthorized events from Axios
  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      setActiveTab("login");
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    const role = (userData.role || "").toUpperCase();
    if (role === "ADMIN") {
      setActiveTab("dashboard");
    } else if (role === "SHIPPER") {
      setActiveTab("shipments");
    } else {
      setActiveTab("orders");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    setUser(null);
    setActiveTab("tracking");
  };

  // Render view based on activeTab and permissions
  const renderContent = () => {
    const role = user?.role?.toUpperCase() || "GUEST";

    switch (activeTab) {
      case "tracking":
        return <Tracking />;

      case "login":
        return <Login onLoginSuccess={handleLoginSuccess} />;

      case "orders":
        if (!user) {
          return <Login onLoginSuccess={handleLoginSuccess} />;
        }
        return <OrderManagement />;

      case "shipments":
        if (!user) {
          return <Login onLoginSuccess={handleLoginSuccess} />;
        }
        if (role !== "ADMIN" && role !== "SHIPPER") {
          return (
            <div className="p-8 sm:p-12 rounded-3xl bg-neutral-900/80 border border-white/10 text-center backdrop-blur-2xl shadow-glass-md max-w-lg mx-auto space-y-3">
              <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
              <h2 className="text-xl font-bold text-white">Truy cập bị từ chối</h2>
              <p className="text-xs sm:text-sm text-neutral-400">
                Chức năng Điều Phối chỉ dành cho Quản Trị Viên (ADMIN) hoặc Nhân Viên Giao Hàng (SHIPPER).
              </p>
            </div>
          );
        }
        return <ShipmentManagement />;

      case "dashboard":
        if (!user) {
          return <Login onLoginSuccess={handleLoginSuccess} />;
        }
        if (role !== "ADMIN") {
          return (
            <div className="p-8 sm:p-12 rounded-3xl bg-neutral-900/80 border border-white/10 text-center backdrop-blur-2xl shadow-glass-md max-w-lg mx-auto space-y-3">
              <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
              <h2 className="text-xl font-bold text-white">Truy cập bị từ chối</h2>
              <p className="text-xs sm:text-sm text-neutral-400">
                Trang Dashboard phân tích doanh thu và số liệu chỉ dành cho Quản Trị Viên (ADMIN).
              </p>
            </div>
          );
        }
        return <Dashboard />;

      default:
        return <Tracking />;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans relative selection:bg-red-600/30 selection:text-red-200">
      {/* Living Cursor Glow Spotlight */}
      <CursorGlow />

      {/* Background Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none -z-20 overflow-hidden">
        <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[160px]" />
      </div>

      {/* Floating Obsidian Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLogout={handleLogout}
      />

      {/* VNPay Payment Notice Banner */}
      <AnimatePresence>
        {paymentNotice && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 z-40"
          >
            <div
              className={`p-4 rounded-2xl flex items-center justify-between shadow-glass-sm border backdrop-blur-2xl ${
                paymentNotice.type === "success"
                  ? "bg-emerald-950/70 text-emerald-200 border-emerald-500/30"
                  : "bg-rose-950/70 text-rose-200 border-rose-500/30"
              }`}
            >
              <div className="flex items-center gap-3">
                {paymentNotice.type === "success" ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                )}
                <span className="text-xs sm:text-sm font-semibold">
                  {paymentNotice.message}
                </span>
              </div>
              <button
                onClick={() => setPaymentNotice(null)}
                className="text-neutral-400 hover:text-white p-1 rounded-md transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Body with Framer Motion Page Transition */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Obsidian Luxury Footer */}
      <Footer />
    </div>
  );
}

export default App;
