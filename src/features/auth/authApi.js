import axiosInstance from '../../services/axiosInstance';

const AUTH_BASE = '/api/auth';

const authApi = {
  register: (data) => axiosInstance.post(`${AUTH_BASE}/register`, data),

  login: (data) => axiosInstance.post(`${AUTH_BASE}/login`, data),

  verifyOtp: (data) => axiosInstance.post(`${AUTH_BASE}/verify-otp`, data),

  resendOtp: (data) => axiosInstance.post(`${AUTH_BASE}/resend-otp`, data),

  logout: () => axiosInstance.post(`${AUTH_BASE}/logout`),

  refreshToken: (refreshToken) =>
    axiosInstance.post(`${AUTH_BASE}/refresh-token`, { refreshToken }),

  forgotPassword: (email) =>
    axiosInstance.post(`${AUTH_BASE}/forgot-password`, { email }),

  resetPassword: (data) =>
    axiosInstance.post(`${AUTH_BASE}/reset-password`, data),

  googleLogin: () => {
    window.location.href = `http://localhost:8080${AUTH_BASE}/oauth2/google`;
  },
};

export default authApi;
