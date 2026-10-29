/**
 * 서버 오류 응답의 코드와 메시지를 읽고, 응답이 없을 때의 안내를 제공합니다.
 */
import axios from "axios";

import type { ApiError, ApiResponse } from "../apis/types";

const DEFAULT_ERROR_MESSAGE = "요청을 처리하지 못했습니다. 다시 시도해주세요.";

// HTTP 200으로 전달된 실패 응답도 서버의 오류 정보와 추적 ID를 유지합니다.
export class ApiResponseError extends Error {
  readonly code?: string;
  readonly traceId?: string;

  constructor(error?: ApiError | null, traceId?: string) {
    super(error?.message?.trim() || DEFAULT_ERROR_MESSAGE);
    this.code = error?.code;
    this.traceId = traceId;
  }
}

export const getApiErrorCode = (error: unknown) =>
  axios.isAxiosError<ApiResponse<null>>(error)
    ? error.response?.data?.error?.code
    : error instanceof ApiResponseError
      ? error.code
      : undefined;

export const getApiErrorTraceId = (error: unknown) =>
  axios.isAxiosError<ApiResponse<unknown>>(error)
    ? error.response?.data?.traceId
    : error instanceof ApiResponseError
      ? error.traceId
      : undefined;

export const getApiErrorMessage = (error: unknown) => {
  if (axios.isAxiosError<ApiResponse<null>>(error)) {
    return (
      error.response?.data?.error?.message?.trim() ||
      (!error.response
        ? "서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요."
        : DEFAULT_ERROR_MESSAGE)
    );
  }

  return error instanceof ApiResponseError
    ? error.message
    : DEFAULT_ERROR_MESSAGE;
};
