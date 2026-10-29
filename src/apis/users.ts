import type { UserProfile } from "../types/user";
import { ApiResponseError } from "../utils/apiError";
import api from "./client";
import type { ApiResponse } from "./types";

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
