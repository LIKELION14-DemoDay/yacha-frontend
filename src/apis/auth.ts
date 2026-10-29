/**
 * 인증 관련 백엔드 API 요청을 관리하는 파일
 */
import axios from "axios";
import { ApiResponseError } from "../utils/apiError";
import api, { REFRESH_TOKEN_PATH, refreshAccessToken } from "./client";
import { clearAccessToken, setAccessToken } from "./tokenStore";
import type {
  ApiResponse,
  EmailAvailabilityResponse,
  LoginRequest,
  PasswordResetRequest,
  PasswordResetVerificationRequest,
  PasswordResetVerificationResponse,
  SignUpRequest,
  SocialLoginRequest,
  TokenResponse,
} from "./types";

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

export const signUp = async (credentials: SignUpRequest) => {
  const response = await api.post<ApiResponse<TokenResponse>>(
    "/api/v1/auth/signup",
    credentials,
  );

  if (!response.data.success || !response.data.data?.accessToken) {
    throw new Error("회원가입 응답에 액세스 토큰이 없습니다.");
  }

  setAccessToken(response.data.data.accessToken);

  return response.data;
};

export const checkEmailAvailability = async (email: string) => {
  const response = await api.get<ApiResponse<EmailAvailabilityResponse>>(
    "/api/v1/auth/email/availability",
    { params: { email: email.trim().toLowerCase() } },
  );
  const available = response.data?.data?.available;

  if (!response.data?.success || typeof available !== "boolean") {
    throw new Error("이메일 중복 확인 응답이 올바르지 않습니다.");
  }

  return available;
};

export const requestPasswordReset = async (email: string) => {
  const response = await api.post<ApiResponse<string>>(
    "/api/v1/auth/password/reset-request",
    { email: email.trim().toLowerCase() },
  );

  if (!response.data?.success) {
    throw new ApiResponseError(response.data?.error);
  }
};

export const verifyPasswordResetCode = async (
  credentials: PasswordResetVerificationRequest,
) => {
  const response = await api.post<ApiResponse<PasswordResetVerificationResponse>>(
    "/api/v1/auth/password/verify",
    { email: credentials.email.trim().toLowerCase(), code: credentials.code },
  );
  if (!response.data?.success) {
    throw new ApiResponseError(response.data?.error);
  }

  const token = response.data?.data?.resetToken;

  if (typeof token !== "string" || token.trim().length === 0) {
    throw new Error("인증번호 확인 응답에 유효한 재설정 토큰이 없습니다.");
  }

  return token;
};

export const resetPassword = async (credentials: PasswordResetRequest) => {
  const response = await api.post<ApiResponse<string>>(
    "/api/v1/auth/password/reset",
    credentials,
  );

  if (!response.data?.success) {
    throw new ApiResponseError(response.data?.error);
  }

  // 서버에서 모든 기기의 세션을 만료시키므로 현재 액세스 토큰도 삭제합니다.
  clearAccessToken();
};

export const createGuest = async () => {
  const response = await api.post<ApiResponse<TokenResponse>>(
    "/api/v1/auth/guest",
  );
  const token = response.data?.data?.accessToken;

  if (
    !response.data?.success ||
    typeof token !== "string" ||
    token.trim().length === 0
  ) {
    throw new Error("게스트 생성 응답에 유효한 액세스 토큰이 없습니다.");
  }

  setAccessToken(token);

  return response.data;
};

const saveSocialLogin = (response: ApiResponse<TokenResponse>) => {
  if (!response?.success) {
    throw new ApiResponseError(response?.error);
  }
  const token = response.data?.accessToken;
  if (typeof token !== "string" || token.trim().length === 0) {
    throw new Error("소셜 로그인 응답에 유효한 액세스 토큰이 없습니다.");
  }

  setAccessToken(token);
  return response;
};

export const socialLogin = async (credentials: SocialLoginRequest) => {
  const response = await api.post<ApiResponse<TokenResponse>>(
    "/api/v1/auth/social",
    credentials,
  );

  return saveSocialLogin(response.data);
};

export const kakaoLogin = async (code: string, redirectUri: string) => {
  const response = await api.post<ApiResponse<TokenResponse>>(
    "/api/v1/auth/social/kakao",
    {
      code,
      redirectUri,
    },
  );

  return saveSocialLogin(response.data);
};

export const googleLogin = async (code: string, redirectUri: string) => {
  const response = await api.post<ApiResponse<TokenResponse>>(
    "/api/v1/auth/social/google",
    {
      code,
      redirectUri,
    },
  );

  return saveSocialLogin(response.data);
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
    const response = await api.post<ApiResponse<string>>("/api/v1/auth/logout");

    if (!response.data.success) {
      throw new Error("로그아웃에 실패했습니다.");
    }
  } catch (error: unknown) {
    // 재발급까지 401이면 인증을 복구할 수 없으므로 프론트에서도 로그아웃 처리합니다.
    const isExpiredSession =
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      error.config?.url?.endsWith(REFRESH_TOKEN_PATH);

    if (!isExpiredSession) throw error;
  }

  clearAccessToken();
};
