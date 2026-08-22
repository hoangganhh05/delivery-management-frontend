import React from 'react';
import { Truck, LayoutDashboard, PackagePlus, ArrowLeftRight, ShieldCheck } from 'lucide-react';

const Navbar = ({ activeTab, setActiveTab }) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'orders',
      label: 'Tạo & Quản Lý Đơn',
      icon: PackagePlus,
    },
    {
      id: 'shipments',
      label: 'Điều Phối Shipper',
      icon: ArrowLeftRight,
    },
  ];

  return (
    <header className="bg-red-600 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="bg-white p-2 rounded-lg text-red-600 shadow-sm flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight block">
                Viettel <span className="text-red-100 font-medium">Delivery System</span>
              </span>
              <span className="text-xs text-red-200 block -mt-1 font-light tracking-wider">
                HỆ THỐNG QUẢN LÝ GIAO HÀNG
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex space-x-1 sm:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-red-600 shadow-md font-semibold'
                      : 'text-white hover:bg-red-700/80 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-red-600' : 'text-red-200'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
