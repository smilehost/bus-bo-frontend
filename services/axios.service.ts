import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
// const CONTEXT_PATH = process.env.NEXT_PUBLIC_CONTEXT_PATH || "/bu";

const instance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// // ดึง com_id จาก localStorage
// function getComId(): string | null {
//   try {
//     const store = localStorage.getItem("token_bo");
//     if (!store) return null;
//     const parsed = JSON.parse(store);
//     return parsed?.state?.com_id?.toString() || null;
//   } catch (error) {
//     console.error("Failed to parse com_id from token_bo:", error);
//     return null;
//   }
// }

// Interceptor ก่อนส่ง request
instance.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem("token_bo");

    try {
      if (raw) {
        const parsed = JSON.parse(raw);
        const token = parsed?.state?.token;
        // const com_id = parsed?.state?.com_id?.toString();
        const com_id = 1;

        if (config.headers) {
          config.headers.set("Authorization", token ? `Bearer ${token}` : "");
          if (com_id) {
            config.headers.set("com_id", com_id);
          }
        }
      }
    } catch (error) {
      console.error("Failed to parse token from token_bo:", error);
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
      // localStorage.clear();
      // if (process.env.NODE_ENV !== "development") {
      //   window.location.href = CONTEXT_PATH;
      // }
    }
    return response;
  },
  (error) => {
    console.error("API Error:", error);
    // localStorage.clear();
    // if (process.env.NODE_ENV !== "development") {
    //   window.location.href = CONTEXT_PATH;
    // }
    return Promise.reject(error);
  }
);

// Service layer
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

  async patch<T>(payload: Payload): Promise<T> {
    const { path, params, body } = payload;
    const url = `${path}${params !== undefined ? `/${params}` : ""}`;
    const res = await instance.patch(url, body);
    return res.data;
  },
};
