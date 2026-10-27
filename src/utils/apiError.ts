/**
 * 서버 에러 응답에서 에러 코드를 꺼내는 함수 (예: TOPIC_NOT_FOUND)
 */
import axios from "axios";

import type { ApiResponse } from "../apis/types";

export const getApiErrorCode = (error: unknown) =>
  axios.isAxiosError<ApiResponse<null>>(error)
    ? error.response?.data?.error?.code
    : undefined;
