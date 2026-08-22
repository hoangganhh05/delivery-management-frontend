import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import OrderManagement from './pages/OrderManagement';
import ShipmentManagement from './pages/ShipmentManagement';
import Tracking from './pages/Tracking';
import Login from './pages/Login';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

function App() {
  // Authentication State
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    return token ? { token, username, role } : null;
  });

  // Active Tab State: 'tracking', 'orders', 'shipments', 'dashboard', 'login'
  const [activeTab, setActiveTab] = useState(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token) return 'tracking';
    if (role === 'ADMIN') return 'dashboard';
    if (role === 'SHIPPER') return 'shipments';
    return 'orders';
  });

  // VNPay payment result banner state
  const [paymentNotice, setPaymentNotice] = useState(null);

  // Check URL query parameters for VNPay Return Callback
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const responseCode = query.get('vnp_ResponseCode');
    const transactionNo = query.get('vnp_TransactionNo');
    const amount = query.get('vnp_Amount');

    if (responseCode) {
      if (responseCode === '00') {
        const formattedAmount = amount
          ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(parseInt(amount, 10) / 100)
          : '';
        setPaymentNotice({
          type: 'success',
          message: `Giao dịch VNPay thành công! Mã GD: ${transactionNo || 'N/A'}${formattedAmount ? ` - Số tiền: ${formattedAmount}` : ''}`,
        });
      } else {
        setPaymentNotice({
          type: 'error',
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
      setActiveTab('login');
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    const role = (userData.role || '').toUpperCase();
    if (role === 'ADMIN') {
      setActiveTab('dashboard');
    } else if (role === 'SHIPPER') {
      setActiveTab('shipments');
    } else {
      setActiveTab('orders');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    setUser(null);
    setActiveTab('tracking');
  };

  // Render view based on activeTab and permissions
  const renderContent = () => {
    const role = user?.role?.toUpperCase() || 'GUEST';

    switch (activeTab) {
      case 'tracking':
        return <Tracking />;

      case 'login':
        return <Login onLoginSuccess={handleLoginSuccess} />;

      case 'orders':
        if (!user) {
          return <Login onLoginSuccess={handleLoginSuccess} />;
        }
        return <OrderManagement />;

      case 'shipments':
        if (!user) {
          return <Login onLoginSuccess={handleLoginSuccess} />;
        }
        if (role !== 'ADMIN' && role !== 'SHIPPER') {
          return (
            <div className="p-8 bg-white rounded-2xl shadow-sm text-center">
              <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
              <h2 className="text-xl font-bold text-gray-900">Truy cập bị từ chối</h2>
              <p className="text-sm text-gray-500 mt-1">
                Chức năng Điều Phối chỉ dành cho Quản Trị Viên (ADMIN) hoặc Nhân Viên Giao Hàng (SHIPPER).
              </p>
            </div>
          );
        }
        return <ShipmentManagement />;

      case 'dashboard':
        if (!user) {
          return <Login onLoginSuccess={handleLoginSuccess} />;
        }
        if (role !== 'ADMIN') {
          return (
            <div className="p-8 bg-white rounded-2xl shadow-sm text-center">
              <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
              <h2 className="text-xl font-bold text-gray-900">Truy cập bị từ chối</h2>
              <p className="text-sm text-gray-500 mt-1">
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
    <div className="min-h-screen bg-slate-50 text-gray-800 flex flex-col font-sans">
      {/* Header / Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLogout={handleLogout}
      />

      {/* VNPay Payment Notice Banner */}
      {paymentNotice && (
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div
            className={`p-4 rounded-xl flex items-center justify-between shadow-sm border ${
              paymentNotice.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                : 'bg-rose-50 text-rose-900 border-rose-200'
            }`}
          >
            <div className="flex items-center gap-3">
              {paymentNotice.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              )}
              <span className="text-sm font-medium">{paymentNotice.message}</span>
            </div>
            <button
              onClick={() => setPaymentNotice(null)}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-12 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-semibold text-gray-700">
            Hệ Thống Viettel Delivery Management &copy; {new Date().getFullYear()}
          </p>
          <p className="mt-1 text-gray-400">
            Tích hợp Spring Boot Security JWT • Cổng thanh toán trực tuyến VNPay Sandbox • Tra cứu hành trình thông minh
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
