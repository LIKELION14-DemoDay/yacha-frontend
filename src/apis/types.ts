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
  traceId: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type SignUpRequest = LoginRequest & {
  nickname: string;
};

// 로그인 · 회원가입 · 토큰 재발급 응답의 data
export type TokenResponse = {
  accessToken: string;
  userId: number;
  nickname: string;
  isGuest: boolean;
  isNewUser: boolean;
};
