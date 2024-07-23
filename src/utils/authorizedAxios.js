import axios from "axios";
import { showToast } from "../helpers/Toastify";
import API_ROOT from "../constants/api";

// Khởi tạo axios instance để custom và cấu hình chung cho dự án
let authorizedAxiosInstance = axios.create();

// Thời gian chờ tối đa của 1 request: để 10 phút
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10;

// withCredentials: cho phép axios tự động đính kèm và gửi cookie trong mỗi request lên BE
authorizedAxiosInstance.defaults.withCredentials = true;

// Can thiệp vào giữa những cái request API
authorizedAxiosInstance.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    config.headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
    config.headers["Pragma"] = "no-cache";
    config.headers["Expires"] = "0";
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Khởi tạo một cái promise cho việc gọi api refresh token
// Mục đích tạo promise này để khi nhận yêu cầu refresh token đầu tiên thì nó sẽ hold lại việc goi api refresh token cho tới khi xong xuôi thì mới retry lại những api bị lỗi trước đó thay vì gọi lại liên tục refresh token nhiều lần
let refreshTokenPromise = null;

// Can thiệp vào giữa những cái response nhận về từ API
authorizedAxiosInstance.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  async (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    const originalRequest = error.config; // lấy ra request ban đầu

    // Xử lý refreshToken tự động
    // Nếu mã lỗi là 401 thì logout luôn
    if (error.response?.status === 401) {
      await authorizedAxiosInstance.delete(`${API_ROOT}/auth/logout`);
      localStorage.removeItem("isLogin");
      // window.location.href = "/login";
    }

    // Nếu mã lỗi là 410 thì tự động refresh token
    if (error.response?.status === 410 && originalRequest) {
      // Gán thêm _retry = true trong khoảng thời gian chờ, để việc refresh token chỉ thực hiện 1 lần
      // originalRequest._retry = true;

      if (!refreshTokenPromise) {
        refreshTokenPromise = authorizedAxiosInstance
          .put(`${API_ROOT}/user/refresh_token`)
          .then((response) => {
            return response;
          })
          .catch((error) => {
            authorizedAxiosInstance.delete(`${API_ROOT}/auth/logout`);
            localStorage.removeItem("isLogin");
            // window.location.href = "/login";
            return Promise.reject(error);
          })
          .finally(() => {
            // Dù API refresh token thành công hay thất bại thì cũng phải set lại refreshTokenPromise = null để cho lần refresh token tiếp theo
            refreshTokenPromise = null;
          });
      }

      // Chờ refresh token hoàn thành và retry lại request ban đầu
      await refreshTokenPromise;
      return authorizedAxiosInstance(originalRequest);
    }

    // Để khác 410 bởi vì mã 410 phục vụ việc tự động refresh lại token
    if (error.response?.status !== 410 && error.response?.status !== 500) {
      showToast("error", error.response?.data?.message || error?.message);
    }
    return Promise.reject(error);
  }
);

export default authorizedAxiosInstance;
