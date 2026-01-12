// src/services/api.js
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(
      `Making ${config.method?.toUpperCase()} request to ${config.url}`
    );
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("Response error:", error);

    if (error.response?.status === 429) {
      throw new Error("Too many requests. Please try again later.");
    } else if (error.response?.status >= 500) {
      throw new Error("Server error. Please try again later.");
    } else if (error.code === "ECONNABORTED") {
      throw new Error("Request timeout. Please check your connection.");
    }

    return Promise.reject(error);
  }
);

export const healthAPI = {
  // Analyze symptoms with text
  analyzeSymptoms: async (symptoms) => {
    try {
      const response = await api.post("/analyze", { symptoms });
      return response.data;
    } catch (error) {
      throw new Error(error.message || "Failed to analyze symptoms");
    }
  },

  // Analyze symptoms with file
  analyzeFile: async (file, symptoms = "") => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (symptoms.trim()) {
        formData.append("symptoms", symptoms);
      }

      const response = await api.post("/analyze-file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.message || "Failed to analyze file");
    }
  },

  // Get address from coordinates
  getAddress: async (lat, lng) => {
    try {
      const response = await api.post("/get-address", { lat, lng });
      return response.data;
    } catch (error) {
      throw new Error(error.message || "Failed to get address");
    }
  },

  // Find nearby hospitals
  findNearbyHospitals: async (lat, lng, hospitalType = "", radius = 15) => {
    try {
      const response = await api.post("/nearby-hospitals", {
        lat,
        lng,
        hospitalType,
        radius,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.message || "Failed to find nearby hospitals");
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await api.get("/health");
      return response.data;
    } catch (error) {
      throw new Error(error.message || "Health check failed");
    }
  },
};

export default api;
