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
  Layers,
  ArrowUpRight,
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
            "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
        };
      case "IN_TRANSIT":
      case "SHIPPING":
      case "DELIVERING":
        return {
          label: "Đang vận chuyển",
          className: "bg-blue-500/20 text-blue-300 border-blue-500/30",
        };
      case "PICKED_UP":
        return {
          label: "Đã lấy hàng",
          className: "bg-purple-500/20 text-purple-300 border-purple-500/30",
        };
      case "ASSIGNED":
        return {
          label: "Đã phân công Shipper",
          className: "bg-amber-500/20 text-amber-300 border-amber-500/30",
        };
      case "PENDING":
      case "CREATED":
        return {
          label: "Đơn mới tiếp nhận",
          className: "bg-neutral-500/20 text-neutral-300 border-neutral-500/30",
        };
      case "CANCELLED":
      case "FAILED":
        return {
          label: "Đã hủy / Thất bại",
          className: "bg-rose-500/20 text-rose-300 border-rose-500/30",
        };
      default:
        return {
          label: s || "Đang xử lý",
          className: "bg-red-500/20 text-red-300 border-red-500/30",
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

  // Partners & Social Proof Data
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
    <div className="space-y-16 lg:space-y-24">
      {/* ========================================================
          1. HERO SECTION WITH PARTICLES & BORDER BEAM
          ======================================================== */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-neutral-900/90 via-neutral-950 to-black p-8 sm:p-14 lg:p-20 border border-white/10 shadow-glass-md text-center">
        {/* Interactive Particles Background */}
        <Particles
          className="absolute inset-0 z-0"
          quantity={40}
          color="#ee0033"
        />

        {/* Ambient Top Glow Orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Top Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-neutral-300 text-xs font-semibold backdrop-blur-md mb-6"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>Hệ Thống Bưu Chính Số Thế Hệ Mới</span>
        </motion.div>

        {/* Hero Title */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative z-10 text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight"
        >
          Tra Cứu & Điều Phối{" "}
          <span className="text-gradient-silver">Hành Trình Bưu Gửi</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative z-10 text-sm sm:text-base text-neutral-400 mt-4 max-w-2xl mx-auto font-light leading-relaxed"
        >
          Theo dõi trạng thái lộ trình đơn hàng thời gian thực, quản lý thu hộ COD
          và thanh toán bảo mật với công nghệ chuẩn công nghiệp.
        </motion.p>

        {/* Glassmorphism Search Bar Card with BorderBeam */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative z-10 mt-8 max-w-2xl mx-auto"
        >
          <div className="relative rounded-2xl bg-neutral-900/80 p-2 border border-white/10 shadow-glass-md backdrop-blur-2xl">
            {/* Border Beam Running Light */}
            <BorderBeam
              size={180}
              duration={8}
              colorFrom="#ee0033"
              colorTo="#d4af37"
            />

            <form
              onSubmit={handleSearch}
              className="flex flex-col sm:flex-row gap-2"
            >
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Nhập mã vận đơn (VD: VT379B4895, VT12345678)..."
                  className="w-full pl-11 pr-4 py-3.5 text-white bg-transparent rounded-xl text-sm font-medium outline-none placeholder-neutral-500"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="px-7 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-red-600 via-rose-600 to-red-700 shadow-glow-red hover:shadow-red-500/50 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
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
          2. TRACKING SEARCH RESULTS (IF PRESENT)
          ======================================================== */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-200 flex items-start gap-3 backdrop-blur-md"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-400" />
          <div>
            <p className="font-bold text-sm">Tra cứu không thành công</p>
            <p className="text-xs text-rose-300/80 mt-0.5">{error}</p>
          </div>
        </motion.div>
      )}

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto space-y-6"
        >
          {/* Main Info Glass Card */}
          <div className="relative overflow-hidden rounded-3xl bg-neutral-900/70 border border-white/10 p-6 sm:p-8 backdrop-blur-2xl shadow-glass-md">
            <BorderBeam size={220} duration={12} colorFrom="#3b82f6" colorTo="#ee0033" />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
              <div>
                <span className="text-[11px] font-mono font-bold text-neutral-400 uppercase tracking-widest block">
                  MÃ VẬN ĐƠN HỢP LỆ
                </span>
                <span className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight mt-1 block">
                  {result.trackingNumber || result.orderId || result.id || trackingNumber}
                </span>
              </div>
              <div>
                {(() => {
                  const badge = getStatusBadge(result.status || result.shipmentStatus);
                  return (
                    <span
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border backdrop-blur-md ${badge.className}`}
                    >
                      <span className="w-2 h-2 rounded-full bg-current animate-ping" />
                      {badge.label}
                    </span>
                  );
                })()}
              </div>
            </div>

            {/* Sender & Receiver Glass Sub-Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> Thông Tin Người Gửi
                </p>
                <p className="text-sm font-semibold text-white">
                  {result.senderName || result.sender?.name || "N/A"}
                </p>
                <p className="text-xs text-neutral-400 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-neutral-500" />
                  {result.senderPhone || result.sender?.phone || "N/A"}
                </p>
                <p className="text-xs text-neutral-400 flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-neutral-500 flex-shrink-0 mt-0.5" />
                  <span>{result.senderAddress || result.sender?.address || "N/A"}</span>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> Thông Tin Người Nhận
                </p>
                <p className="text-sm font-semibold text-white">
                  {result.receiverName || result.receiver?.name || "N/A"}
                </p>
                <p className="text-xs text-neutral-400 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-neutral-500" />
                  {result.receiverPhone || result.receiver?.phone || "N/A"}
                </p>
                <p className="text-xs text-neutral-400 flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-neutral-500 flex-shrink-0 mt-0.5" />
                  <span>{result.receiverAddress || result.receiver?.address || "N/A"}</span>
                </p>
              </div>
            </div>

            {/* Financial & Weight Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10 text-center">
              <div className="p-3 rounded-xl bg-white/5">
                <p className="text-[11px] text-neutral-400">Khối lượng</p>
                <p className="text-sm font-bold text-white mt-0.5">
                  {result.weight ? `${result.weight} kg` : "0.5 kg"}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-white/5">
                <p className="text-[11px] text-neutral-400">Cước vận chuyển</p>
                <p className="text-sm font-bold text-red-400 mt-0.5">
                  {formatCurrency(result.shippingFee)}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-white/5">
                <p className="text-[11px] text-neutral-400">Thu hộ COD</p>
                <p className="text-sm font-bold text-amber-400 mt-0.5">
                  {formatCurrency(result.codAmount)}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-white/5">
                <p className="text-[11px] text-neutral-400">Shipper phụ trách</p>
                <p className="text-sm font-bold text-blue-400 mt-0.5">
                  {result.shipperId || result.shipperName || "Chưa điều phối"}
                </p>
              </div>
            </div>
          </div>

          {/* Timeline Section */}
          <div className="rounded-3xl bg-neutral-900/70 border border-white/10 p-6 sm:p-8 backdrop-blur-2xl shadow-glass-md">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-red-500" />
              Lịch Sử Lộ Trình Giao Hàng
            </h2>

            {historyList.length > 0 ? (
              <div className="relative pl-6 border-l-2 border-red-500/30 space-y-8 ml-3">
                {historyList.map((step, idx) => (
                  <div key={idx} className="relative group">
                    <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-red-600 ring-4 ring-red-600/20 group-hover:scale-110 transition" />
                    <div className="space-y-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <span className="text-sm font-bold text-white">
                          {step.status || step.action || "Cập nhật trạng thái"}
                        </span>
                        <span className="text-xs text-neutral-400 font-mono">
                          {formatDate(step.timestamp || step.createdAt || step.time)}
                        </span>
                      </div>
                      {step.note && <p className="text-xs text-neutral-300">{step.note}</p>}
                      {step.location && (
                        <p className="text-xs text-neutral-400 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-red-400" /> {step.location}
                        </p>
                      )}
                      {step.proofImageUrl && (
                        <div className="mt-2">
                          <a
                            href={step.proofImageUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-lg"
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
              <div className="relative pl-6 border-l-2 border-red-500/30 space-y-6 ml-3">
                <div className="relative">
                  <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-red-600 ring-4 ring-red-600/20" />
                  <p className="text-sm font-bold text-white">
                    Trạng thái hiện tại: {result.status || "Đang xử lý"}
                  </p>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Cập nhật gần nhất: {formatDate(result.updatedAt || result.createdAt || new Date())}
                  </p>
                  {result.note && <p className="text-xs text-neutral-300 mt-1">{result.note}</p>}
                  {result.proofImageUrl && (
                    <div className="mt-2">
                      <a
                        href={result.proofImageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-lg"
                      >
                        <ImageIcon className="w-3.5 h-3.5" /> Xem ảnh xác nhận
                      </a>
                    </div>
                  )}
                </div>

                <div className="relative opacity-60">
                  <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-neutral-600 ring-4 ring-neutral-700" />
                  <p className="text-sm font-medium text-neutral-300">Khởi tạo đơn hàng thành công</p>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Thời gian: {formatDate(result.createdAt || new Date())}
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* ========================================================
          3. BENTO GRID FEATURES WITH SPOTLIGHT
          ======================================================== */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-red-500">
            Hạ Tầng Dịch Vụ Vượt Trội
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Công Nghệ Giao Vận Thông Minh Chuẩn Viettel
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-xl mx-auto">
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
            className="md:col-span-2"
          />

          <BentoCard
            name="Cổng VNPay Trực Tuyến"
            description="Tích hợp thanh toán QR Code và thẻ nội địa Sandbox, hoàn tất thanh toán cước vận chỉ trong 3 giây."
            Icon={CreditCard}
            tag="Bảo Mật PCI-DSS"
            cta="Trải nghiệm thanh toán"
          />

          <BentoCard
            name="Thu Hộ COD & Đối Soát Nhanh"
            description="Quản lý dòng tiền bán hàng minh bạch, miễn phí thu hộ cho các đơn nội thành, đối soát linh hoạt."
            Icon={Zap}
            tag="Tiện Ích 0đ"
          />

          <BentoCard
            name="Kho Voucher & Giảm Cước 50%"
            description="Hệ thống tự động gợi ý mã giảm giá tối ưu nhất cho từng tuyến vận chuyển và kích thước kiện hàng."
            Icon={Sparkles}
            tag="Ưu Đãi Mỗi Ngày"
            cta="Xem mã giảm giá"
            className="md:col-span-2"
          />
        </BentoGrid>
      </section>

      {/* ========================================================
          4. MARQUEE PARTNERS & REVIEWS
          ======================================================== */}
      <section className="space-y-8 overflow-hidden">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
            Được Tin Tưởng Bởi Hàng Triệu Khách Hàng
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Đối Tác & Đánh Giá Chất Lượng 5 Sao
          </h2>
        </div>

        {/* Top Marquee: Partners */}
        <div className="relative py-2 [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
          <Marquee pauseOnHover className="[--duration:25s]">
            {partners.map((p, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-neutral-900/60 border border-white/10 backdrop-blur-md"
              >
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-sm font-bold text-white">{p.name}</span>
                <span className="text-[10px] text-neutral-400 bg-white/5 px-2 py-0.5 rounded-full">
                  {p.tag}
                </span>
              </div>
            ))}
          </Marquee>
        </div>

        {/* Bottom Marquee: Reviews */}
        <div className="relative py-2 [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
          <Marquee reverse pauseOnHover className="[--duration:35s]">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="w-80 p-5 rounded-2xl bg-neutral-900/70 border border-white/10 backdrop-blur-md space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">{t.name}</h4>
                    <p className="text-[10px] text-neutral-400">{t.role}</p>
                  </div>
                  <div className="flex text-amber-400 gap-0.5">
                    {Array.from({ length: t.stars }).map((_, si) => (
                      <Star key={si} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-neutral-300 font-light leading-relaxed">
                  "{t.text}"
                </p>
              </div>
            ))}
          </Marquee>
        </div>
      </section>

      {/* ========================================================
          5. CALL TO ACTION (CTA) WITH METEORS & RIPPLE
          ======================================================== */}
      <section className="relative overflow-hidden rounded-3xl bg-neutral-900/80 border border-white/10 p-8 sm:p-14 text-center backdrop-blur-2xl shadow-glass-md">
        {/* Ripple and Meteors Background */}
        <Ripple mainCircleSize={180} numCircles={6} />
        <Meteors number={15} />

        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold">
            <Zap className="w-3.5 h-3.5" /> Khởi Tạo Đơn Hàng Ngay
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Sẵn Sàng Trải Nghiệm Dịch Vụ Bưu Chính Đỉnh Cao?
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
            Đăng ký tài khoản doanh nghiệp hoặc cá nhân để nhận ngay voucher giảm 50% cước phí cho đơn hàng đầu tiên!
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <ShimmerButton
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="w-full sm:w-auto"
            >
              <span className="text-xs sm:text-sm font-bold flex items-center gap-2">
                <Package className="w-4 h-4" /> Bắt Đầu Gửi Hàng
              </span>
            </ShimmerButton>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Tracking;
