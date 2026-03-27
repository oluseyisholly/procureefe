import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  process.env.API_BASE_URL ??
  "http://localhost:3008";

const ACCESS_TOKEN_STORAGE_KEY = "procureefe_access_token";
const USER_PROFILE_STORAGE_KEY = "procureefe_user_profile";

export type ApiUserProfile = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role?: string;
  groupId?: string;
};

type ApiLifecycleHandlers = {
  onRequest?: (config: InternalAxiosRequestConfig) => void;
  onResponse?: (response: AxiosResponse) => void;
  onUnauthorized?: (error: AxiosError) => void;
  onForbidden?: (error: AxiosError) => void;
  onNetworkUnavailable?: (error: AxiosError) => void;
  onNetworkAvailable?: () => void;
};

let lifecycleHandlers: ApiLifecycleHandlers = {};
let networkListenersBound = false;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function buildNetworkError(
  message: string,
  config?: InternalAxiosRequestConfig,
): AxiosError {
  return new AxiosError(message, "ERR_NETWORK", config);
}

function readAccessTokenFromStorage(): string | null {
  if (!isBrowser()) {
    return null;
  }

  try {
    return window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

function readUserProfileFromStorage(): ApiUserProfile | null {
  if (!isBrowser()) {
    return null;
  }

  try {
    const serializedProfile = window.localStorage.getItem(USER_PROFILE_STORAGE_KEY);
    if (!serializedProfile) {
      return null;
    }

    const parsedProfile = JSON.parse(serializedProfile) as Partial<ApiUserProfile>;
    if (
      typeof parsedProfile.firstName !== "string" ||
      typeof parsedProfile.lastName !== "string" ||
      typeof parsedProfile.email !== "string" ||
      typeof parsedProfile.phone !== "string"
    ) {
      return null;
    }

    return {
      firstName: parsedProfile.firstName,
      lastName: parsedProfile.lastName,
      email: parsedProfile.email,
      phone: parsedProfile.phone,
      role: typeof parsedProfile.role === "string" ? parsedProfile.role : undefined,
      groupId:
        typeof parsedProfile.groupId === "string"
          ? parsedProfile.groupId
          : undefined,
    };
  } catch {
    return null;
  }
}

function attachAuthHeader(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
  const token = readAccessTokenFromStorage();
  if (!token) {
    return config;
  }

  config.headers = config.headers ?? {};
  (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
  return config;
}

function bindNetworkListeners() {
  if (!isBrowser() || networkListenersBound) {
    return;
  }

  window.addEventListener("online", () => {
    lifecycleHandlers.onNetworkAvailable?.();
  });

  window.addEventListener("offline", () => {
    lifecycleHandlers.onNetworkUnavailable?.(
      buildNetworkError("Network unavailable. Please check your internet connection."),
    );
  });

  networkListenersBound = true;
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    bindNetworkListeners();

    if (isBrowser() && !window.navigator.onLine) {
      const offlineError = buildNetworkError(
        "Network unavailable. Please check your internet connection.",
        config,
      );
      lifecycleHandlers.onNetworkUnavailable?.(offlineError);
      return Promise.reject(offlineError);
    }

    const nextConfig = attachAuthHeader(config);
    lifecycleHandlers.onRequest?.(nextConfig);
    return nextConfig;
  },
  (error: AxiosError) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => {
    lifecycleHandlers.onResponse?.(response);
    return response;
  },
  (error: AxiosError) => {
    const status = error.response?.status;

    if (status === 401) {
      clearApiAccessToken();
      lifecycleHandlers.onUnauthorized?.(error);
    } else if (status === 403) {
      clearApiAccessToken();
      lifecycleHandlers.onForbidden?.(error);
    } else if (error.code === "ERR_NETWORK" || !error.response) {
      lifecycleHandlers.onNetworkUnavailable?.(error);
    }

    return Promise.reject(error);
  },
);

export function configureApiLifecycleHandlers(handlers: Partial<ApiLifecycleHandlers>) {
  lifecycleHandlers = {
    ...lifecycleHandlers,
    ...handlers,
  };
}

export function setApiAccessToken(token: string) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
}

export function getApiAccessToken(): string | null {
  return readAccessTokenFromStorage();
}

export function clearApiAccessToken() {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  window.localStorage.removeItem(USER_PROFILE_STORAGE_KEY);
}

export function setApiUserProfile(profile: ApiUserProfile) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(USER_PROFILE_STORAGE_KEY, JSON.stringify(profile));
}

export function getApiUserProfile(): ApiUserProfile | null {
  return readUserProfileFromStorage();
}

export function clearApiUserProfile() {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(USER_PROFILE_STORAGE_KEY);
}

export function isApiNetworkAvailable(): boolean {
  return !isBrowser() || window.navigator.onLine;
}

export const apiConfig = {
  baseURL: API_BASE_URL,
  accessTokenStorageKey: ACCESS_TOKEN_STORAGE_KEY,
  userProfileStorageKey: USER_PROFILE_STORAGE_KEY,
} as const;
