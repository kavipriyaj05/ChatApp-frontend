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
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
    window.location.href = `${baseUrl}/oauth2/authorization/google`;
  },
};

export default authApi;
