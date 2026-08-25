import React, { useState } from "react";
import {
  Search,
  MapPin,
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  User,
  Phone,
  Image as ImageIcon,
  Sparkles,
  Truck,
  CreditCard,
  Zap,
  Star,
} from "lucide-react";
import { motion } from "framer-motion";
import { trackOrder } from "../api/deliveryApi";
import { Particles } from "../components/magicui/Particles";
import { BorderBeam } from "../components/BorderBeam";
import { TiltCard } from "../components/TiltCard";
import { SplitText } from "../components/SplitText";
import { Marquee } from "../components/magicui/Marquee";
import { Meteors } from "../components/magicui/Meteors";
import { Ripple } from "../components/magicui/Ripple";

export const Tracking = () => {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await trackOrder(trackingNumber.trim());
      const data = res?.data || res;
      if (!data || (typeof data === "object" && Object.keys(data).length === 0)) {
        setError("Không tìm thấy thông tin vận đơn với mã tra cứu này.");
      } else {
        setResult(data);
      }
    } catch (err) {
      console.error("Tracking error:", err);
      setError(
        err.message || "Không tìm thấy bưu gửi hoặc mã vận đơn chưa chính xác."
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const s = String(status || "").toUpperCase();
    switch (s) {
      case "DELIVERED":
      case "DONE":
      case "COMPLETED":
        return {
          label: "Giao hàng thành công",
          className:
            "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/40 font-bold",
        };
      case "IN_TRANSIT":
      case "SHIPPING":
      case "DELIVERING":
        return {
          label: "Đang vận chuyển",
          className:
            "bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-500/40 font-bold",
        };
      case "PICKED_UP":
        return {
          label: "Đã lấy hàng",
          className:
            "bg-purple-100 dark:bg-purple-500/20 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-500/40 font-bold",
        };
      case "ASSIGNED":
        return {
          label: "Đã phân công Shipper",
          className:
            "bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-500/40 font-bold",
        };
      case "PENDING":
      case "CREATED":
        return {
          label: "Đơn mới tiếp nhận",
          className:
            "bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300 border-slate-300 dark:border-neutral-700 font-bold",
        };
      case "CANCELLED":
      case "FAILED":
        return {
          label: "Đã hủy / Thất bại",
          className:
            "bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-500/40 font-bold",
        };
      default:
        return {
          label: s || "Đang xử lý",
          className:
            "bg-red-100 dark:bg-red-500/20 text-red-800 dark:text-red-300 border-red-300 dark:border-red-500/40 font-bold",
        };
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val || 0);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? dateStr : d.toLocaleString("vi-VN");
    } catch {
      return dateStr;
    }
  };

  const historyList = Array.isArray(
    result?.history || result?.logs || result?.shipmentLogs || result?.timeline
  )
    ? result?.history ||
      result?.logs ||
      result?.shipmentLogs ||
      result?.timeline
    : [];

  const partners = [
    { name: "Viettel Post", tag: "Mạng lưới quốc gia" },
    { name: "VNPay Sandbox", tag: "Cổng thanh toán số" },
    { name: "MB Bank", tag: "Ngân hàng số" },
    { name: "Shopee Express", tag: "Đối tác E-Commerce" },
    { name: "TikTok Shop", tag: "Social Commerce" },
    { name: "Vietcombank", tag: "Chuyển khoản 24/7" },
    { name: "BIDV SmartBanking", tag: "Cổng đối soát" },
  ];

  const testimonials = [
    {
      name: "Nguyễn Hoàng Nam",
      role: "Chủ shop Thời trang cao cấp",
      text: "Hệ thống tra cứu tức thì, đối soát COD tự động trong ngày. Tiết kiệm 40% thời gian quản trị vận đơn!",
      stars: 5,
    },
    {
      name: "Trần Mai Phương",
      role: "Khách hàng cá nhân",
      text: "Hình ảnh bằng chứng giao nhận minh bạch, cập nhật lộ trình shipper theo thời gian thực cực kỳ an tâm.",
      stars: 5,
    },
    {
      name: "Lê Văn Hùng",
      role: "Shipper Viettel Post Hub",
      text: "Giao diện phân công đơn rõ ràng, thao tác cập nhật tiến trình trên điện thoại mượt mà và chuẩn xác.",
      stars: 5,
    },
    {
      name: "Đặng Thị Thu",
      role: "Doanh nghiệp phân phối",
      text: "Áp mã voucher chiết khấu sâu, thanh toán trực tuyến qua VNPay rất tiện lợi cho các đơn hàng lớn.",
      stars: 5,
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* ========================================================
          1. HERO SECTION (HIGH-CONTRAST VIBRANT BANNER)
          ======================================================== */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-600 via-rose-600 to-red-700 dark:from-red-900/90 dark:via-neutral-900/95 dark:to-black p-8 sm:p-14 lg:p-20 text-center text-white border border-red-500/20 dark:border-white/10 backdrop-blur-3xl shadow-xl">
        {/* Canvas Particles */}
        <Particles
          className="absolute inset-0 z-0 opacity-40"
          quantity={35}
          color="#ffffff"
        />

        {/* Ambient Top Glow Orbs */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-white/15 dark:bg-red-600/20 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Top Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 dark:bg-white/10 border border-white/20 text-white text-xs font-semibold backdrop-blur-md mb-6"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          <span className="text-white font-bold">Hệ Thống Giao Vận Bưu Chính Viettel</span>
        </motion.div>

        {/* Hero Title */}
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            <SplitText text="Tra Cứu & Theo Dõi" delay={0.1} />{" "}
            <span className="text-amber-200 dark:text-gradient-gold">
              <SplitText text="Hành Trình Bưu Gửi" delay={0.3} />
            </span>
          </h1>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative z-10 text-xs sm:text-sm text-red-100 dark:text-neutral-300 mt-4 max-w-xl mx-auto font-normal leading-relaxed"
        >
          Nhập mã vận đơn để theo dõi lộ trình bưu kiện thời gian thực, đối soát COD tự động và thanh toán trực tuyến bảo mật.
        </motion.p>

        {/* Search Bar with Laser Border Beam */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="relative z-10 mt-10 max-w-2xl mx-auto"
        >
          <div className="relative rounded-2xl bg-white dark:bg-neutral-950 p-2 shadow-2xl border border-white/40 dark:border-white/15 backdrop-blur-3xl overflow-hidden">
            <BorderBeam size={180} duration={8} delay={2} colorFrom="#ee0033" colorTo="#d4af37" />

            <form
              onSubmit={handleSearch}
              className="relative z-10 flex flex-col sm:flex-row gap-2"
            >
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 dark:text-neutral-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Nhập mã vận đơn (VD: VT379B4895, VT12345678)..."
                  className="w-full pl-11 pr-4 py-3.5 text-slate-900 dark:text-white bg-transparent rounded-xl text-sm font-semibold outline-none placeholder-slate-400 dark:placeholder-neutral-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="relative overflow-hidden px-7 py-3.5 rounded-xl font-bold text-sm text-white bg-slate-900 hover:bg-black dark:bg-gradient-to-r dark:from-red-600 dark:via-rose-600 dark:to-red-700 hover:brightness-110 active:scale-[0.98] transition-all shadow-md dark:shadow-glow-red disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
              >
                <BorderBeam size={80} duration={4} colorFrom="#ffffff" colorTo="#ffd700" borderWidth={1} />
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Tra Cứu</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </section>

      {/* ========================================================
          2. TRACKING RESULTS (IF PRESENT)
          ======================================================== */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-500/30 text-rose-800 dark:text-rose-200 flex items-start gap-3 backdrop-blur-xl shadow-xs"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
          <div>
            <p className="font-bold text-sm">Tra cứu không thành công</p>
            <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5">{error}</p>
          </div>
        </motion.div>
      )}

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto space-y-6"
        >
          {/* Main Info Card */}
          <div className="relative rounded-3xl bg-white dark:bg-neutral-900/80 border border-slate-200 dark:border-white/10 p-6 sm:p-8 backdrop-blur-2xl shadow-sm dark:shadow-glass-md overflow-hidden">
            <BorderBeam size={250} duration={10} delay={1} colorFrom="#ee0033" colorTo="#38bdf8" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 dark:border-white/10 gap-4">
              <div>
                <span className="text-[11px] font-mono font-bold text-slate-400 dark:text-neutral-400 uppercase tracking-widest block">
                  MÃ VẬN ĐƠN HỢP LỆ
                </span>
                <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono tracking-tight mt-1 block">
                  {result.trackingNumber || result.orderId || result.id || trackingNumber}
                </span>
              </div>
              <div>
                {(() => {
                  const badge = getStatusBadge(result.status || result.shipmentStatus);
                  return (
                    <span
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border ${badge.className}`}
                    >
                      <span className="w-2 h-2 rounded-full bg-current" />
                      {badge.label}
                    </span>
                  );
                })()}
              </div>
            </div>

            {/* Sender & Receiver Sub-Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/5 space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> Thông Tin Người Gửi
                </p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {result.senderName || result.sender?.name || "N/A"}
                </p>
                <p className="text-xs text-slate-600 dark:text-neutral-300 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400 dark:text-neutral-500" />
                  {result.senderPhone || result.sender?.phone || "N/A"}
                </p>
                <p className="text-xs text-slate-600 dark:text-neutral-400 flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-neutral-500 flex-shrink-0 mt-0.5" />
                  <span>{result.senderAddress || result.sender?.address || "N/A"}</span>
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/5 space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> Thông Tin Người Nhận
                </p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {result.receiverName || result.receiver?.name || "N/A"}
                </p>
                <p className="text-xs text-slate-600 dark:text-neutral-300 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400 dark:text-neutral-500" />
                  {result.receiverPhone || result.receiver?.phone || "N/A"}
                </p>
                <p className="text-xs text-slate-600 dark:text-neutral-400 flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-neutral-500 flex-shrink-0 mt-0.5" />
                  <span>{result.receiverAddress || result.receiver?.address || "N/A"}</span>
                </p>
              </div>
            </div>

            {/* Financial & Weight Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-white/10 text-center">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-black/40 border border-slate-100 dark:border-white/5">
                <p className="text-[11px] text-slate-500 dark:text-neutral-400 font-medium">Khối lượng</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5 font-mono">
                  {result.weight ? `${result.weight} kg` : "0.5 kg"}
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-black/40 border border-slate-100 dark:border-white/5">
                <p className="text-[11px] text-slate-500 dark:text-neutral-400 font-medium">Cước vận chuyển</p>
                <p className="text-sm font-bold text-red-600 dark:text-red-400 mt-0.5 font-mono">
                  {formatCurrency(result.shippingFee)}
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-black/40 border border-slate-100 dark:border-white/5">
                <p className="text-[11px] text-slate-500 dark:text-neutral-400 font-medium">Thu hộ COD</p>
                <p className="text-sm font-bold text-slate-900 dark:text-amber-300 mt-0.5 font-mono">
                  {formatCurrency(result.codAmount)}
                </p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-black/40 border border-slate-100 dark:border-white/5">
                <p className="text-[11px] text-slate-500 dark:text-neutral-400 font-medium">Shipper phụ trách</p>
                <p className="text-sm font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                  {result.shipperId || result.shipperName || "Chưa điều phối"}
                </p>
              </div>
            </div>
          </div>

          {/* Timeline Section */}
          <div className="rounded-3xl bg-white dark:bg-neutral-900/80 border border-slate-200 dark:border-white/10 p-6 sm:p-8 backdrop-blur-2xl shadow-sm dark:shadow-glass-md">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-red-600 dark:text-red-500" />
              Lịch Sử Lộ Trình Giao Hàng
            </h2>

            {historyList.length > 0 ? (
              <div className="relative pl-6 border-l-2 border-red-200 dark:border-red-500/30 space-y-8 ml-3">
                {historyList.map((step, idx) => (
                  <div key={idx} className="relative group">
                    <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-red-600 ring-4 ring-red-100 dark:ring-neutral-900 group-hover:scale-110 transition shadow-sm dark:shadow-glow-red" />
                    <div className="space-y-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {step.status || step.action || "Cập nhật trạng thái"}
                        </span>
                        <span className="text-xs text-slate-400 dark:text-neutral-400 font-mono">
                          {formatDate(step.timestamp || step.createdAt || step.time)}
                        </span>
                      </div>
                      {step.note && <p className="text-xs text-slate-600 dark:text-neutral-300">{step.note}</p>}
                      {step.location && (
                        <p className="text-xs text-slate-500 dark:text-neutral-400 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-red-500 dark:text-red-400" /> {step.location}
                        </p>
                      )}
                      {step.proofImageUrl && (
                        <div className="mt-2">
                          <a
                            href={step.proofImageUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:underline bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 px-3 py-1.5 rounded-lg font-medium"
                          >
                            <ImageIcon className="w-3.5 h-3.5" /> Xem ảnh bằng chứng giao hàng
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="relative pl-6 border-l-2 border-red-200 dark:border-red-500/30 space-y-6 ml-3">
                <div className="relative">
                  <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-red-600 ring-4 ring-red-100 dark:ring-neutral-900 shadow-sm dark:shadow-glow-red" />
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    Trạng thái hiện tại: {result.status || "Đang xử lý"}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
                    Cập nhật gần nhất: {formatDate(result.updatedAt || result.createdAt || new Date())}
                  </p>
                  {result.note && <p className="text-xs text-slate-700 dark:text-neutral-300 mt-1">{result.note}</p>}
                  {result.proofImageUrl && (
                    <div className="mt-2">
                      <a
                        href={result.proofImageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:underline bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 px-3 py-1.5 rounded-lg font-medium"
                      >
                        <ImageIcon className="w-3.5 h-3.5" /> Xem ảnh xác nhận
                      </a>
                    </div>
                  )}
                </div>

                <div className="relative opacity-60">
                  <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-slate-400 dark:bg-neutral-600 ring-4 ring-slate-100 dark:ring-neutral-900" />
                  <p className="text-sm font-medium text-slate-700 dark:text-neutral-300">Khởi tạo đơn hàng thành công</p>
                  <p className="text-xs text-slate-400 dark:text-neutral-500 mt-0.5">
                    Thời gian: {formatDate(result.createdAt || new Date())}
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* ========================================================
          3. BENTO GRID WITH 3D TILT CARDS (SHARP HIGH CONTRAST)
          ======================================================== */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-red-600 dark:text-red-500">
            Hạ Tầng Dịch Vụ Vượt Trội
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Công Nghệ Giao Vận Chuẩn Viettel
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-neutral-400 max-w-xl mx-auto font-medium">
            Hệ sinh thái tích hợp liền mạch từ tiếp nhận bưu phẩm, phân phối lộ trình đến đối soát thanh toán.
          </p>
        </div>

        <div className="grid w-full grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Card 1: 2-column span with 3D tilt */}
          <TiltCard className="md:col-span-2 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-600/10 text-red-600 dark:text-red-500 border border-red-200 dark:border-red-500/20 shadow-xs">
                <Truck className="h-6 w-6" />
              </div>
              <span className="rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-3 py-1 text-[11px] font-bold text-slate-700 dark:text-neutral-300">
                Phủ Sóng 100%
              </span>
            </div>
            <div className="mt-8 space-y-2">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Mạng Lưới Toàn Quốc 63 Tỉnh Thành
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-neutral-400 leading-relaxed font-normal">
                Độ phủ bưu cục 100% xã phường, kết nối đa phương thức đường bộ & hàng không với thời gian giao nhận cam kết.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center text-xs font-bold text-red-600 dark:text-red-400">
              <span>Tìm bưu cục gần nhất</span>
              <span className="ml-1.5">→</span>
            </div>
          </TiltCard>

          {/* Card 2: 1-column span */}
          <TiltCard className="flex flex-col justify-between" glareColor="rgba(56, 189, 248, 0.15)">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 shadow-xs">
                <CreditCard className="h-6 w-6" />
              </div>
              <span className="rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-3 py-1 text-[11px] font-bold text-slate-700 dark:text-neutral-300">
                Bảo Mật PCI-DSS
              </span>
            </div>
            <div className="mt-8 space-y-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                Cổng VNPay Trực Tuyến
              </h3>
              <p className="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed font-normal">
                Tích hợp thanh toán QR Code và thẻ nội địa Sandbox, hoàn tất thanh toán cước vận chỉ trong 3 giây.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center text-xs font-bold text-blue-600 dark:text-blue-400">
              <span>Trải nghiệm thanh toán</span>
              <span className="ml-1.5">→</span>
            </div>
          </TiltCard>

          {/* Card 3: 1-column span */}
          <TiltCard className="flex flex-col justify-between" glareColor="rgba(234, 179, 8, 0.15)">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-600/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 shadow-xs">
                <Zap className="h-6 w-6" />
              </div>
              <span className="rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-3 py-1 text-[11px] font-bold text-slate-700 dark:text-neutral-300">
                Tiện Ích 0đ
              </span>
            </div>
            <div className="mt-8 space-y-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                Thu Hộ COD & Đối Soát Nhanh
              </h3>
              <p className="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed font-normal">
                Quản lý dòng tiền bán hàng minh bạch, miễn phí thu hộ cho các đơn nội thành, đối soát linh hoạt.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center text-xs font-bold text-amber-600 dark:text-amber-400">
              <span>Xem quy trình COD</span>
              <span className="ml-1.5">→</span>
            </div>
          </TiltCard>

          {/* Card 4: 2-column span */}
          <TiltCard className="md:col-span-2 flex flex-col justify-between" glareColor="rgba(212, 175, 55, 0.18)">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-100 to-red-100 dark:from-amber-600/20 dark:to-red-600/20 text-amber-600 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30 shadow-xs">
                <Sparkles className="h-6 w-6" />
              </div>
              <span className="rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-3 py-1 text-[11px] font-bold text-slate-700 dark:text-neutral-300">
                Ưu Đãi Mỗi Ngày
              </span>
            </div>
            <div className="mt-8 space-y-2">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                Kho Voucher & Giảm Cước 50%
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-neutral-400 leading-relaxed font-normal">
                Hệ thống tự động gợi ý mã giảm giá tối ưu nhất cho từng tuyến vận chuyển và kích thước kiện hàng.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center text-xs font-bold text-amber-600 dark:text-amber-400">
              <span>Xem mã giảm giá</span>
              <span className="ml-1.5">→</span>
            </div>
          </TiltCard>
        </div>
      </section>

      {/* ========================================================
          4. INFINITE MARQUEE WITH CLEAR TEXT
          ======================================================== */}
      <section className="space-y-8 overflow-hidden">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
            Được Tin Tưởng Bởi Hàng Triệu Khách Hàng
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Đối Tác & Đánh Giá Chất Lượng 5 Sao
          </h2>
        </div>

        {/* Top Marquee with mask image gradient */}
        <div className="relative py-2 [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
          <Marquee pauseOnHover className="[--duration:25s]">
            {partners.map((p, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white dark:bg-neutral-900/80 border border-slate-200 dark:border-white/10 shadow-xs dark:shadow-glass-sm"
              >
                <div className="w-2 h-2 rounded-full bg-red-600 dark:bg-red-500 shadow-sm dark:shadow-glow-red" />
                <span className="text-sm font-bold text-slate-900 dark:text-white">{p.name}</span>
                <span className="text-[10px] text-slate-600 dark:text-neutral-400 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 px-2 py-0.5 rounded-full font-medium">
                  {p.tag}
                </span>
              </div>
            ))}
          </Marquee>
        </div>

        {/* Bottom Marquee with reverse direction */}
        <div className="relative py-2 [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
          <Marquee reverse pauseOnHover className="[--duration:35s]">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="w-80 p-5 rounded-2xl bg-white dark:bg-neutral-900/80 border border-slate-200 dark:border-white/10 shadow-xs dark:shadow-glass-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{t.name}</h4>
                    <p className="text-[10px] text-slate-500 dark:text-neutral-400 font-medium">{t.role}</p>
                  </div>
                  <div className="flex text-amber-500 dark:text-amber-400 gap-0.5">
                    {Array.from({ length: t.stars }).map((_, si) => (
                      <Star key={si} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-neutral-300 font-normal leading-relaxed">
                  "{t.text}"
                </p>
              </div>
            ))}
          </Marquee>
        </div>
      </section>

      {/* ========================================================
          5. CALL TO ACTION (METEORS & RIPPLE)
          ======================================================== */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-600 via-rose-600 to-red-700 dark:from-red-900/90 dark:via-neutral-900/95 dark:to-black p-8 sm:p-14 text-center text-white border border-red-500/20 dark:border-white/15 backdrop-blur-3xl shadow-xl">
        <Ripple mainCircleSize={180} numCircles={5} />
        <Meteors number={15} />

        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/20 dark:bg-red-600/20 border border-white/30 dark:border-red-500/30 text-white dark:text-red-300 text-xs font-bold">
            <Zap className="w-3.5 h-3.5" /> Khởi Tạo Đơn Hàng Ngay
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Sẵn Sàng Trải Nghiệm Dịch Vụ Bưu Chính Đỉnh Cao?
          </h2>
          <p className="text-xs sm:text-sm text-red-100 dark:text-neutral-400 font-normal leading-relaxed">
            Đăng ký tài khoản doanh nghiệp hoặc cá nhân để nhận ngay voucher giảm 50% cước phí cho đơn hàng đầu tiên!
          </p>

          <div className="pt-4 flex items-center justify-center">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="px-8 py-3.5 rounded-xl font-bold text-sm text-slate-900 bg-white hover:bg-slate-100 shadow-xl transition-all cursor-pointer flex items-center gap-2"
            >
              <Package className="w-4 h-4 text-red-600" />
              <span>Bắt Đầu Gửi Hàng</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Tracking;
