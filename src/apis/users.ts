import type { ChangePasswordRequest, UserProfile } from "../types/user";
import { ApiResponseError } from "../utils/apiError";
import { writeProfileCache } from "../utils/profileCache";
import api from "./client";
import { setAccessToken } from "./tokenStore";
import type { ApiResponse, TokenResponse } from "./types";

export const getMyProfile = async (signal?: AbortSignal) => {
  const response = await api.get<ApiResponse<UserProfile>>("/api/v1/users/me", {
    signal,
  });

  if (!response.data?.success) {
    throw new ApiResponseError(response.data?.error);
  }
  if (!response.data.data) {
    throw new Error("사용자 정보가 없습니다.");
  }

  return response.data.data;
};

export const updateMyNickname = async (nickname: string) => {
  const response = await api.patch<ApiResponse<UserProfile>>("/api/v1/users/me", {
    nickname: nickname.trim(),
  });

  if (!response.data?.success) {
    throw new ApiResponseError(response.data?.error);
  }
  if (!response.data.data) {
    throw new Error("변경된 사용자 정보가 없습니다.");
  }

  // 바뀐 닉네임이 다른 화면에도 바로 보이게 저장해 둔 내 정보도 갱신
  writeProfileCache(response.data.data);
  return response.data.data;
};

export const changeMyPassword = async (credentials: ChangePasswordRequest) => {
  const response = await api.patch<ApiResponse<TokenResponse>>(
    "/api/v1/users/me/password",
    credentials,
  );

  if (!response.data?.success) {
    throw new ApiResponseError(response.data?.error);
  }
  const token = response.data.data?.accessToken;
  if (typeof token !== "string" || token.trim().length === 0) {
    throw new Error("비밀번호 변경 응답에 유효한 액세스 토큰이 없습니다.");
  }

  setAccessToken(token);
};
