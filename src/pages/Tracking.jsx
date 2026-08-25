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
import { BorderBeam } from "../components/magicui/BorderBeam";
import { BentoGrid, BentoCard } from "../components/magicui/BentoGrid";
import { Marquee } from "../components/magicui/Marquee";
import { Meteors } from "../components/magicui/Meteors";
import { Ripple } from "../components/magicui/Ripple";
import { ShimmerButton } from "../components/magicui/ShimmerButton";

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
            "bg-emerald-50 text-emerald-800 border-emerald-300 font-bold",
        };
      case "IN_TRANSIT":
      case "SHIPPING":
      case "DELIVERING":
        return {
          label: "Đang vận chuyển",
          className: "bg-blue-50 text-blue-800 border-blue-300 font-bold",
        };
      case "PICKED_UP":
        return {
          label: "Đã lấy hàng",
          className: "bg-purple-50 text-purple-800 border-purple-300 font-bold",
        };
      case "ASSIGNED":
        return {
          label: "Đã phân công Shipper",
          className: "bg-amber-50 text-amber-800 border-amber-300 font-bold",
        };
      case "PENDING":
      case "CREATED":
        return {
          label: "Đơn mới tiếp nhận",
          className: "bg-slate-100 text-slate-800 border-slate-300 font-bold",
        };
      case "CANCELLED":
      case "FAILED":
        return {
          label: "Đã hủy / Thất bại",
          className: "bg-rose-50 text-rose-800 border-rose-300 font-bold",
        };
      default:
        return {
          label: s || "Đang xử lý",
          className: "bg-red-50 text-red-800 border-red-300 font-bold",
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
    <div className="space-y-12 sm:space-y-16">
      {/* ========================================================
          1. HERO SECTION WITH PARTICLES & SHIMMER
          ======================================================== */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-600 via-rose-600 to-red-700 p-8 sm:p-12 lg:p-16 text-white shadow-xl text-center">
        {/* Canvas Particles */}
        <Particles
          className="absolute inset-0 z-0 opacity-40"
          quantity={30}
          color="#ffffff"
        />

        {/* Ambient Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Top Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/20 text-white text-xs font-semibold backdrop-blur-md mb-4"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          <span>Hệ Thống Giao Vận Bưu Chính Viettel</span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative z-10 text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white max-w-3xl mx-auto leading-tight"
        >
          Tra Cứu & Theo Dõi Hành Trình Bưu Gửi
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative z-10 text-xs sm:text-sm text-red-100 mt-3 max-w-xl mx-auto font-normal leading-relaxed"
        >
          Nhập mã vận đơn để theo dõi lộ trình bưu kiện thời gian thực, đối soát COD và thanh toán trực tuyến bảo mật.
        </motion.p>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative z-10 mt-8 max-w-2xl mx-auto"
        >
          <div className="relative rounded-2xl bg-white p-2 shadow-2xl border border-white/40">
            <form
              onSubmit={handleSearch}
              className="flex flex-col sm:flex-row gap-2"
            >
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Nhập mã vận đơn (VD: VT379B4895, VT12345678)..."
                  className="w-full pl-11 pr-4 py-3.5 text-slate-900 bg-white rounded-xl text-sm font-semibold outline-none placeholder-slate-400"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="px-7 py-3.5 rounded-xl font-bold text-sm text-white bg-slate-900 hover:bg-black active:scale-[0.98] transition-all shadow-md disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
              >
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
          className="max-w-4xl mx-auto p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 shadow-xs"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-600" />
          <div>
            <p className="font-bold text-sm">Tra cứu không thành công</p>
            <p className="text-xs text-rose-700 mt-0.5">{error}</p>
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
          <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
              <div>
                <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest block">
                  MÃ VẬN ĐƠN HỢP LỆ
                </span>
                <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight mt-1 block">
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
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-red-600 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> Thông Tin Người Gửi
                </p>
                <p className="text-sm font-bold text-slate-900">
                  {result.senderName || result.sender?.name || "N/A"}
                </p>
                <p className="text-xs text-slate-600 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {result.senderPhone || result.sender?.phone || "N/A"}
                </p>
                <p className="text-xs text-slate-600 flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                  <span>{result.senderAddress || result.sender?.address || "N/A"}</span>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> Thông Tin Người Nhận
                </p>
                <p className="text-sm font-bold text-slate-900">
                  {result.receiverName || result.receiver?.name || "N/A"}
                </p>
                <p className="text-xs text-slate-600 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {result.receiverPhone || result.receiver?.phone || "N/A"}
                </p>
                <p className="text-xs text-slate-600 flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                  <span>{result.receiverAddress || result.receiver?.address || "N/A"}</span>
                </p>
              </div>
            </div>

            {/* Financial & Weight Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100 text-center">
              <div className="p-3 rounded-xl bg-slate-50">
                <p className="text-[11px] text-slate-500 font-medium">Khối lượng</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">
                  {result.weight ? `${result.weight} kg` : "0.5 kg"}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50">
                <p className="text-[11px] text-slate-500 font-medium">Cước vận chuyển</p>
                <p className="text-sm font-bold text-red-600 mt-0.5">
                  {formatCurrency(result.shippingFee)}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50">
                <p className="text-[11px] text-slate-500 font-medium">Thu hộ COD</p>
                <p className="text-sm font-bold text-slate-900 mt-0.5">
                  {formatCurrency(result.codAmount)}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50">
                <p className="text-[11px] text-slate-500 font-medium">Shipper phụ trách</p>
                <p className="text-sm font-bold text-blue-600 mt-0.5">
                  {result.shipperId || result.shipperName || "Chưa điều phối"}
                </p>
              </div>
            </div>
          </div>

          {/* Timeline Section */}
          <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-red-600" />
              Lịch Sử Lộ Trình Giao Hàng
            </h2>

            {historyList.length > 0 ? (
              <div className="relative pl-6 border-l-2 border-red-200 space-y-8 ml-3">
                {historyList.map((step, idx) => (
                  <div key={idx} className="relative group">
                    <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-red-600 ring-4 ring-red-100 group-hover:scale-110 transition" />
                    <div className="space-y-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <span className="text-sm font-bold text-slate-900">
                          {step.status || step.action || "Cập nhật trạng thái"}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          {formatDate(step.timestamp || step.createdAt || step.time)}
                        </span>
                      </div>
                      {step.note && <p className="text-xs text-slate-600">{step.note}</p>}
                      {step.location && (
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-red-500" /> {step.location}
                        </p>
                      )}
                      {step.proofImageUrl && (
                        <div className="mt-2">
                          <a
                            href={step.proofImageUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:underline bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg font-medium"
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
              <div className="relative pl-6 border-l-2 border-red-200 space-y-6 ml-3">
                <div className="relative">
                  <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-red-600 ring-4 ring-red-100" />
                  <p className="text-sm font-bold text-slate-900">
                    Trạng thái hiện tại: {result.status || "Đang xử lý"}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Cập nhật gần nhất: {formatDate(result.updatedAt || result.createdAt || new Date())}
                  </p>
                  {result.note && <p className="text-xs text-slate-700 mt-1">{result.note}</p>}
                  {result.proofImageUrl && (
                    <div className="mt-2">
                      <a
                        href={result.proofImageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:underline bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg font-medium"
                      >
                        <ImageIcon className="w-3.5 h-3.5" /> Xem ảnh xác nhận
                      </a>
                    </div>
                  )}
                </div>

                <div className="relative opacity-60">
                  <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-slate-400 ring-4 ring-slate-100" />
                  <p className="text-sm font-medium text-slate-700">Khởi tạo đơn hàng thành công</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Thời gian: {formatDate(result.createdAt || new Date())}
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* ========================================================
          3. BENTO GRID FEATURES
          ======================================================== */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-red-600">
            Hạ Tầng Dịch Vụ Vượt Trội
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Công Nghệ Giao Vận Thông Minh Chuẩn Viettel
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            Hệ sinh thái tích hợp liền mạch từ khâu nhận bưu phẩm, phân phối lộ trình đến đối soát thanh toán.
          </p>
        </div>

        <BentoGrid className="max-w-6xl mx-auto">
          <BentoCard
            name="Mạng Lưới Toàn Quốc 63 Tỉnh Thành"
            description="Độ phủ bưu cục 100% xã phường, kết nối đa phương thức đường bộ & hàng không với thời gian giao nhận cam kết."
            Icon={Truck}
            tag="Phủ Sóng 100%"
            cta="Tìm bưu cục gần nhất"
            className="md:col-span-2 bg-white border border-slate-200"
          />

          <BentoCard
            name="Cổng VNPay Trực Tuyến"
            description="Tích hợp thanh toán QR Code và thẻ nội địa Sandbox, hoàn tất thanh toán cước vận chỉ trong 3 giây."
            Icon={CreditCard}
            tag="Bảo Mật PCI-DSS"
            cta="Trải nghiệm thanh toán"
            className="bg-white border border-slate-200"
          />

          <BentoCard
            name="Thu Hộ COD & Đối Soát Nhanh"
            description="Quản lý dòng tiền bán hàng minh bạch, miễn phí thu hộ cho các đơn nội thành, đối soát linh hoạt."
            Icon={Zap}
            tag="Tiện Ích 0đ"
            className="bg-white border border-slate-200"
          />

          <BentoCard
            name="Kho Voucher & Giảm Cước 50%"
            description="Hệ thống tự động gợi ý mã giảm giá tối ưu nhất cho từng tuyến vận chuyển và kích thước kiện hàng."
            Icon={Sparkles}
            tag="Ưu Đãi Mỗi Ngày"
            cta="Xem mã giảm giá"
            className="md:col-span-2 bg-white border border-slate-200"
          />
        </BentoGrid>
      </section>

      {/* ========================================================
          4. MARQUEE PARTNERS & REVIEWS
          ======================================================== */}
      <section className="space-y-8 overflow-hidden">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600">
            Được Tin Tưởng Bởi Hàng Triệu Khách Hàng
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Đối Tác & Đánh Giá Chất Lượng 5 Sao
          </h2>
        </div>

        {/* Top Marquee */}
        <div className="relative py-2 [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
          <Marquee pauseOnHover className="[--duration:25s]">
            {partners.map((p, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs"
              >
                <div className="w-2 h-2 rounded-full bg-red-600" />
                <span className="text-sm font-bold text-slate-800">{p.name}</span>
                <span className="text-[10px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-medium">
                  {p.tag}
                </span>
              </div>
            ))}
          </Marquee>
        </div>

        {/* Bottom Marquee */}
        <div className="relative py-2 [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
          <Marquee reverse pauseOnHover className="[--duration:35s]">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="w-80 p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{t.name}</h4>
                    <p className="text-[10px] text-slate-500">{t.role}</p>
                  </div>
                  <div className="flex text-amber-400 gap-0.5">
                    {Array.from({ length: t.stars }).map((_, si) => (
                      <Star key={si} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-600 font-light leading-relaxed">
                  "{t.text}"
                </p>
              </div>
            ))}
          </Marquee>
        </div>
      </section>

      {/* ========================================================
          5. CALL TO ACTION
          ======================================================== */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-600 via-rose-600 to-red-700 p-8 sm:p-12 text-center text-white shadow-xl">
        <Ripple mainCircleSize={180} numCircles={5} />
        <Meteors number={12} />

        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold">
            <Zap className="w-3.5 h-3.5" /> Khởi Tạo Đơn Hàng Ngay
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Sẵn Sàng Trải Nghiệm Dịch Vụ Bưu Chính Đỉnh Cao?
          </h2>
          <p className="text-xs sm:text-sm text-red-100 font-normal leading-relaxed">
            Đăng ký tài khoản doanh nghiệp hoặc cá nhân để nhận ngay voucher giảm 50% cước phí cho đơn hàng đầu tiên!
          </p>

          <div className="pt-3 flex items-center justify-center">
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
