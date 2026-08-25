import React from "react";
import { Package, ShieldCheck, CreditCard, Sparkles, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative z-10 mt-20 border-t border-slate-200 bg-white text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-red-700 text-white shadow-sm">
                <Package className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
              </div>
              <div>
                <span className="text-base font-extrabold tracking-tight text-slate-900 block leading-tight">
                  Viettel Delivery
                </span>
                <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">
                  Logistics Intelligence
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-500 font-light leading-relaxed">
              Hệ thống quản lý bưu vận và điều phối thông minh chuẩn công nghiệp. Tối ưu chi phí, minh bạch hành trình và thanh toán tức thì.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              API Services Online • 99.98% Uptime
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Giải Pháp Giao Vận
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#tracking" className="hover:text-red-600 transition-colors">Tra cứu bưu gửi thời gian thực</a>
              </li>
              <li>
                <a href="#orders" className="hover:text-red-600 transition-colors">Tạo đơn hàng & Khai báo kiện</a>
              </li>
              <li>
                <a href="#vouchers" className="hover:text-red-600 transition-colors">Kho voucher & Giảm cước 50%</a>
              </li>
              <li>
                <a href="#vnpay" className="hover:text-red-600 transition-colors">Cổng thanh toán VNPay Sandbox</a>
              </li>
            </ul>
          </div>

          {/* Technology & Security */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Công Nghệ & Bảo Mật
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Spring Security & JWT 512-bit</span>
              </li>
              <li className="flex items-center gap-2">
                <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                <span>Thanh toán chuẩn PCI-DSS</span>
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Magic UI & Framer Motion</span>
              </li>
            </ul>
          </div>

          {/* Hotline & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Tổng Đài Hỗ Trợ
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <Phone className="w-3.5 h-3.5 text-red-600" />
                <span className="font-bold text-slate-900">1900 8095</span> (24/7 Miễn phí)
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>cskh@vietteldelivery.vn</span>
              </div>
              <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                Trụ sở chính: Tòa nhà Viettel, Số 1 Giang Văn Minh, Ba Đình, Hà Nội.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} Viettel Delivery Management System. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-900 cursor-pointer">Điều khoản dịch vụ</span>
            <span>•</span>
            <span className="hover:text-slate-900 cursor-pointer">Chính sách bảo mật</span>
            <span>•</span>
            <span className="hover:text-slate-900 cursor-pointer">Quy chế bồi thường</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
