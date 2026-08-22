import React, { useState } from 'react';
import { UserCheck, RefreshCw, CheckCircle2, AlertCircle, Send, ArrowLeftRight, Image as ImageIcon, FileText } from 'lucide-react';
import { assignShipper, updateShipmentStatus } from '../api/deliveryApi';

const ShipmentManagement = () => {
  // Form 1: Assign Shipper State
  const [assignForm, setAssignForm] = useState({
    orderId: '',
    shipperId: '',
    note: '',
  });
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignSuccess, setAssignSuccess] = useState(null);
  const [assignError, setAssignError] = useState(null);

  // Form 2: Update Shipment Status State
  const [statusForm, setStatusForm] = useState({
    orderId: '',
    status: 'DELIVERING',
    proofImageUrl: '',
    note: '',
  });
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusSuccess, setStatusSuccess] = useState(null);
  const [statusError, setStatusError] = useState(null);

  const statusOptions = [
    { value: 'PENDING', label: 'Chờ tiếp nhận (PENDING)' },
    { value: 'ASSIGNED', label: 'Đã phân công Shipper (ASSIGNED)' },
    { value: 'PICKED_UP', label: 'Đã lấy hàng (PICKED_UP)' },
    { value: 'DELIVERING', label: 'Đang giao hàng (DELIVERING)' },
    { value: 'DELIVERED', label: 'Giao hàng thành công (DELIVERED)' },
    { value: 'FAILED', label: 'Giao hàng thất bại (FAILED)' },
    { value: 'RETURNED', label: 'Đã hoàn trả hàng (RETURNED)' },
    { value: 'CANCELLED', label: 'Đã hủy đơn (CANCELLED)' },
  ];

  // Handle Assign Shipper Submit
  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    setAssignLoading(true);
    setAssignSuccess(null);
    setAssignError(null);

    try {
      const payload = {
        orderId: assignForm.orderId.trim(),
        shipperId: assignForm.shipperId.trim(),
        note: assignForm.note.trim(),
      };

      const res = await assignShipper(payload);
      setAssignSuccess(res || { message: 'Phân công Shipper thành công!' });
      setAssignForm({ orderId: '', shipperId: '', note: '' });
    } catch (err) {
      console.error('Assign shipper error:', err);
      setAssignError(err.message || 'Phân công Shipper thất bại. Vui lòng kiểm tra lại ID.');
    } finally {
      setAssignLoading(false);
    }
  };

  // Handle Update Status Submit
  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    setStatusLoading(true);
    setStatusSuccess(null);
    setStatusError(null);

    try {
      const orderId = statusForm.orderId.trim();
      const payload = {
        status: statusForm.status,
        proofImageUrl: statusForm.proofImageUrl.trim(),
        note: statusForm.note.trim(),
      };

      const res = await updateShipmentStatus(orderId, payload);
      setStatusSuccess(res || { message: 'Cập nhật trạng thái vận đơn thành công!' });
      setStatusForm({
        orderId: '',
        status: 'DELIVERING',
        proofImageUrl: '',
        note: '',
      });
    } catch (err) {
      console.error('Update status error:', err);
      setStatusError(err.message || 'Cập nhật trạng thái đơn hàng thất bại.');
    } finally {
      setStatusLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
          <ArrowLeftRight className="w-7 h-7 text-red-600" />
          Điều Phối & Cập Nhật Vận Đơn
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Gán Shipper phụ trách đơn hàng và cập nhật tiến trình lộ trình giao vận theo thời gian thực
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* FORM 1: ASSIGN SHIPPER */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-red-600" />
                Phân Công Shipper
              </h2>
              <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full">
                Điều phối viên
              </span>
            </div>

            {assignSuccess && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-3 text-emerald-800">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-emerald-600" />
                <div>
                  <p className="font-semibold">Phân công thành công!</p>
                  <p className="text-xs mt-0.5">
                    {typeof assignSuccess === 'string'
                      ? assignSuccess
                      : assignSuccess.message || 'Đơn hàng đã được bàn giao cho Shipper.'}
                  </p>
                </div>
              </div>
            )}

            {assignError && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-3 text-rose-800">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-600" />
                <div>
                  <p className="font-semibold">Lỗi phân công Shipper</p>
                  <p className="text-xs mt-0.5">{assignError}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleAssignSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Mã Đơn Hàng (Order ID) *
                </label>
                <input
                  type="text"
                  required
                  value={assignForm.orderId}
                  onChange={(e) => setAssignForm({ ...assignForm, orderId: e.target.value })}
                  placeholder="VD: ORD-1001 hoặc 1"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Mã Nhân Viên Shipper (Shipper ID) *
                </label>
                <input
                  type="text"
                  required
                  value={assignForm.shipperId}
                  onChange={(e) => setAssignForm({ ...assignForm, shipperId: e.target.value })}
                  placeholder="VD: SHIP-88 hoặc 10"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Ghi chú điều phối (Tùy chọn)
                </label>
                <textarea
                  rows="3"
                  value={assignForm.note}
                  onChange={(e) => setAssignForm({ ...assignForm, note: e.target.value })}
                  placeholder="Giao gấp trong buổi sáng, gọi trước khi đến..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={assignLoading}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 active:bg-red-800 transition font-semibold text-sm disabled:opacity-60 cursor-pointer shadow-sm"
              >
                <Send className={`w-4 h-4 ${assignLoading ? 'animate-spin' : ''}`} />
                {assignLoading ? 'Đang Gán Shipper...' : 'Xác Nhận Phân Công'}
              </button>
            </form>
          </div>
        </div>

        {/* FORM 2: UPDATE STATUS */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-red-600" />
                Cập Nhật Trạng Thái Đơn
              </h2>
              <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-700 rounded-full">
                Shipper / Vận hành
              </span>
            </div>

            {statusSuccess && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start gap-3 text-emerald-800">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-emerald-600" />
                <div>
                  <p className="font-semibold">Cập nhật trạng thái thành công!</p>
                  <p className="text-xs mt-0.5">
                    {typeof statusSuccess === 'string'
                      ? statusSuccess
                      : statusSuccess.message || 'Lộ trình đơn hàng đã được cập nhật.'}
                  </p>
                </div>
              </div>
            )}

            {statusError && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-3 text-rose-800">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-600" />
                <div>
                  <p className="font-semibold">Lỗi cập nhật trạng thái</p>
                  <p className="text-xs mt-0.5">{statusError}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleStatusSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Mã Đơn Hàng (Order ID) *
                </label>
                <input
                  type="text"
                  required
                  value={statusForm.orderId}
                  onChange={(e) => setStatusForm({ ...statusForm, orderId: e.target.value })}
                  placeholder="VD: ORD-1001 hoặc 1"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Trạng thái mới *
                </label>
                <select
                  value={statusForm.status}
                  onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-white font-medium"
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5" />
                  Đường dẫn ảnh bằng chứng giao nhận (Proof Image URL)
                </label>
                <input
                  type="url"
                  value={statusForm.proofImageUrl}
                  onChange={(e) => setStatusForm({ ...statusForm, proofImageUrl: e.target.value })}
                  placeholder="https://example.com/delivery-proof.jpg"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5" />
                  Ghi chú tiến trình
                </label>
                <textarea
                  rows="2"
                  value={statusForm.note}
                  onChange={(e) => setStatusForm({ ...statusForm, note: e.target.value })}
                  placeholder="Người nhận đã ký nhận bưu kiện thành công..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={statusLoading}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 active:bg-black transition font-semibold text-sm disabled:opacity-60 cursor-pointer shadow-sm"
              >
                <RefreshCw className={`w-4 h-4 ${statusLoading ? 'animate-spin' : ''}`} />
                {statusLoading ? 'Đang Lưu Trạng Thái...' : 'Cập Nhật Trạng Thái'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentManagement;
