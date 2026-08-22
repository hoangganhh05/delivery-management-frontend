import React, { useState } from 'react';
import { Search, MapPin, Package, Clock, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, User, Phone, Image as ImageIcon } from 'lucide-react';
import { trackOrder } from '../api/deliveryApi';

const Tracking = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
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
      // Support unwrapped object or { data: {...} }
      const data = res?.data || res;
      if (!data || (typeof data === 'object' && Object.keys(data).length === 0)) {
        setError('Không tìm thấy thông tin vận đơn với mã tra cứu này.');
      } else {
        setResult(data);
      }
    } catch (err) {
      console.error('Tracking error:', err);
      setError(err.message || 'Không tìm thấy bưu gửi hoặc mã vận đơn chưa chính xác.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const s = String(status || '').toUpperCase();
    switch (s) {
      case 'DELIVERED':
        return { label: 'Giao hàng thành công', bg: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
      case 'DELIVERING':
        return { label: 'Đang giao hàng', bg: 'bg-blue-100 text-blue-800 border-blue-300' };
      case 'PICKED_UP':
        return { label: 'Đã lấy hàng', bg: 'bg-purple-100 text-purple-800 border-purple-300' };
      case 'ASSIGNED':
        return { label: 'Đã phân công Shipper', bg: 'bg-amber-100 text-amber-800 border-amber-300' };
      case 'PENDING':
        return { label: 'Chờ tiếp nhận', bg: 'bg-gray-100 text-gray-800 border-gray-300' };
      case 'RETURNED':
      case 'FAILED':
      case 'CANCELLED':
        return { label: 'Đã hủy / Thất bại', bg: 'bg-rose-100 text-rose-800 border-rose-300' };
      default:
        return { label: s || 'Đang xử lý', bg: 'bg-red-100 text-red-800 border-red-300' };
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val || 0);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? dateStr : d.toLocaleString('vi-VN');
    } catch {
      return dateStr;
    }
  };

  // Build timeline items from response
  const historyList = Array.isArray(result?.history || result?.logs || result?.shipmentLogs || result?.timeline)
    ? (result?.history || result?.logs || result?.shipmentLogs || result?.timeline)
    : [];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 text-white shadow-md text-center">
        <div className="inline-flex p-3 bg-white/10 backdrop-blur-md rounded-2xl mb-3">
          <MapPin className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Tra Cứu Hành Trình Đơn Hàng
        </h1>
        <p className="text-red-100 text-sm mt-2 max-w-xl mx-auto font-light">
          Nhập mã vận đơn (Tracking Number / Order ID) để theo dõi trạng thái lộ trình bưu gửi Viettel Post thời gian thực
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mt-6 max-w-xl mx-auto flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              required
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Nhập mã vận đơn (VD: ORD-1001, VTP123456)..."
              className="w-full pl-10 pr-4 py-3.5 text-gray-900 bg-white rounded-xl shadow-lg border-0 focus:ring-4 focus:ring-red-400/40 text-sm font-medium outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3.5 bg-gray-900 text-white font-bold text-sm rounded-xl hover:bg-black transition shadow-lg disabled:opacity-70 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Tra Cứu</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-800 shadow-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-600" />
          <div>
            <p className="font-semibold text-rose-900">Tra cứu không thành công</p>
            <p className="text-sm mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Tracking Result View */}
      {result && (
        <div className="space-y-6">
          {/* Main Info Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-100 gap-4">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">MÃ VẬN ĐƠN</span>
                <span className="text-2xl font-extrabold text-gray-900 font-mono">
                  {result.trackingNumber || result.orderId || result.id || trackingNumber}
                </span>
              </div>
              <div>
                {(() => {
                  const badge = getStatusBadge(result.status || result.shipmentStatus);
                  return (
                    <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold border ${badge.bg}`}>
                      <span className="w-2 h-2 rounded-full bg-current"></span>
                      {badge.label}
                    </span>
                  );
                })()}
              </div>
            </div>

            {/* Sender & Receiver Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/70 space-y-2">
                <p className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1 text-red-600">
                  <User className="w-3.5 h-3.5" /> Thông Tin Người Gửi
                </p>
                <p className="text-sm font-semibold text-gray-800">
                  {result.senderName || result.sender?.name || 'N/A'}
                </p>
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-gray-400" />
                  {result.senderPhone || result.sender?.phone || 'N/A'}
                </p>
                <p className="text-xs text-gray-600 flex items-start gap-1">
                  <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span>{result.senderAddress || result.sender?.address || 'N/A'}</span>
                </p>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/70 space-y-2">
                <p className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1 text-red-600">
                  <User className="w-3.5 h-3.5" /> Thông Tin Người Nhận
                </p>
                <p className="text-sm font-semibold text-gray-800">
                  {result.receiverName || result.receiver?.name || 'N/A'}
                </p>
                <p className="text-xs text-gray-600 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-gray-400" />
                  {result.receiverPhone || result.receiver?.phone || 'N/A'}
                </p>
                <p className="text-xs text-gray-600 flex items-start gap-1">
                  <MapPin className="w-3 h-3 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span>{result.receiverAddress || result.receiver?.address || 'N/A'}</span>
                </p>
              </div>
            </div>

            {/* Financial & Weight Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100 text-center">
              <div>
                <p className="text-xs text-gray-500">Khối lượng</p>
                <p className="text-sm font-bold text-gray-900 mt-1">{result.weight ? `${result.weight} kg` : '0.5 kg'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Cước vận chuyển</p>
                <p className="text-sm font-bold text-red-600 mt-1">{formatCurrency(result.shippingFee)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Thu hộ COD</p>
                <p className="text-sm font-bold text-gray-900 mt-1">{formatCurrency(result.codAmount)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Shipper phụ trách</p>
                <p className="text-sm font-bold text-blue-600 mt-1">{result.shipperId || result.shipperName || 'Chưa điều phối'}</p>
              </div>
            </div>
          </div>

          {/* Timeline Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-red-600" />
              Lịch Sử Lộ Trình Giao Hàng
            </h2>

            {historyList.length > 0 ? (
              <div className="relative pl-6 border-l-2 border-red-200 space-y-8 ml-3">
                {historyList.map((step, idx) => (
                  <div key={idx} className="relative group">
                    {/* Circle marker */}
                    <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-red-600 ring-4 ring-red-100 group-hover:scale-110 transition"></div>
                    <div className="space-y-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <span className="text-sm font-bold text-gray-900">
                          {step.status || step.action || 'Cập nhật trạng thái'}
                        </span>
                        <span className="text-xs text-gray-400 font-mono">
                          {formatDate(step.timestamp || step.createdAt || step.time)}
                        </span>
                      </div>
                      {step.note && <p className="text-xs text-gray-600">{step.note}</p>}
                      {step.location && (
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-red-500" /> {step.location}
                        </p>
                      )}
                      {step.proofImageUrl && (
                        <div className="mt-2">
                          <a
                            href={step.proofImageUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:underline bg-blue-50 px-2.5 py-1 rounded-md"
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
              /* Fallback Stepper Timeline when backend returns single object */
              <div className="relative pl-6 border-l-2 border-red-200 space-y-6 ml-3">
                <div className="relative">
                  <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-red-600 ring-4 ring-red-100"></div>
                  <p className="text-sm font-bold text-gray-900">
                    Trạng thái hiện tại: {result.status || 'Đang xử lý'}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Cập nhật gần nhất: {formatDate(result.updatedAt || result.createdAt || new Date())}
                  </p>
                  {result.note && <p className="text-xs text-gray-700 mt-1">{result.note}</p>}
                  {result.proofImageUrl && (
                    <div className="mt-2">
                      <a
                        href={result.proofImageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:underline bg-blue-50 px-2.5 py-1 rounded-md"
                      >
                        <ImageIcon className="w-3.5 h-3.5" /> Xem ảnh xác nhận
                      </a>
                    </div>
                  )}
                </div>

                <div className="relative opacity-70">
                  <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-gray-400 ring-4 ring-gray-100"></div>
                  <p className="text-sm font-medium text-gray-800">Khởi tạo đơn hàng thành công</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Thời gian: {formatDate(result.createdAt || new Date())}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Tracking;
