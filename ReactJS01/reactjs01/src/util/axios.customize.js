import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

// Add token to every request
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ⭐ ADD THIS — FIX RES FORMAT ⭐
instance.interceptors.response.use(
  (response) => {
    return response.data; // FE chỉ nhận data, không phải object
  },
  (error) => {
    return Promise.reject(error);
  }
);
console.log("BASE URL = ", import.meta.env.VITE_BACKEND_URL);

export default instance;
