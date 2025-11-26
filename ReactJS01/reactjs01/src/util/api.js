import axios from "./axios.customize";

export const createUserAPI = (name, email, password) => {
  return axios.post("/api/register", {
    name,
    email,
    password,
  });
};

export const loginAPI = (email, password) => {
  return axios.post("/api/login", {
    email,
    password,
  });
};

export const getAccountAPI = () => {
  return axios.get("/api/account");
};

export const getUserAPI = () => {
  return axios.get("/api/user");
};

export const forgotPasswordAPI = (email) => {
  return axios.post("/api/forgot-password", { email });
};

export const resetPasswordAPI = (email, otp, newPassword) => {
  return axios.post("/api/reset-password", {
    email,
    otp,
    newPassword,
  });
};

export const fetchProductSearch = (params) => {
  return axios.get("/api/products", { params });
};
