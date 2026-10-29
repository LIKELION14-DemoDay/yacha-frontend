/**
 * 백엔드 API 공통 응답 타입을 정의하는 파일
 */

export type ApiError = {
  code: string;
  message: string;
};

export type ApiResponse<T> = {
  success: boolean;
  data: T;
  error: ApiError | null;
  // 서버 로그에서 요청을 추적하는 ID로, 콘텐츠 data와 별도로 전달됩니다.
  traceId: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type SocialLoginRequest = {
  provider: "KAKAO" | "GOOGLE";
  idToken: string;
};

export type SignUpRequest = LoginRequest & {
  nickname: string;
};

export type EmailAvailabilityResponse = {
  available: boolean;
};

export type PasswordResetVerificationRequest = {
  email: string;
  code: string;
};

export type PasswordResetVerificationResponse = {
  resetToken: string;
};

export type PasswordResetRequest = {
  token: string;
  newPassword: string;
};

// 로그인 · 회원가입 · 토큰 재발급 응답의 data
export type TokenResponse = {
  accessToken: string;
  userId: number;
  nickname: string;
  isGuest: boolean;
  isNewUser: boolean;
};
