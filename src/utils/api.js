import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const cartId = localStorage.getItem("eatwella_cart_id");
  if (cartId) {
    config.headers["X-Cart-ID"] = cartId;
  }

  return config;
});

export default api;
