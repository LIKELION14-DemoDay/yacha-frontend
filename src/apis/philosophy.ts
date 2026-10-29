import type {
  PastPhilosophyResponse,
  PhilosophyArticleDetail,
  PhilosophyArticleDetailResponse,
  PhilosophyBookmarkResponse,
  PhilosophyBookmarksResponse,
  PhilosophyMemoResponse,
  ThisWeekPhilosophyResponse,
} from "../types/philosophy";
import { ApiResponseError } from "../utils/apiError";
import api from "./client";
import type { ApiResponse } from "./types";

const readPhilosophyResponse = <T>(response: ApiResponse<T>) => {
  if (!response?.success) {
    throw new ApiResponseError(response?.error, response?.traceId);
  }
  if (!response.data) {
    throw new ApiResponseError(
      { code: "INVALID_RESPONSE", message: "1분 철학 응답이 없습니다." },
      response.traceId,
    );
  }
  return response;
};

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

export const getPhilosophyBookmarks = async (page = 0, signal?: AbortSignal) => {
  const response = await api.get<ApiResponse<PhilosophyBookmarksResponse>>(
    "/api/v1/philosophy/bookmarks",
    { params: { page }, signal },
  );
  return readPhilosophyResponse(response.data);
};

export const getPhilosophyArticle = async (
  id: number,
  signal?: AbortSignal,
): Promise<ApiResponse<PhilosophyArticleDetail>> => {
  const response = await api.get<ApiResponse<PhilosophyArticleDetailResponse>>(
    `/api/v1/philosophy/${id}`,
    { signal },
  );
  const result = readPhilosophyResponse(response.data);
  return {
    ...result,
    data: {
      ...result.data,
      philosophers: result.data.philosophers.map((philosopher) => ({
        ...philosopher,
        type: philosopher.type ?? null,
        alias: philosopher.alias ?? null,
        sections: philosopher.sections.map((section) => ({
          title: section.title ?? section.subtitle ?? "",
          content: section.content ?? section.body ?? "",
        })),
      })),
    },
  };
};

export const addPhilosophyBookmark = async (id: number) => {
  const response = await api.put<ApiResponse<PhilosophyBookmarkResponse>>(
    `/api/v1/philosophy/${id}/bookmark`,
  );
  return readPhilosophyResponse(response.data);
};

export const removePhilosophyBookmark = async (id: number) => {
  const response = await api.delete<ApiResponse<PhilosophyBookmarkResponse>>(
    `/api/v1/philosophy/${id}/bookmark`,
  );
  return readPhilosophyResponse(response.data);
};

export const savePhilosophyMemo = async (id: number, content: string) => {
  const response = await api.put<ApiResponse<PhilosophyMemoResponse>>(
    `/api/v1/philosophy/${id}/memo`,
    { content },
  );
  return readPhilosophyResponse(response.data);
};
