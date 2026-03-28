import axios from "axios";
import { tokenStorage } from "../utils/tokenStorage";
import { API_BASE, API_PREFIX } from "./apiBase";

const API_BASE_URL = import.meta.env.DEV ? API_PREFIX : API_BASE;

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});

let isRefreshing = false;
let refreshQueue = [];

function flushRefreshQueue(error, accessToken) {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
      return;
    }

    resolve(accessToken);
  });

  refreshQueue = [];
}

export async function requestFreshAccessToken() {
  const response = await refreshClient.post("/auth/refresh");
  const nextToken = response.data?.accessToken;

  if (!nextToken) {
    throw new Error("Refresh response did not include an access token.");
  }

  return nextToken;
}

api.interceptors.request.use((config) => {
  const accessToken = tokenStorage.get();

  if (accessToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const requestUrl = originalRequest?.url ?? "";
    const isAuthRoute =
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/register") ||
      requestUrl.includes("/auth/refresh");

    if (!originalRequest || status !== 401 || originalRequest._retry || isAuthRoute) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        refreshQueue.push({ resolve, reject });
      })
        .then((nextToken) => {
          originalRequest.headers = originalRequest.headers ?? {};
          originalRequest.headers.Authorization = `Bearer ${nextToken}`;
          return api(originalRequest);
        })
        .catch((queueError) => Promise.reject(queueError));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const nextToken = await requestFreshAccessToken();
      tokenStorage.set(nextToken);
      flushRefreshQueue(null, nextToken);
      originalRequest.headers = originalRequest.headers ?? {};
      originalRequest.headers.Authorization = `Bearer ${nextToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      tokenStorage.clear();
      flushRefreshQueue(refreshError, null);

      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("auth:logout"));
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
