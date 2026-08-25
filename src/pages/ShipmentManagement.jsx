import React, { useState, useEffect } from "react";
import {
  UserCheck,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Send,
  ArrowLeftRight,
  Image as ImageIcon,
  FileText,
  Users,
  Phone,
  Mail,
  Shield,
  Zap,
} from "lucide-react";
import {
  assignShipper,
  updateShipmentStatus,
  getShippers,
} from "../api/deliveryApi";

export const ShipmentManagement = () => {
  // Shippers List State
  const [shippers, setShippers] = useState([]);
  const [shippersLoading, setShippersLoading] = useState(false);

  // Form 1: Assign Shipper State
  const [assignForm, setAssignForm] = useState({
    orderId: "",
    shipperId: "",
    note: "",
  });
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignSuccess, setAssignSuccess] = useState(null);
  const [assignError, setAssignError] = useState(null);

  // Form 2: Update Shipment Status State
  const [statusForm, setStatusForm] = useState({
    orderId: "",
    status: "IN_TRANSIT",
    proofImageUrl: "",
    note: "",
  });
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusSuccess, setStatusSuccess] = useState(null);
  const [statusError, setStatusError] = useState(null);

  // Status Options
  const statusOptions = [
    { value: "ASSIGNED", label: "1. Đã phân công Shipper (ASSIGNED)" },
    { value: "PICKED_UP", label: "2. Shipper đã lấy hàng (PICKED_UP)" },
    { value: "IN_TRANSIT", label: "3. Đang vận chuyển / Đang giao (IN_TRANSIT)" },
    { value: "DELIVERED", label: "4. Giao hàng thành công (DELIVERED)" },
    { value: "PAID", label: "5. Đã thanh toán (PAID)" },
    { value: "CANCELLED", label: "6. Hủy đơn hàng (CANCELLED)" },
  ];

  // Fetch shippers on mount
  const fetchShippersList = async () => {
    setShippersLoading(true);
    try {
      const res = await getShippers();
      const list = res.data || res || [];
      setShippers(Array.isArray(list) ? list : []);
      if (Array.isArray(list) && list.length > 0 && !assignForm.shipperId) {
        setAssignForm((prev) => ({
          ...prev,
          shipperId: list[0].id.toString(),
        }));
      }
    } catch (e) {
      console.warn("Could not fetch shippers:", e);
    } finally {
      setShippersLoading(false);
    }
  };

  useEffect(() => {
    fetchShippersList();
  }, []);

  // Handle Assign Shipper Submit
  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    setAssignLoading(true);
    setAssignSuccess(null);
    setAssignError(null);

    try {
      const ordId = parseInt(assignForm.orderId, 10);
      const shipId = parseInt(assignForm.shipperId, 10);

      if (isNaN(ordId) || isNaN(shipId)) {
        throw new Error("ID đơn hàng và ID shipper phải là chữ số hợp lệ.");
      }

      const payload = {
        orderId: ordId,
        shipperId: shipId,
        note: assignForm.note.trim(),
      };

      const res = await assignShipper(payload);
      setAssignSuccess(res || { message: "Phân công Shipper thành công!" });
      setAssignForm((prev) => ({ ...prev, orderId: "", note: "" }));
    } catch (err) {
      console.error("Assign shipper error:", err);
      setAssignError(
        err.message ||
          "Phân công Shipper thất bại. Vui lòng kiểm tra lại ID đơn hàng (phải ở trạng thái CREATED)."
      );
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
      const ordId = parseInt(statusForm.orderId, 10);
      if (isNaN(ordId)) {
        throw new Error("ID đơn hàng phải là chữ số hợp lệ.");
      }

      const payload = {
        status: statusForm.status,
        proofImageUrl: statusForm.proofImageUrl.trim(),
        note: statusForm.note.trim(),
      };

      const res = await updateShipmentStatus(ordId, payload);
      setStatusSuccess(
        res || { message: "Cập nhật trạng thái vận đơn thành công!" }
      );
      setStatusForm((prev) => ({
        ...prev,
        orderId: "",
        proofImageUrl: "",
        note: "",
      }));
    } catch (err) {
      console.error("Update status error:", err);
      setStatusError(
        err.message || "Cập nhật trạng thái đơn hàng thất bại."
      );
    } finally {
      setStatusLoading(false);
    }
  };

  const quickAssignShipper = (shipperId) => {
    setAssignForm((prev) => ({ ...prev, shipperId: shipperId.toString() }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
          <ArrowLeftRight className="w-7 h-7 text-red-600 dark:text-red-500" />
          Điều Phối & Cập Nhật Vận Đơn
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400 mt-1">
          Gán Shipper phụ trách đơn hàng và cập nhật tiến trình lộ trình giao vận theo thời gian thực
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* FORM 1: ASSIGN SHIPPER */}
        <div className="rounded-3xl bg-white dark:bg-neutral-900/80 border border-slate-200 dark:border-white/10 p-6 sm:p-8 backdrop-blur-2xl shadow-sm dark:shadow-glass-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/10 mb-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-red-600 dark:text-red-500" />
                Phân Công Shipper
              </h2>
              <span className="text-xs font-semibold px-3 py-1 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30 rounded-full">
                Điều phối viên
              </span>
            </div>

            {assignSuccess && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-500/30 flex items-start gap-3 text-emerald-900 dark:text-emerald-200">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <p className="font-bold text-sm text-slate-900 dark:text-white">Phân công thành công!</p>
                  <p className="text-xs mt-0.5 text-emerald-700 dark:text-emerald-300">
                    {typeof assignSuccess === "string"
                      ? assignSuccess
                      : assignSuccess.message || "Đơn hàng đã được bàn giao cho Shipper."}
                  </p>
                </div>
              </div>
            )}

            {assignError && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-500/30 flex items-start gap-3 text-rose-800 dark:text-rose-200">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
                <div>
                  <p className="font-bold text-sm">Lỗi phân công Shipper</p>
                  <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5">{assignError}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleAssignSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1.5">
                  Mã Đơn Hàng (Order ID) *
                </label>
                <input
                  type="number"
                  required
                  value={assignForm.orderId}
                  onChange={(e) =>
                    setAssignForm({ ...assignForm, orderId: e.target.value })
                  }
                  placeholder="Nhập ID đơn hàng (Ví dụ: 1, 2, 3...)"
                  className="w-full text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1.5 flex items-center justify-between">
                  <span>Chọn Nhân Viên Shipper *</span>
                  <span className="text-[11px] text-slate-500 dark:text-neutral-400 font-normal">
                    {shippers.length} nhân viên khả dụng
                  </span>
                </label>
                {shippers.length > 0 ? (
                  <select
                    value={assignForm.shipperId}
                    onChange={(e) =>
                      setAssignForm({
                        ...assignForm,
                        shipperId: e.target.value,
                      })
                    }
                    className="w-full text-sm"
                  >
                    {shippers.map((s) => (
                      <option key={s.id} value={s.id} className="bg-white dark:bg-neutral-950 text-slate-900 dark:text-white">
                        {s.fullName} ({s.username}) - SĐT: {s.phoneNumber} [ID: #{s.id}]
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="number"
                    required
                    value={assignForm.shipperId}
                    onChange={(e) =>
                      setAssignForm({
                        ...assignForm,
                        shipperId: e.target.value,
                      })
                    }
                    placeholder="VD: 2 hoặc 3"
                    className="w-full text-sm"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1.5">
                  Ghi chú điều phối (Tùy chọn)
                </label>
                <textarea
                  rows="3"
                  value={assignForm.note}
                  onChange={(e) =>
                    setAssignForm({ ...assignForm, note: e.target.value })
                  }
                  placeholder="Giao gấp trong buổi sáng, gọi trước khi đến..."
                  className="w-full text-sm resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={assignLoading}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl hover:brightness-110 active:scale-[0.98] transition font-bold text-sm disabled:opacity-50 cursor-pointer shadow-glow-red"
              >
                <Send className={`w-4 h-4 ${assignLoading ? "animate-spin" : ""}`} />
                {assignLoading ? "Đang Gán Shipper..." : "Xác Nhận Phân Công"}
              </button>
            </form>
          </div>
        </div>

        {/* FORM 2: UPDATE STATUS */}
        <div className="rounded-3xl bg-white dark:bg-neutral-900/80 border border-slate-200 dark:border-white/10 p-6 sm:p-8 backdrop-blur-2xl shadow-sm dark:shadow-glass-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/10 mb-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-red-600 dark:text-red-500" />
                Cập Nhật Trạng Thái Đơn
              </h2>
              <span className="text-xs font-semibold px-3 py-1 bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30 rounded-full">
                Shipper / Vận hành
              </span>
            </div>

            {statusSuccess && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-500/30 flex items-start gap-3 text-emerald-900 dark:text-emerald-200">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <p className="font-bold text-sm text-slate-900 dark:text-white">Cập nhật thành công!</p>
                  <p className="text-xs mt-0.5 text-emerald-700 dark:text-emerald-300">
                    {typeof statusSuccess === "string"
                      ? statusSuccess
                      : statusSuccess.message || "Lộ trình đơn hàng đã được cập nhật."}
                  </p>
                </div>
              </div>
            )}

            {statusError && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-500/30 flex items-start gap-3 text-rose-800 dark:text-rose-200">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
                <div>
                  <p className="font-bold text-sm">Lỗi cập nhật trạng thái</p>
                  <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5">{statusError}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleStatusSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1.5">
                  Mã Đơn Hàng (Order ID) *
                </label>
                <input
                  type="number"
                  required
                  value={statusForm.orderId}
                  onChange={(e) =>
                    setStatusForm({ ...statusForm, orderId: e.target.value })
                  }
                  placeholder="Nhập ID đơn hàng (Ví dụ: 1, 2, 3...)"
                  className="w-full text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1.5">
                  Trạng thái mới *
                </label>
                <select
                  value={statusForm.status}
                  onChange={(e) =>
                    setStatusForm({ ...statusForm, status: e.target.value })
                  }
                  className="w-full text-sm"
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-white dark:bg-neutral-950 text-slate-900 dark:text-white">
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1.5 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-slate-400 dark:text-neutral-400" />
                  Đường dẫn ảnh bằng chứng giao nhận (Proof Image URL)
                </label>
                <input
                  type="url"
                  value={statusForm.proofImageUrl}
                  onChange={(e) =>
                    setStatusForm({
                      ...statusForm,
                      proofImageUrl: e.target.value,
                    })
                  }
                  placeholder="https://example.com/delivery-proof.jpg"
                  className="w-full text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-neutral-300 mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-400 dark:text-neutral-400" />
                  Ghi chú tiến trình
                </label>
                <textarea
                  rows="2"
                  value={statusForm.note}
                  onChange={(e) =>
                    setStatusForm({ ...statusForm, note: e.target.value })
                  }
                  placeholder="Người nhận đã ký nhận bưu kiện thành công..."
                  className="w-full text-sm resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={statusLoading}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-800 dark:text-white rounded-xl hover:brightness-110 active:scale-[0.98] transition font-bold text-sm disabled:opacity-50 cursor-pointer border border-slate-200 dark:border-white/10"
              >
                <RefreshCw
                  className={`w-4 h-4 ${statusLoading ? "animate-spin" : ""}`}
                />
                {statusLoading ? "Đang Lưu Trạng Thái..." : "Cập Nhật Trạng Thái"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* SECTION 3: SHIPPER TEAM LIST */}
      <div className="rounded-3xl bg-white dark:bg-neutral-900/80 border border-slate-200 dark:border-white/10 p-6 sm:p-8 backdrop-blur-2xl shadow-sm dark:shadow-glass-md">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/10 mb-6">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white">
            <Users className="w-5 h-5 text-red-600 dark:text-red-500" />
            <h2 className="text-lg font-bold">Đội Ngũ Nhân Viên Giao Hàng (Shipper)</h2>
          </div>
          <button
            onClick={fetchShippersList}
            disabled={shippersLoading}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 transition cursor-pointer"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${shippersLoading ? "animate-spin" : ""}`}
            />
            <span>Làm mới</span>
          </button>
        </div>

        {shippers.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 dark:text-neutral-500">
            {shippersLoading
              ? "Đang tải danh sách shipper..."
              : "Chưa có thông tin nhân viên shipper nào trong hệ thống."}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {shippers.map((s) => (
              <div
                key={s.id}
                className="p-5 rounded-2xl border border-slate-200/80 dark:border-white/5 bg-slate-50 dark:bg-white/[0.03] hover:bg-slate-100 dark:hover:bg-white/[0.06] hover:border-red-300 dark:hover:border-red-500/30 transition-all duration-300 space-y-3 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-tr from-red-600 to-rose-600 text-white font-black text-sm rounded-xl flex items-center justify-center shadow-glow-red">
                      {s.fullName ? s.fullName.charAt(0) : "S"}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                        {s.fullName}
                      </h3>
                      <span className="text-[11px] text-slate-500 dark:text-neutral-400 font-mono">
                        @{s.username} • ID: #{s.id}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                    {s.status || "Sẵn sàng"}
                  </span>
                </div>

                <div className="text-xs text-slate-600 dark:text-neutral-300 space-y-1.5 pt-2 border-t border-slate-200/60 dark:border-white/5">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 dark:text-neutral-500" />
                    <span>{s.phoneNumber || "Chưa cập nhật SĐT"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 dark:text-neutral-500" />
                    <span className="truncate">{s.email || "Chưa cập nhật Email"}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => quickAssignShipper(s.id)}
                  className="w-full mt-2 inline-flex items-center justify-center gap-1.5 text-xs font-bold py-2 px-3 bg-red-50 dark:bg-red-600/20 hover:bg-red-600 text-red-600 dark:text-red-300 hover:text-white border border-red-200 dark:border-red-500/30 rounded-xl transition cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Chọn Shipper này</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShipmentManagement;
