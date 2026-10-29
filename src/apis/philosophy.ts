import type {
  PastPhilosophyResponse,
  ThisWeekPhilosophyResponse,
} from "../types/philosophy";
import { ApiResponseError } from "../utils/apiError";
import api from "./client";
import type { ApiResponse } from "./types";

export const getThisWeekPhilosophy = async (signal?: AbortSignal) => {
  const response = await api.get<ApiResponse<ThisWeekPhilosophyResponse>>(
    "/api/v1/philosophy/this-week",
    { signal },
  );

  if (!response.data?.success) {
    throw new ApiResponseError(response.data?.error, response.data?.traceId);
  }
  if (!response.data.data) {
    throw new ApiResponseError(
      { code: "INVALID_RESPONSE", message: "금주의 1분 철학 응답이 없습니다." },
      response.data.traceId,
    );
  }

  // 호출부에서도 traceId를 확인할 수 있도록 공통 응답 전체를 반환합니다.
  return response.data;
};

export const getPastPhilosophy = async (page = 0, signal?: AbortSignal) => {
  const response = await api.get<ApiResponse<PastPhilosophyResponse>>(
    "/api/v1/philosophy/past",
    { params: { page }, signal },
  );

  if (!response.data?.success) {
    throw new ApiResponseError(response.data?.error, response.data?.traceId);
  }
  if (!response.data.data) {
    throw new ApiResponseError(
      { code: "INVALID_RESPONSE", message: "이전 1분 철학 응답이 없습니다." },
      response.data.traceId,
    );
  }

  return response.data;
};
