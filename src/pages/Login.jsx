import React, { useState } from "react";
import {
  Truck,
  Lock,
  User,
  Mail,
  Phone,
  Shield,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";
import { login, register } from "../api/deliveryApi";
import { BorderBeam } from "../components/magicui/BorderBeam";

export const Login = ({ onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    role: "CUSTOMER",
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (
      fieldErrors[name] ||
      (name === "phone" && (fieldErrors.phone || fieldErrors.phoneNumber))
    ) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        if (name === "phone") {
          delete next.phoneNumber;
          delete next.phone;
        }
        return next;
      });
    }
  };

  const handleTabSwitch = (toRegister) => {
    setIsRegister(toRegister);
    setError(null);
    setFieldErrors({});
    setSuccessMsg(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFieldErrors({});
    setSuccessMsg(null);

    try {
      if (isRegister) {
        const registerPayload = {
          username: formData.username.trim(),
          email: formData.email.trim(),
          password: formData.password,
          role: formData.role,
          phone: formData.phone.trim(),
        };

        await register(registerPayload);
        setSuccessMsg(
          "Đăng ký tài khoản thành công! Hãy chuyển sang Đăng nhập để tiếp tục."
        );
        setIsRegister(false);
      } else {
        const loginPayload = {
          username: formData.username.trim(),
          password: formData.password,
        };

        const res = await login(loginPayload);
        const token =
          res.token ||
          res.accessToken ||
          res.data?.token ||
          res.data?.accessToken ||
          res.jwt;
        const username =
          res.username || res.data?.username || formData.username;
        const role =
          res.role ||
          res.roles?.[0] ||
          res.data?.role ||
          res.data?.roles?.[0] ||
          "CUSTOMER";

        if (token) {
          localStorage.setItem("token", token);
          localStorage.setItem("username", username);
          localStorage.setItem("role", role);

          if (onLoginSuccess) {
            onLoginSuccess({ token, username, role });
          }
        } else {
          localStorage.setItem(
            "token",
            typeof res === "string" ? res : "dummy_token"
          );
          localStorage.setItem("username", username);
          localStorage.setItem("role", role);

          if (onLoginSuccess) {
            onLoginSuccess({ token: "dummy_token", username, role });
          }
        }
      }
    } catch (err) {
      console.error("Auth error:", err);
      if (err.fieldErrors && typeof err.fieldErrors === "object") {
        setFieldErrors(err.fieldErrors);
      }
      setError(
        err.message ||
          (isRegister
            ? "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin."
            : "Đăng nhập thất bại. Sai tài khoản hoặc mật khẩu.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[75vh] px-4 py-8">
      <div className="relative w-full max-w-md bg-neutral-900/90 rounded-3xl border border-white/10 overflow-hidden backdrop-blur-3xl shadow-glass-md">
        <BorderBeam size={220} duration={9} delay={2} colorFrom="#ee0033" colorTo="#d4af37" />

        {/* Header Banner */}
        <div className="bg-gradient-to-r from-red-600 to-rose-700 px-8 py-8 text-white text-center relative overflow-hidden">
          <div className="inline-flex items-center justify-center p-3.5 bg-black/20 backdrop-blur-md rounded-2xl mb-3 shadow-inner">
            <Truck className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-black tracking-tight">Viettel Delivery</h2>
          <p className="text-red-100 text-xs mt-1 font-light tracking-wide">
            {isRegister
              ? "Đăng ký tài khoản hệ thống mới"
              : "Đăng nhập hệ thống điều phối logistics"}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-white/10 bg-black/40 p-1.5">
          <button
            type="button"
            onClick={() => handleTabSwitch(false)}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              !isRegister
                ? "bg-red-600 text-white shadow-glow-red"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Đăng Nhập
          </button>
          <button
            type="button"
            onClick={() => handleTabSwitch(true)}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              isRegister
                ? "bg-red-600 text-white shadow-glow-red"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Đăng Ký
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {/* Success message */}
          {successMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-start gap-2 text-xs text-emerald-200">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-950/50 border border-rose-500/30 flex items-start gap-2 text-xs text-rose-200">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username field */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Tên đăng nhập (Username) *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="admin, shipper1, customer_hoang"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-neutral-950/80 border border-white/10 text-white placeholder-neutral-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 text-sm outline-none"
                />
              </div>
              {(fieldErrors.username || fieldErrors.userName) && (
                <p className="mt-1 text-xs text-rose-400 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  {fieldErrors.username || fieldErrors.userName}
                </p>
              )}
            </div>

            {/* Email field (only for register) */}
            {isRegister && (
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Địa chỉ Email *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="user@viettelpost.com.vn"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-neutral-950/80 border border-white/10 text-white placeholder-neutral-500 focus:border-red-500 text-sm outline-none"
                  />
                </div>
                {fieldErrors.email && (
                  <p className="mt-1 text-xs text-rose-400 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    {fieldErrors.email}
                  </p>
                )}
              </div>
            )}

            {/* Phone field (only for register) */}
            {isRegister && (
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Số điện thoại (Phone)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="0988123456"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-neutral-950/80 border border-white/10 text-white placeholder-neutral-500 focus:border-red-500 text-sm outline-none"
                  />
                </div>
                {(fieldErrors.phone || fieldErrors.phoneNumber) && (
                  <p className="mt-1 text-xs text-rose-400 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    {fieldErrors.phone || fieldErrors.phoneNumber}
                  </p>
                )}
              </div>
            )}

            {/* Password field */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Mật khẩu (Password) *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-neutral-950/80 border border-white/10 text-white placeholder-neutral-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 text-sm outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-white cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="mt-1 text-xs text-rose-400 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {/* Role selector (for register) */}
            {isRegister && (
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Vai trò (Role) *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
                    <Shield className="w-4 h-4" />
                  </div>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-neutral-950 border border-white/10 text-white font-medium text-sm outline-none focus:border-red-500"
                  >
                    <option value="CUSTOMER" className="bg-neutral-950 text-white">Khách Hàng (CUSTOMER)</option>
                    <option value="SHIPPER" className="bg-neutral-950 text-white">Nhân Viên Giao Hàng (SHIPPER)</option>
                    <option value="ADMIN" className="bg-neutral-950 text-white">Quản Trị Viên (ADMIN)</option>
                  </select>
                </div>
                {fieldErrors.role && (
                  <p className="mt-1 text-xs text-rose-400 font-medium flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    {fieldErrors.role}
                  </p>
                )}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white rounded-xl font-bold text-sm hover:brightness-110 active:scale-[0.98] transition shadow-glow-red disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isRegister ? "Tạo Tài Khoản Mới" : "Đăng Nhập Ngay"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch Prompt */}
          <div className="mt-6 text-center text-xs text-neutral-400">
            {isRegister ? (
              <p>
                Đã có tài khoản?{" "}
                <button
                  type="button"
                  onClick={() => handleTabSwitch(false)}
                  className="font-bold text-red-400 hover:text-red-300 underline cursor-pointer"
                >
                  Đăng nhập ngay
                </button>
              </p>
            ) : (
              <p>
                Chưa có tài khoản?{" "}
                <button
                  type="button"
                  onClick={() => handleTabSwitch(true)}
                  className="font-bold text-red-400 hover:text-red-300 underline cursor-pointer"
                >
                  Đăng ký tài khoản
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
