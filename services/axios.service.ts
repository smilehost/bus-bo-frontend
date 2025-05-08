import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const CONTEXT_PATH = process.env.NEXT_PUBLIC_CONTEXT_PATH || "/bu";

// Mock token only in browser
if (typeof window !== "undefined" && !localStorage.getItem("token_bo")) {
  localStorage.setItem("token_bo", "mock-token-1234");
}

const instance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor ก่อนส่ง request
instance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token_bo");
    if (config.headers) {
      config.headers.set("Authorization", token ? `Bearer ${token}` : "");
      config.headers.set("com_id", "1"); // ใส่ com_id แค่ใน header เท่านั้น
    }
  }
  return config;
});

// Interceptor หลังรับ response
instance.interceptors.response.use(
  (response) => {
    const code = response.data?.code;
    if (code === 20000 || code === 10011 || code === 22006) {
      console.warn("Token expired or unauthorized!", response.data);
      localStorage.clear();
      if (process.env.NODE_ENV !== "development") {
        window.location.href = CONTEXT_PATH;
      }
    }
    return response;
  },
  (error) => {
    console.error("API Error:", error);
    localStorage.clear();
    if (process.env.NODE_ENV !== "development") {
      window.location.href = CONTEXT_PATH;
    }
    return Promise.reject(error);
  }
);

// Service layer (สำหรับเรียกใช้งาน)
interface Payload {
  path: string;
  params?: string | number;
  body?: any;
  query?: Record<string, string | number>;
}

export const api = {
  async get<T>(payload: Payload): Promise<T> {
    const { path, params, query } = payload;
    let url = path;
    if (params !== undefined) url += `/${params}`;
    if (query) {
      const queryString = new URLSearchParams(
        query as Record<string, string>
      ).toString();
      url += `?${queryString}`;
    }
    const res = await instance.get(url);
    return res.data;
  },

  async post<T>(payload: Payload): Promise<T> {
    const { path, body } = payload;
    const res = await instance.post(path, body);
    return res.data;
  },

  async put<T>(payload: Payload): Promise<T> {
    const { path, params, body } = payload;
    const url = `${path}${params !== undefined ? `/${params}` : ""}`;
    const res = await instance.put(url, body);
    return res.data;
  },

  async delete<T>(payload: Payload): Promise<T> {
    const { path, params } = payload;
    const url = `${path}/${params}`;
    const res = await instance.delete(url);
    return res.data;
  },
};