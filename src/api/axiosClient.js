import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/v1";

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: Attach JWT token if available
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor: Unwrap data & handle error responses (400, 401, etc.)
axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const status = error.response ? error.response.status : null;
    const resData = error.response?.data;

    // Handle 401 Unauthorized: Clear localStorage & redirect to /login
    if (status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("role");

      // Dispatch custom event for reactive UI update
      window.dispatchEvent(new Event("auth:unauthorized"));

      // If needed, redirect using window.location if not already at login
      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/login" &&
        !window.location.hash.includes("login")
      ) {
        // App handles view via activeTab state listening to 'auth:unauthorized'
      }
    }

    // Extract validation / field errors and error message
    let errorMessage = "";
    let fieldErrors = null;

    if (resData) {
      // If data is a validation map like { username: "...", password: "..." }
      if (
        resData.data &&
        typeof resData.data === "object" &&
        !Array.isArray(resData.data)
      ) {
        fieldErrors = resData.data;
        const messages = Object.values(resData.data).filter(Boolean);
        if (messages.length > 0) {
          errorMessage = messages.join(", ");
        }
      } else if (resData.errors && typeof resData.errors === "object") {
        if (Array.isArray(resData.errors)) {
          errorMessage = resData.errors
            .map((item) =>
              typeof item === "string"
                ? item
                : item.message || item.defaultMessage || JSON.stringify(item),
            )
            .join(", ");
        } else {
          fieldErrors = resData.errors;
          errorMessage = Object.values(resData.errors)
            .filter(Boolean)
            .join(", ");
        }
      }

      // If no field messages extracted or resData.message is informative
      if (!errorMessage) {
        if (resData.message && resData.message !== "INVALID_INPUT") {
          errorMessage = resData.message;
        } else if (resData.error) {
          errorMessage = resData.error;
        }
      }
    }

    if (!errorMessage) {
      if (status === 400 && resData?.code === "INVALID_INPUT") {
        errorMessage =
          "Dữ liệu đầu vào không hợp lệ. Vui lòng kiểm tra lại thông tin.";
      } else {
        errorMessage = error.message || "Đã có lỗi xảy ra khi kết nối máy chủ";
      }
    }

    const customError = new Error(errorMessage);
    customError.response = error.response;
    customError.status = status;
    customError.code = resData?.code || error.code;
    customError.fieldErrors =
      fieldErrors ||
      (resData?.data &&
      typeof resData.data === "object" &&
      !Array.isArray(resData.data)
        ? resData.data
        : null);
    customError.data = resData?.data;

    return Promise.reject(customError);
  },
);

export default axiosClient;
