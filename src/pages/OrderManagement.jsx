import React, { useState } from 'react';
import { PackagePlus, Ticket, Plus, Trash2, CheckCircle2, AlertCircle, Send, Calculator, CreditCard, ExternalLink, RefreshCw } from 'lucide-react';
import { createOrder, calculateVoucher, createPayment } from '../api/deliveryApi';

const OrderManagement = () => {
  // Order Form State
  const [orderForm, setOrderForm] = useState({
    senderName: 'Nguyễn Văn A',
    senderPhone: '0987654321',
    senderAddress: 'Số 1 Giang Văn Minh, Ba Đình, Hà Nội',
    receiverName: 'Trần Thị B',
    receiverPhone: '0912345678',
    receiverAddress: 'Số 285 Cách Mạng Tháng 8, Quận 10, TP.HCM',
    weight: '1.5',
    shippingFee: '30000',
    codAmount: '0',
    voucherCode: '',
    items: [{ itemName: 'Quần áo thời trang', quantity: 1, weightGram: 500, declaredValue: 100000 }],
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
    voucherCode: 'VIETTEL50',
    orderAmount: '100000',
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
      items: [...prev.items, { itemName: '', quantity: 1, weightGram: 500, declaredValue: 50000 }],
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
      const weightGramVal = Math.max(10, Math.round((parseFloat(orderForm.weight) || 1) * 1000));
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
        voucherCode: orderForm.voucherCode ? orderForm.voucherCode.trim().toUpperCase() : null,
        items: orderForm.items.map((item) => ({
          itemName: item.itemName.trim() || 'Hàng hóa mặc định',
          quantity: parseInt(item.quantity, 10) || 1,
          weightGram: parseInt(item.weightGram, 10) || Math.round(weightGramVal / Math.max(1, orderForm.items.length)),
          declaredValue: parseFloat(item.declaredValue) || 50000,
        })),
      };

      const res = await createOrder(payload);
      const createdOrderId = res.orderId || res.id || res.data?.id || res.data?.orderId || `ORD-${Date.now().toString().slice(-6)}`;
      const trackingNumber = res.trackingNumber || res.data?.trackingNumber || createdOrderId;
      
      const newOrderEntry = {
        orderId: createdOrderId,
        trackingNumber: trackingNumber,
        receiverName: orderForm.receiverName,
        receiverPhone: orderForm.receiverPhone,
        shippingFee: parseFloat(orderForm.shippingFee) || 0,
        codAmount: parseFloat(orderForm.codAmount) || 0,
        createdAt: new Date().toLocaleTimeString('vi-VN'),
      };

      setOrderResult({ ...res, resolvedOrderId: createdOrderId, trackingNumber });
      setRecentOrders((prev) => [newOrderEntry, ...prev]);

      // Reset form but keep helpful defaults
      setOrderForm((prev) => ({
        ...prev,
        receiverName: '',
        receiverPhone: '',
        receiverAddress: '',
        voucherCode: '',
        items: [{ itemName: '', quantity: 1, weightGram: 500, declaredValue: 50000 }],
      }));
    } catch (err) {
      console.error('Create order error:', err);
      setOrderError(err.message || 'Tạo đơn hàng thất bại. Vui lòng kiểm tra lại dữ liệu.');
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
      // Support string URL, or { paymentUrl: '...' }, { url: '...' }, { data: '...' }
      const paymentUrl =
        typeof res === 'string'
          ? res
          : res.paymentUrl || res.url || res.data?.paymentUrl || res.data?.url || res.data;

      if (paymentUrl && typeof paymentUrl === 'string' && paymentUrl.startsWith('http')) {
        // Redirect user to VNPay Sandbox Gateway
        window.location.href = paymentUrl;
      } else {
        throw new Error('Không nhận được đường dẫn thanh toán hợp lệ từ VNPay.');
      }
    } catch (err) {
      console.error('Payment error:', err);
      setPaymentError(`Lỗi khởi tạo cổng VNPay cho đơn ${orderId}: ${err.message}`);
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
      console.error('Calculate voucher error:', err);
      setVoucherError(err.message || 'Không thể áp dụng voucher hoặc mã không hợp lệ.');
    } finally {
      setVoucherSubmitting(false);
    }
  };

  const formatVND = (num) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num || 0);
  };

  return (
    <div className="space-y-8">
      {/* Page Heading */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
          <PackagePlus className="w-7 h-7 text-red-600" />
          Tạo & Quản Lý Đơn Hàng
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Khởi tạo vận đơn mới, tích hợp thanh toán VNPay trực tuyến và tính toán ưu đãi mã giảm giá
        </p>
      </div>

      {paymentError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-800">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-600" />
          <div className="flex-1">
            <p className="font-semibold">Lỗi thanh toán VNPay</p>
            <p className="text-xs mt-0.5">{paymentError}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* SECTION 1: CREATE ORDER FORM */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
                <span className="w-2.5 h-6 bg-red-600 rounded-full inline-block"></span>
                Tạo Vận Đơn Mới
              </h2>
              <span className="text-xs font-semibold px-2.5 py-1 bg-red-50 text-red-600 rounded-full">
                Bắt buộc nhập đủ
              </span>
            </div>

            {/* Created Success Alert with VNPay button */}
            {orderResult && (
              <div className="mb-6 p-5 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-emerald-800">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-0.5 text-emerald-600" />
                  <div>
                    <p className="font-bold text-emerald-900">Tạo đơn hàng thành công!</p>
                    <p className="text-xs mt-1">
                      Mã đơn hàng:{' '}
                      <span className="font-mono font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded">
                        {orderResult.resolvedOrderId}
                      </span>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleVNPayPayment(orderResult.resolvedOrderId)}
                  disabled={payingOrderId === orderResult.resolvedOrderId}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold text-xs shadow transition cursor-pointer self-start sm:self-auto"
                >
                  {payingOrderId === orderResult.resolvedOrderId ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <CreditCard className="w-4 h-4" />
                  )}
                  <span>Thanh Toán VNPay</span>
                </button>
              </div>
            )}

            {orderError && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-800">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-600" />
                <div>
                  <p className="font-semibold">Lỗi tạo đơn hàng</p>
                  <p className="text-sm mt-1">{orderError}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleOrderSubmit} className="space-y-6">
              {/* Người gửi & Người nhận */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Người gửi */}
                <div className="p-4 bg-gray-50/70 rounded-xl border border-gray-200/80 space-y-4">
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1.5 text-red-600">
                    <span>1.</span> Thông Tin Người Gửi
                  </h3>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Họ tên người gửi *</label>
                    <input
                      type="text"
                      name="senderName"
                      required
                      value={orderForm.senderName}
                      onChange={handleOrderChange}
                      placeholder="Nguyễn Văn A"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Số điện thoại *</label>
                    <input
                      type="tel"
                      name="senderPhone"
                      required
                      value={orderForm.senderPhone}
                      onChange={handleOrderChange}
                      placeholder="0987654321"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Địa chỉ lấy hàng *</label>
                    <textarea
                      rows="2"
                      name="senderAddress"
                      required
                      value={orderForm.senderAddress}
                      onChange={handleOrderChange}
                      placeholder="Số 1 Giang Văn Minh, Ba Đình, Hà Nội"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-white resize-none"
                    />
                  </div>
                </div>

                {/* Người nhận */}
                <div className="p-4 bg-gray-50/70 rounded-xl border border-gray-200/80 space-y-4">
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1.5 text-red-600">
                    <span>2.</span> Thông Tin Người Nhận
                  </h3>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Họ tên người nhận *</label>
                    <input
                      type="text"
                      name="receiverName"
                      required
                      value={orderForm.receiverName}
                      onChange={handleOrderChange}
                      placeholder="Trần Thị B"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Số điện thoại *</label>
                    <input
                      type="tel"
                      name="receiverPhone"
                      required
                      value={orderForm.receiverPhone}
                      onChange={handleOrderChange}
                      placeholder="0912345678"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Địa chỉ giao hàng *</label>
                    <textarea
                      rows="2"
                      name="receiverAddress"
                      required
                      value={orderForm.receiverAddress}
                      onChange={handleOrderChange}
                      placeholder="Số 285 Cách Mạng Tháng 8, Quận 10, TP.HCM"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-white resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Thông số kiện hàng & Phí */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gray-50/70 rounded-xl border border-gray-200/80">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Khối lượng (kg) *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    name="weight"
                    required
                    value={orderForm.weight}
                    onChange={handleOrderChange}
                    placeholder="1.5"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Cước vận chuyển (VNĐ) *</label>
                  <input
                    type="number"
                    min="0"
                    name="shippingFee"
                    required
                    value={orderForm.shippingFee}
                    onChange={handleOrderChange}
                    placeholder="30000"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Tiền thu hộ COD (VNĐ)</label>
                  <input
                    type="number"
                    min="0"
                    name="codAmount"
                    value={orderForm.codAmount}
                    onChange={handleOrderChange}
                    placeholder="0"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-white"
                  />
                </div>
              </div>

              {/* Danh sách hàng hóa (Items) */}
              <div className="p-4 bg-gray-50/70 rounded-xl border border-gray-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1.5 text-red-600">
                    <span>3.</span> Danh Sách Mặt Hàng Trong Kiện
                  </h3>
                  <button
                    type="button"
                    onClick={addItem}
                    className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                  >
                    <Plus className="w-3.5 h-3.5" /> Thêm hàng
                  </button>
                </div>

                <div className="space-y-3">
                  {orderForm.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-white p-3 rounded-lg border border-gray-200 items-center">
                      <div className="sm:col-span-4">
                        <label className="block text-[11px] font-medium text-gray-500 mb-0.5">Tên hàng</label>
                        <input
                          type="text"
                          placeholder="Ví dụ: Quần áo, Phụ kiện"
                          required
                          value={item.itemName}
                          onChange={(e) => handleItemChange(index, 'itemName', e.target.value)}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 outline-none"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-medium text-gray-500 mb-0.5">SL</label>
                        <input
                          type="number"
                          min="1"
                          placeholder="1"
                          required
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 outline-none"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-medium text-gray-500 mb-0.5">Cân nặng (g)</label>
                        <input
                          type="number"
                          min="1"
                          placeholder="500"
                          required
                          value={item.weightGram}
                          onChange={(e) => handleItemChange(index, 'weightGram', e.target.value)}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 outline-none"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="block text-[11px] font-medium text-gray-500 mb-0.5">Giá trị khai báo (VNĐ)</label>
                        <input
                          type="number"
                          min="1"
                          placeholder="100000"
                          required
                          value={item.declaredValue}
                          onChange={(e) => handleItemChange(index, 'declaredValue', e.target.value)}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 outline-none"
                        />
                      </div>
                      <div className="sm:col-span-1 flex justify-center pt-4 sm:pt-3">
                        {orderForm.items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition cursor-pointer"
                            title="Xóa hàng này"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mã khuyến mãi Voucher áp dụng cho đơn (Tùy chọn) */}
              <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-amber-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-amber-900">Mã Voucher Cho Đơn Hàng (Tùy chọn)</p>
                    <p className="text-[11px] text-amber-700">Nhập mã ưu đãi giảm cước giao hàng (VD: VIETTEL50, FREESHIP)</p>
                  </div>
                </div>
                <div className="w-full sm:w-64">
                  <input
                    type="text"
                    name="voucherCode"
                    value={orderForm.voucherCode}
                    onChange={handleOrderChange}
                    placeholder="Mã voucher (VIETTEL50)"
                    className="w-full px-3 py-1.5 text-sm uppercase tracking-wider font-semibold border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={orderSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 active:bg-red-800 transition font-bold shadow-md disabled:opacity-60 cursor-pointer"
                >
                  <Send className={`w-4 h-4 ${orderSubmitting ? 'animate-bounce' : ''}`} />
                  {orderSubmitting ? 'Đang Tạo Vận Đơn...' : 'Xác Nhận Tạo Đơn'}
                </button>
              </div>
            </form>
          </div>

          {/* Recently Created Orders Section with VNPay button */}
          {recentOrders.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center justify-between">
                <span>Đơn hàng vừa tạo trong phiên</span>
                <span className="text-xs font-normal text-gray-500">{recentOrders.length} đơn</span>
              </h3>
              <div className="divide-y divide-gray-100">
                {recentOrders.map((ord) => (
                  <div key={ord.orderId} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="font-mono font-bold text-sm text-gray-900 mr-2">{ord.orderId}</span>
                      <span className="text-xs text-gray-600">
                        {ord.receiverName} ({ord.receiverPhone}) - Cước: <strong className="text-red-600">{formatVND(ord.shippingFee)}</strong>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleVNPayPayment(ord.orderId)}
                      disabled={payingOrderId === ord.orderId}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer self-start sm:self-auto"
                    >
                      {payingOrderId === ord.orderId ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <CreditCard className="w-3.5 h-3.5" />
                      )}
                      <span>Thanh toán VNPay</span>
                      <ExternalLink className="w-3 h-3 ml-0.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SECTION 2: VOUCHER CALCULATOR */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Ticket className="w-5 h-5 text-red-600" />
              Áp Dụng Voucher
            </h2>
          </div>

          <form onSubmit={handleVoucherSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Mã Voucher *</label>
              <input
                type="text"
                required
                value={voucherForm.voucherCode}
                onChange={(e) => setVoucherForm({ ...voucherForm, voucherCode: e.target.value })}
                placeholder="VD: VIETTEL50, FREESHIP"
                className="w-full px-3 py-2 text-sm uppercase tracking-wider font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Giá trị đơn hàng (VNĐ) *</label>
              <input
                type="number"
                min="0"
                required
                value={voucherForm.orderAmount}
                onChange={(e) => setVoucherForm({ ...voucherForm, orderAmount: e.target.value })}
                placeholder="100000"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={voucherSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition font-medium text-sm disabled:opacity-60 cursor-pointer shadow"
            >
              <Calculator className="w-4 h-4" />
              {voucherSubmitting ? 'Đang Tính Toán...' : 'Kiểm Tra & Tính Giảm Giá'}
            </button>
          </form>

          {/* Voucher Error */}
          {voucherError && (
            <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{voucherError}</span>
            </div>
          )}

          {/* Voucher Result Box */}
          {voucherResult && (
            <div className="mt-6 p-4 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs text-amber-800 font-semibold border-b border-amber-200/60 pb-2">
                <span>KẾT QUẢ ÁP DỤNG</span>
                <span className="bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded uppercase">
                  {voucherResult.code || voucherForm.voucherCode}
                </span>
              </div>

              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-gray-600 text-xs">
                  <span>Giá trị ban đầu:</span>
                  <span>{formatVND(voucherForm.orderAmount)}</span>
                </div>
                <div className="flex justify-between text-red-600 font-medium">
                  <span>Số tiền được giảm:</span>
                  <span>
                    -{' '}
                    {formatVND(
                      voucherResult.discountAmount ??
                        voucherResult.discount ??
                        voucherResult.discountValue ??
                        0
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-gray-900 font-bold text-base pt-2 border-t border-amber-200">
                  <span>Số tiền thanh toán:</span>
                  <span className="text-red-700">
                    {formatVND(
                      voucherResult.finalAmount ??
                        voucherResult.totalAfterDiscount ??
                        Math.max(
                          0,
                          (parseFloat(voucherForm.orderAmount) || 0) -
                            (voucherResult.discountAmount ??
                              voucherResult.discount ??
                              voucherResult.discountValue ??
                              0)
                        )
                    )}
                  </span>
                </div>
              </div>

              {voucherResult.message && (
                <p className="text-xs text-amber-900 italic pt-1">{voucherResult.message}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;
