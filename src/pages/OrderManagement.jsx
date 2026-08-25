import React, { useState } from "react";
import {
  PackagePlus,
  Ticket,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Send,
  Calculator,
  CreditCard,
  ExternalLink,
  RefreshCw,
  Sparkles,
  MapPin,
  User,
  Phone,
  Layers,
  Copy,
} from "lucide-react";
import { motion } from "framer-motion";
import { createOrder, calculateVoucher, createPayment } from "../api/deliveryApi";
import { BorderBeam } from "../components/magicui/BorderBeam";

export const OrderManagement = () => {
  // Order Form State
  const [orderForm, setOrderForm] = useState({
    senderName: "Nguyễn Văn A",
    senderPhone: "0987654321",
    senderAddress: "Số 1 Giang Văn Minh, Ba Đình, Hà Nội",
    receiverName: "Trần Thị B",
    receiverPhone: "0912345678",
    receiverAddress: "Số 285 Cách Mạng Tháng 8, Quận 10, TP.HCM",
    weight: "1.5",
    shippingFee: "30000",
    codAmount: "0",
    voucherCode: "",
    items: [
      {
        itemName: "Quần áo thời trang",
        quantity: 1,
        weightGram: 500,
        declaredValue: 100000,
      },
    ],
  });

  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [orderError, setOrderError] = useState(null);

  // Recent Orders List (session state)
  const [recentOrders, setRecentOrders] = useState([]);

  // Payment Loading State per order
  const [payingOrderId, setPayingOrderId] = useState(null);
  const [paymentError, setPaymentError] = useState(null);

  // Voucher Form State
  const [voucherForm, setVoucherForm] = useState({
    voucherCode: "VIETTEL50",
    orderAmount: "100000",
  });
  const [voucherSubmitting, setVoucherSubmitting] = useState(false);
  const [voucherResult, setVoucherResult] = useState(null);
  const [voucherError, setVoucherError] = useState(null);

  // Handle Order Form Input Changes
  const handleOrderChange = (e) => {
    const { name, value } = e.target;
    setOrderForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle Items changes
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...orderForm.items];
    updatedItems[index][field] = value;
    setOrderForm((prev) => ({
      ...prev,
      items: updatedItems,
    }));
  };

  const addItem = () => {
    setOrderForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          itemName: "",
          quantity: 1,
          weightGram: 500,
          declaredValue: 50000,
        },
      ],
    }));
  };

  const removeItem = (index) => {
    if (orderForm.items.length <= 1) return;
    const updatedItems = orderForm.items.filter((_, i) => i !== index);
    setOrderForm((prev) => ({
      ...prev,
      items: updatedItems,
    }));
  };

  // Submit Order
  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setOrderSubmitting(true);
    setOrderResult(null);
    setOrderError(null);
    setPaymentError(null);

    try {
      const weightGramVal = Math.max(
        10,
        Math.round((parseFloat(orderForm.weight) || 1) * 1000)
      );
      const payload = {
        senderName: orderForm.senderName.trim(),
        senderPhone: orderForm.senderPhone.trim(),
        senderAddress: orderForm.senderAddress.trim(),
        receiverName: orderForm.receiverName.trim(),
        receiverPhone: orderForm.receiverPhone.trim(),
        receiverAddress: orderForm.receiverAddress.trim(),
        weightGram: weightGramVal,
        shippingFee: parseFloat(orderForm.shippingFee) || 30000,
        codAmount: parseFloat(orderForm.codAmount) || 0,
        voucherCode: orderForm.voucherCode
          ? orderForm.voucherCode.trim().toUpperCase()
          : null,
        items: orderForm.items.map((item) => ({
          itemName: item.itemName.trim() || "Hàng hóa mặc định",
          quantity: parseInt(item.quantity, 10) || 1,
          weightGram:
            parseInt(item.weightGram, 10) ||
            Math.round(weightGramVal / Math.max(1, orderForm.items.length)),
          declaredValue: parseFloat(item.declaredValue) || 50000,
        })),
      };

      const res = await createOrder(payload);
      const createdOrderId =
        res.orderId ||
        res.id ||
        res.data?.id ||
        res.data?.orderId ||
        `ORD-${Date.now().toString().slice(-6)}`;
      const trackingNumber =
        res.trackingNumber || res.data?.trackingNumber || createdOrderId;

      const newOrderEntry = {
        orderId: createdOrderId,
        trackingNumber: trackingNumber,
        receiverName: orderForm.receiverName,
        receiverPhone: orderForm.receiverPhone,
        shippingFee: parseFloat(orderForm.shippingFee) || 0,
        codAmount: parseFloat(orderForm.codAmount) || 0,
        createdAt: new Date().toLocaleTimeString("vi-VN"),
      };

      setOrderResult({ ...res, resolvedOrderId: createdOrderId, trackingNumber });
      setRecentOrders((prev) => [newOrderEntry, ...prev]);

      // Reset form
      setOrderForm((prev) => ({
        ...prev,
        receiverName: "",
        receiverPhone: "",
        receiverAddress: "",
        voucherCode: "",
        items: [
          { itemName: "", quantity: 1, weightGram: 500, declaredValue: 50000 },
        ],
      }));
    } catch (err) {
      console.error("Create order error:", err);
      setOrderError(
        err.message || "Tạo đơn hàng thất bại. Vui lòng kiểm tra lại dữ liệu."
      );
    } finally {
      setOrderSubmitting(false);
    }
  };

  // VNPay Payment Trigger
  const handleVNPayPayment = async (orderId) => {
    if (!orderId) return;
    setPayingOrderId(orderId);
    setPaymentError(null);

    try {
      const res = await createPayment(orderId);
      const paymentUrl =
        typeof res === "string"
          ? res
          : res.paymentUrl ||
            res.url ||
            res.data?.paymentUrl ||
            res.data?.url ||
            res.data;

      if (
        paymentUrl &&
        typeof paymentUrl === "string" &&
        paymentUrl.startsWith("http")
      ) {
        window.location.href = paymentUrl;
      } else {
        throw new Error(
          "Không nhận được đường dẫn thanh toán hợp lệ từ VNPay."
        );
      }
    } catch (err) {
      console.error("Payment error:", err);
      setPaymentError(
        `Lỗi khởi tạo cổng VNPay cho đơn ${orderId}: ${err.message}`
      );
    } finally {
      setPayingOrderId(null);
    }
  };

  // Submit Voucher Calculation
  const handleVoucherSubmit = async (e) => {
    e.preventDefault();
    setVoucherSubmitting(true);
    setVoucherResult(null);
    setVoucherError(null);

    try {
      const payload = {
        voucherCode: voucherForm.voucherCode.trim().toUpperCase(),
        orderAmount: parseFloat(voucherForm.orderAmount) || 0,
      };

      const res = await calculateVoucher(payload);
      setVoucherResult(res);
    } catch (err) {
      console.error("Calculate voucher error:", err);
      setVoucherError(
        err.message || "Không thể áp dụng voucher hoặc mã không hợp lệ."
      );
    } finally {
      setVoucherSubmitting(false);
    }
  };

  const formatVND = (num) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(num || 0);
  };

  return (
    <div className="space-y-8">
      {/* Page Heading */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
          <PackagePlus className="w-7 h-7 text-red-500" />
          Tạo & Quản Lý Đơn Hàng
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1">
          Khởi tạo vận đơn mới, tích hợp cổng thanh toán VNPay trực tuyến và tính toán ưu đãi voucher
        </p>
      </div>

      {paymentError && (
        <div className="p-4 rounded-2xl bg-rose-950/50 border border-rose-500/30 text-rose-200 flex items-start gap-3 backdrop-blur-md">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-400" />
          <div className="flex-1">
            <p className="font-bold text-sm">Lỗi thanh toán VNPay</p>
            <p className="text-xs text-rose-300 mt-0.5">{paymentError}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* SECTION 1: CREATE ORDER FORM */}
        <div className="lg:col-span-2 space-y-6">
          <div className="relative rounded-3xl bg-neutral-900/80 border border-white/10 p-6 sm:p-8 backdrop-blur-2xl shadow-glass-md">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="w-2.5 h-6 bg-red-600 rounded-full inline-block" />
                Tạo Vận Đơn Mới
              </h2>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-red-600/20 text-red-400 border border-red-500/30">
                Bắt buộc nhập đủ
              </span>
            </div>

            {/* Created Success Alert with VNPay button */}
            {orderResult && (
              <div className="mb-6 p-5 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-emerald-200 backdrop-blur-md">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-0.5 text-emerald-400" />
                  <div>
                    <p className="font-bold text-white text-sm">Tạo đơn hàng thành công!</p>
                    <p className="text-xs mt-1 text-emerald-300">
                      Mã vận đơn (Tra cứu):{" "}
                      <span className="font-mono font-bold bg-emerald-900/80 text-emerald-200 px-2.5 py-1 rounded-lg border border-emerald-500/40 select-all">
                        {orderResult.trackingNumber}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(orderResult.trackingNumber);
                      alert("Đã sao chép mã vận đơn!");
                    }}
                    className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition cursor-pointer"
                  >
                    Sao chép mã 📋
                  </button>
                  <button
                    type="button"
                    onClick={() => handleVNPayPayment(orderResult.resolvedOrderId)}
                    disabled={payingOrderId === orderResult.resolvedOrderId}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:brightness-110 font-bold text-xs shadow-md transition cursor-pointer self-start sm:self-auto"
                  >
                    {payingOrderId === orderResult.resolvedOrderId ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <CreditCard className="w-4 h-4" />
                    )}
                    <span>Thanh Toán VNPay</span>
                  </button>
                </div>
              </div>
            )}

            {orderError && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-950/50 border border-rose-500/30 text-rose-200 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-400" />
                <div>
                  <p className="font-bold text-sm">Lỗi tạo đơn hàng</p>
                  <p className="text-xs text-rose-300 mt-1">{orderError}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleOrderSubmit} className="space-y-6">
              {/* Người gửi & Người nhận */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Người gửi */}
                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-4">
                  <h3 className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> 1. Thông Tin Người Gửi
                  </h3>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Họ tên người gửi *</label>
                    <input
                      type="text"
                      name="senderName"
                      required
                      value={orderForm.senderName}
                      onChange={handleOrderChange}
                      placeholder="Nguyễn Văn A"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950/80 border border-white/10 text-white placeholder-neutral-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Số điện thoại *</label>
                    <input
                      type="tel"
                      name="senderPhone"
                      required
                      value={orderForm.senderPhone}
                      onChange={handleOrderChange}
                      placeholder="0987654321"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950/80 border border-white/10 text-white placeholder-neutral-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Địa chỉ lấy hàng *</label>
                    <textarea
                      rows="2"
                      name="senderAddress"
                      required
                      value={orderForm.senderAddress}
                      onChange={handleOrderChange}
                      placeholder="Số 1 Giang Văn Minh, Ba Đình, Hà Nội"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950/80 border border-white/10 text-white placeholder-neutral-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 text-sm outline-none resize-none"
                    />
                  </div>
                </div>

                {/* Người nhận */}
                <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-4">
                  <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> 2. Thông Tin Người Nhận
                  </h3>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Họ tên người nhận *</label>
                    <input
                      type="text"
                      name="receiverName"
                      required
                      value={orderForm.receiverName}
                      onChange={handleOrderChange}
                      placeholder="Trần Thị B"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950/80 border border-white/10 text-white placeholder-neutral-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Số điện thoại *</label>
                    <input
                      type="tel"
                      name="receiverPhone"
                      required
                      value={orderForm.receiverPhone}
                      onChange={handleOrderChange}
                      placeholder="0912345678"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950/80 border border-white/10 text-white placeholder-neutral-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 text-sm outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Địa chỉ giao hàng *</label>
                    <textarea
                      rows="2"
                      name="receiverAddress"
                      required
                      value={orderForm.receiverAddress}
                      onChange={handleOrderChange}
                      placeholder="Số 285 Cách Mạng Tháng 8, Quận 10, TP.HCM"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950/80 border border-white/10 text-white placeholder-neutral-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 text-sm outline-none resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Thông số kiện hàng & Cước phí */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Khối lượng (kg) *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    name="weight"
                    required
                    value={orderForm.weight}
                    onChange={handleOrderChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950/80 border border-white/10 text-white placeholder-neutral-500 focus:border-red-500 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Cước vận chuyển (VNĐ) *</label>
                  <input
                    type="number"
                    name="shippingFee"
                    required
                    value={orderForm.shippingFee}
                    onChange={handleOrderChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950/80 border border-white/10 text-white placeholder-neutral-500 focus:border-red-500 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Tiền thu hộ COD (VNĐ)</label>
                  <input
                    type="number"
                    name="codAmount"
                    value={orderForm.codAmount}
                    onChange={handleOrderChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950/80 border border-white/10 text-white placeholder-neutral-500 focus:border-red-500 text-sm outline-none"
                  />
                </div>
              </div>

              {/* Danh sách mặt hàng */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5" /> 3. Danh Sách Mặt Hàng Trong Kiện
                  </h3>
                  <button
                    type="button"
                    onClick={addItem}
                    className="inline-flex items-center gap-1 text-xs font-bold text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded-lg transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Thêm hàng
                  </button>
                </div>

                <div className="space-y-3">
                  {orderForm.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center bg-black/40 p-3 rounded-xl border border-white/5">
                      <div className="sm:col-span-4">
                        <label className="block text-[10px] text-neutral-400 mb-1">Tên hàng</label>
                        <input
                          type="text"
                          required
                          value={item.itemName}
                          onChange={(e) => handleItemChange(index, "itemName", e.target.value)}
                          placeholder="Quần áo thời trang"
                          className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-xs outline-none focus:border-red-500"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] text-neutral-400 mb-1">SL</label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-xs outline-none focus:border-red-500"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] text-neutral-400 mb-1">Cân nặng (g)</label>
                        <input
                          type="number"
                          min="10"
                          value={item.weightGram}
                          onChange={(e) => handleItemChange(index, "weightGram", e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-xs outline-none focus:border-red-500"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="block text-[10px] text-neutral-400 mb-1">Giá trị khai báo (VNĐ)</label>
                        <input
                          type="number"
                          min="0"
                          value={item.declaredValue}
                          onChange={(e) => handleItemChange(index, "declaredValue", e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-neutral-950 border border-white/10 text-white text-xs outline-none focus:border-red-500"
                        />
                      </div>
                      <div className="sm:col-span-1 flex justify-center pt-4 sm:pt-0">
                        {orderForm.items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="p-2 text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Voucher Input Box */}
              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-amber-300">
                  <Ticket className="w-5 h-5 text-amber-400" />
                  <div>
                    <p className="text-xs font-bold text-amber-200">Mã Voucher Cho Đơn Hàng (Tùy chọn)</p>
                    <p className="text-[11px] text-neutral-400">Nhập mã ưu đãi giảm cước giao hàng (VD: VIETTEL50, FREESHIP)</p>
                  </div>
                </div>
                <input
                  type="text"
                  name="voucherCode"
                  value={orderForm.voucherCode}
                  onChange={handleOrderChange}
                  placeholder="MÃ VOUCHER (VIETTEL50)"
                  className="w-full sm:w-60 px-3.5 py-2 rounded-xl bg-neutral-950 border border-amber-500/30 text-amber-300 uppercase font-mono font-bold text-xs outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                disabled={orderSubmitting}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white font-bold text-sm shadow-glow-red hover:shadow-glow-red-lg hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {orderSubmitting ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Xác Nhận Tạo Đơn</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* SECTION 2: VOUCHER & RECENT ORDERS */}
        <div className="space-y-6">
          {/* Voucher Calculator Card */}
          <div className="rounded-3xl bg-neutral-900/80 border border-white/10 p-6 backdrop-blur-2xl shadow-glass-md space-y-4">
            <div className="flex items-center gap-2 text-white pb-3 border-b border-white/10">
              <Ticket className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold">Áp Dụng Voucher</h2>
            </div>

            {voucherResult && (
              <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-xs text-emerald-200 space-y-1">
                <p className="font-bold text-white">Mã hợp lệ!</p>
                <p>
                  Giảm giá:{" "}
                  <span className="font-bold text-amber-300">
                    {formatVND(
                      typeof voucherResult === "number"
                        ? voucherResult
                        : voucherResult.discountAmount || voucherResult.data || 0
                    )}
                  </span>
                </p>
              </div>
            )}

            {voucherError && (
              <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/30 text-xs text-rose-300">
                {voucherError}
              </div>
            )}

            <form onSubmit={handleVoucherSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-300 mb-1">Mã Voucher *</label>
                <input
                  type="text"
                  required
                  value={voucherForm.voucherCode}
                  onChange={(e) => setVoucherForm({ ...voucherForm, voucherCode: e.target.value })}
                  placeholder="VIETTEL50"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-white/10 text-amber-300 font-mono font-bold text-xs uppercase outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-300 mb-1">Giá trị đơn hàng (VNĐ) *</label>
                <input
                  type="number"
                  required
                  value={voucherForm.orderAmount}
                  onChange={(e) => setVoucherForm({ ...voucherForm, orderAmount: e.target.value })}
                  placeholder="100000"
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-white/10 text-white text-xs outline-none focus:border-red-500"
                />
              </div>

              <button
                type="submit"
                disabled={voucherSubmitting}
                className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2"
              >
                {voucherSubmitting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Calculator className="w-4 h-4 text-amber-400" />
                    <span>Kiểm Tra & Tính Giảm Giá</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Recent Orders Card */}
          <div className="rounded-3xl bg-neutral-900/80 border border-white/10 p-6 backdrop-blur-2xl shadow-glass-md space-y-4">
            <h2 className="text-base font-bold text-white pb-3 border-b border-white/10 flex items-center justify-between">
              <span>Đơn Hàng Vừa Tạo</span>
              <span className="text-[11px] text-neutral-400 font-normal">Phiên làm việc</span>
            </h2>

            {recentOrders.length === 0 ? (
              <div className="p-6 text-center text-xs text-neutral-500">
                Chưa có đơn hàng nào được tạo trong phiên này
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {recentOrders.map((ord, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-xs text-red-400">{ord.trackingNumber}</span>
                      <span className="text-[10px] text-neutral-400">{ord.createdAt}</span>
                    </div>
                    <p className="text-xs text-neutral-300">Người nhận: <span className="font-semibold text-white">{ord.receiverName}</span></p>
                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <span className="text-xs font-bold text-amber-300">{formatVND(ord.shippingFee)}</span>
                      <button
                        type="button"
                        onClick={() => handleVNPayPayment(ord.orderId)}
                        disabled={payingOrderId === ord.orderId}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-400 hover:text-blue-300 cursor-pointer"
                      >
                        <CreditCard className="w-3.5 h-3.5" /> Thanh toán VNPay
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;
