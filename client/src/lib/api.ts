import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // same as your API_URL
});

// Optional: interceptors for logging or auth tokens
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  },
);

export default api;
