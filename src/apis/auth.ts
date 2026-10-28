/**
 * 인증 관련 백엔드 API 요청을 관리하는 파일
 */
import api, { refreshAccessToken } from "./client";
import { clearAccessToken, setAccessToken } from "./tokenStore";
import type { ApiResponse, LoginRequest, TokenResponse } from "./types";

export const login = async (credentials: LoginRequest) => {
  const response = await api.post<ApiResponse<TokenResponse>>(
    "/api/v1/auth/login",
    credentials,
  );

  if (!response.data.success || !response.data.data?.accessToken) {
    throw new Error("로그인 응답에 액세스 토큰이 없습니다.");
  }

  setAccessToken(response.data.data.accessToken);

  return response.data;
};

export const kakaoLogin = async (code: string, redirectUri: string) => {
  const response = await api.post<ApiResponse<TokenResponse>>(
    "/api/v1/auth/social/kakao",
    {
      code,
      redirectUri,
    },
  );

  setAccessToken(response.data.data.accessToken);

  return response.data;
};

export const googleLogin = async (code: string, redirectUri: string) => {
  const response = await api.post<ApiResponse<TokenResponse>>(
    "/api/v1/auth/social/google",
    {
      code,
      redirectUri,
    },
  );

  setAccessToken(response.data.data.accessToken);

  return response.data;
};

// 앱 시작 시 리프레시 쿠키로 액세스 토큰을 다시 받아 로그인 상태를 복구
// 로그인한 적이 없으면 실패하는 게 정상이라 에러를 던지지 않고 false를 반환
export const restoreLogin = async () => {
  try {
    await refreshAccessToken();
    return true;
  } catch {
    return false;
  }
};

export const logout = async () => {
  try {
    await api.post("/api/v1/auth/logout");
  } finally {
    clearAccessToken();
  }
};
