import React from "react";
import { Package, ShieldCheck, CreditCard, Sparkles, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative z-10 mt-20 border-t border-white/10 bg-neutral-950/80 backdrop-blur-2xl text-neutral-400">
      {/* Top subtle red ambient light line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-red-800 text-white shadow-glow-red">
                <Package className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
              </div>
              <div>
                <span className="text-base font-extrabold tracking-tight text-white block leading-tight">
                  Viettel Delivery
                </span>
                <span className="text-[10px] text-neutral-400 font-mono tracking-widest uppercase">
                  Logistics Intelligence
                </span>
              </div>
            </div>
            <p className="text-xs text-neutral-400 font-light leading-relaxed">
              Hệ thống quản lý bưu vận và điều phối thông minh chuẩn công nghiệp. Tối ưu chi phí, minh bạch hành trình và thanh toán tức thì.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              API Services Online • 99.98% Uptime
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-200">
              Giải Pháp Giao Vận
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#tracking" className="hover:text-red-400 transition-colors">Tra cứu bưu gửi thời gian thực</a>
              </li>
              <li>
                <a href="#orders" className="hover:text-red-400 transition-colors">Tạo đơn hàng & Khai báo kiện</a>
              </li>
              <li>
                <a href="#vouchers" className="hover:text-red-400 transition-colors">Kho voucher & Giảm cước 50%</a>
              </li>
              <li>
                <a href="#vnpay" className="hover:text-red-400 transition-colors">Cổng thanh toán VNPay Sandbox</a>
              </li>
            </ul>
          </div>

          {/* Technology & Security */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-200">
              Công Nghệ & Bảo Mật
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Spring Security & JWT 512-bit</span>
              </li>
              <li className="flex items-center gap-2">
                <CreditCard className="w-3.5 h-3.5 text-blue-400" />
                <span>Thanh toán chuẩn PCI-DSS</span>
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Magic UI & Framer Motion</span>
              </li>
            </ul>
          </div>

          {/* Hotline & Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-200">
              Tổng Đài Hỗ Trợ
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-neutral-300">
                <Phone className="w-3.5 h-3.5 text-red-500" />
                <span className="font-semibold text-white">1900 8095</span> (24/7 Miễn phí)
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-neutral-500" />
                <span>cskh@vietteldelivery.vn</span>
              </div>
              <p className="text-[11px] text-neutral-400 pt-2 border-t border-white/5">
                Trụ sở chính: Tòa nhà Viettel, Số 1 Giang Văn Minh, Ba Đình, Hà Nội.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-400">
          <p>© {new Date().getFullYear()} Viettel Delivery Management System. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-neutral-300 cursor-pointer">Điều khoản dịch vụ</span>
            <span>•</span>
            <span className="hover:text-neutral-300 cursor-pointer">Chính sách bảo mật</span>
            <span>•</span>
            <span className="hover:text-neutral-300 cursor-pointer">Quy chế bồi thường</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
