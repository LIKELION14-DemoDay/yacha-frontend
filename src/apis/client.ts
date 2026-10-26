/**
 * 백엔드 API 요청에 공통으로 사용하는 Axios 인스턴스를 설정하는 파일
 * API Base URL을 환경변수에서 가져오며,
 * HttpOnly 쿠키 기반 Refresh Token 사용을 위해 withCredentials를 활성화
 * 모든 요청에 액세스 토큰을 붙이고, 401이면 토큰을 재발급한 뒤 한 번 다시 요청함
 */
import axios, { type InternalAxiosRequestConfig } from "axios";
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from "./tokenStore";
import type { ApiResponse, TokenResponse } from "./types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// 401이 와도 재발급하지 않을 요청 (로그인 · 재발급 자체 · 비밀번호 재설정 등)
const NO_REFRESH_PATHS = [
  "/api/v1/auth/token",
  "/api/v1/auth/login",
  "/api/v1/auth/social",
  "/api/v1/auth/signup",
  "/api/v1/auth/guest",
  "/api/v1/auth/password",
];

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

let refreshPromise: Promise<string> | null = null;

// 재발급은 동시에 한 번만 보내고, 나머지 요청은 같은 결과를 기다림
// 리프레시 토큰은 쿠키로 인증하므로 Authorization 헤더 없이 기본 axios로 보냄
// 재발급하면 이전 리프레시 토큰은 바로 무효라서, 따로따로 보내면 나머지가 로그아웃됨
export const refreshAccessToken = () => {
  if (!refreshPromise) {
    refreshPromise = axios
      .post<ApiResponse<TokenResponse>>(
        `${API_BASE_URL}/api/v1/auth/token/refresh`,
        null,
        { withCredentials: true },
      )
      .then((response) => {
        const token = response.data.data.accessToken;
        setAccessToken(token);
        return token;
      })
      .catch((error: unknown) => {
        clearAccessToken();
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

api.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(undefined, async (error: unknown) => {
  if (!axios.isAxiosError(error) || !error.config) {
    return Promise.reject(error);
  }

  const originalRequest: RetryableRequestConfig = error.config;
  const url = originalRequest.url ?? "";
  const isNoRefreshPath = NO_REFRESH_PATHS.some((path) =>
    url.startsWith(path),
  );

  if (
    error.response?.status !== 401 ||
    originalRequest._retry ||
    isNoRefreshPath
  ) {
    return Promise.reject(error);
  }

  originalRequest._retry = true;

  // 요청을 보낸 뒤에 이미 다른 요청이 재발급을 끝냈다면, 재발급 없이 새 토큰으로 다시 보냄
  // (리프레시 토큰은 쓸 때마다 바뀌므로 불필요한 재발급을 줄임)
  const usedToken = String(originalRequest.headers.Authorization ?? "");
  const currentToken = getAccessToken();

  if (currentToken && usedToken !== `Bearer ${currentToken}`) {
    return api(originalRequest);
  }

  // 재발급에 실패하면 그 에러가 그대로 호출한 쪽으로 전달됨
  await refreshAccessToken();

  return api(originalRequest);
});

export default api;
