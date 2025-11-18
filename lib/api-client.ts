"use client";

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { toast } from "sonner";

type ApiRequestConfig = AxiosRequestConfig;

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api",
  timeout: 30_000,
  headers: {
    "Content-Type": "application/json",
  },
});

const getStoredToken = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem("access_token");
};

export const getApiErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string; error?: string }
      | string
      | undefined;

    if (typeof data === "string") {
      return data;
    }

    const responseMessage = data?.message ?? data?.error;

    return responseMessage ?? error.message ?? "An unexpected error occurred.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred.";
};

apiClient.interceptors.request.use((config) => {
  const token = getStoredToken();

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    toast.error(getApiErrorMessage(error));
    return Promise.reject(error);
  }
);

const unwrap = <T>(promise: Promise<AxiosResponse<T>>) =>
  promise.then((response) => response.data);

export const api = {
  get: <T>(url: string, config?: ApiRequestConfig) => unwrap<T>(apiClient.get<T>(url, config)),
  post: <T>(url: string, data?: unknown, config?: ApiRequestConfig) =>
    unwrap<T>(apiClient.post<T>(url, data, config)),
  put: <T>(url: string, data?: unknown, config?: ApiRequestConfig) =>
    unwrap<T>(apiClient.put<T>(url, data, config)),
  patch: <T>(url: string, data?: unknown, config?: ApiRequestConfig) =>
    unwrap<T>(apiClient.patch<T>(url, data, config)),
  delete: <T>(url: string, config?: ApiRequestConfig) =>
    unwrap<T>(apiClient.delete<T>(url, config)),
};

export { apiClient };
