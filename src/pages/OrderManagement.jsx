import React, { useState } from 'react';
import { PackagePlus, Ticket, Plus, Trash2, CheckCircle2, AlertCircle, Send, Calculator, ArrowRight } from 'lucide-react';
import { createOrder, calculateVoucher } from '../api/deliveryApi';

const OrderManagement = () => {
  // Order Form State
  const [orderForm, setOrderForm] = useState({
    senderName: '',
    senderPhone: '',
    senderAddress: '',
    receiverName: '',
    receiverPhone: '',
    receiverAddress: '',
    weight: '',
    shippingFee: '',
    codAmount: '0',
    items: [{ itemName: '', quantity: 1, price: '' }],
  });

  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [orderError, setOrderError] = useState(null);

  // Voucher Form State
  const [voucherForm, setVoucherForm] = useState({
    voucherCode: '',
    orderAmount: '',
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
      items: [...prev.items, { itemName: '', quantity: 1, price: '' }],
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

    try {
      const payload = {
        sender: {
          name: orderForm.senderName,
          phone: orderForm.senderPhone,
          address: orderForm.senderAddress,
        },
        receiver: {
          name: orderForm.receiverName,
          phone: orderForm.receiverPhone,
          address: orderForm.receiverAddress,
        },
        senderName: orderForm.senderName,
        senderPhone: orderForm.senderPhone,
        senderAddress: orderForm.senderAddress,
        receiverName: orderForm.receiverName,
        receiverPhone: orderForm.receiverPhone,
        receiverAddress: orderForm.receiverAddress,
        weight: parseFloat(orderForm.weight) || 0,
        shippingFee: parseFloat(orderForm.shippingFee) || 0,
        codAmount: parseFloat(orderForm.codAmount) || 0,
        items: orderForm.items.map((item) => ({
          itemName: item.itemName,
          quantity: parseInt(item.quantity, 10) || 1,
          price: parseFloat(item.price) || 0,
        })),
      };

      const res = await createOrder(payload);
      setOrderResult(res);
      // Reset form on success
      setOrderForm({
        senderName: '',
        senderPhone: '',
        senderAddress: '',
        receiverName: '',
        receiverPhone: '',
        receiverAddress: '',
        weight: '',
        shippingFee: '',
        codAmount: '0',
        items: [{ itemName: '', quantity: 1, price: '' }],
      });
    } catch (err) {
      console.error('Create order error:', err);
      setOrderError(err.message || 'Tạo đơn hàng thất bại. Vui lòng kiểm tra lại dữ liệu.');
    } finally {
      setOrderSubmitting(false);
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
          Khởi tạo vận đơn mới, nhập thông tin bưu kiện và tính toán ưu đãi mã giảm giá
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* SECTION 1: CREATE ORDER FORM (2 Cols on lg) */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
              <span className="w-2.5 h-6 bg-red-600 rounded-full inline-block"></span>
              Tạo Vận Đơn Mới
            </h2>
            <span className="text-xs font-semibold px-2.5 py-1 bg-red-50 text-red-600 rounded-full">
              Bắt buộc nhập đủ
            </span>
          </div>

          {orderResult && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-3 text-emerald-800">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-emerald-600" />
              <div>
                <p className="font-semibold text-emerald-900">Tạo đơn hàng thành công!</p>
                <p className="text-sm mt-1">
                  Mã đơn hàng:{' '}
                  <span className="font-mono font-bold bg-emerald-100 px-2 py-0.5 rounded">
                    {orderResult.orderId || orderResult.id || JSON.stringify(orderResult.data?.id || orderResult.data?.orderId || 'Đã lưu')}
                  </span>
                </p>
              </div>
            </div>
          )}

          {orderError && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-3 text-rose-800">
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
                  <div key={index} className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3 rounded-lg border border-gray-200">
                    <div className="w-full sm:flex-1">
                      <input
                        type="text"
                        placeholder="Tên hàng hóa (ví dụ: Quần áo, Điện thoại)"
                        required
                        value={item.itemName}
                        onChange={(e) => handleItemChange(index, 'itemName', e.target.value)}
                        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 outline-none"
                      />
                    </div>
                    <div className="w-full sm:w-28">
                      <input
                        type="number"
                        min="1"
                        placeholder="SL"
                        required
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 outline-none"
                      />
                    </div>
                    <div className="w-full sm:w-36">
                      <input
                        type="number"
                        min="0"
                        placeholder="Giá trị (VNĐ)"
                        value={item.price}
                        onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 outline-none"
                      />
                    </div>
                    {orderForm.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition"
                        title="Xóa hàng này"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={orderSubmitting}
                className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 active:bg-red-800 transition font-bold shadow-md disabled:opacity-60 cursor-pointer"
              >
                <Send className={`w-4 h-4 ${orderSubmitting ? 'animate-bounce' : ''}`} />
                {orderSubmitting ? 'Đang Tạo Vận Đơn...' : 'Xác Nhận Tạo Đơn'}
              </button>
            </div>
          </form>
        </div>

        {/* SECTION 2: VOUCHER CALCULATOR (1 Col on lg) */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
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
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition font-medium text-sm disabled:opacity-60 cursor-pointer shadow"
            >
              <Calculator className="w-4 h-4" />
              {voucherSubmitting ? 'Đang Tính Toán...' : 'Kiểm Tra & Tính Giảm Giá'}
            </button>
          </form>

          {/* Voucher Error */}
          {voucherError && (
            <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2 text-xs text-rose-700">
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
