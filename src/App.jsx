import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import OrderManagement from './pages/OrderManagement';
import ShipmentManagement from './pages/ShipmentManagement';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'orders':
        return <OrderManagement />;
      case 'shipments':
        return <ShipmentManagement />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 flex flex-col font-sans">
      {/* Header / Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-12 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4">
          <p className="font-medium text-gray-700">
            Hệ Thống Viettel Delivery Management &copy; {new Date().getFullYear()}
          </p>
          <p className="mt-1 text-gray-400">
            Kết nối API Gateway Backend Spring Boot • Cổng dịch vụ trực tuyến
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
