import type {
  BalanceAnswer,
  BalanceGameResult,
  BalanceQuestion,
  PhilosopherType,
} from "../types/balanceGame";
import { BALANCE_QUESTION_COUNT, isPhilosopherType } from "../types/balanceGame";
import { ApiResponseError } from "../utils/apiError";
import api from "./client";
import type { ApiResponse } from "./types";

const BASE_PATH = "/api/v1/balance-game";

const unwrap = <T>(response: ApiResponse<T>): T => {
  if (!response?.success) {
    throw new ApiResponseError(response?.error, response?.traceId);
  }
  return response.data;
};

const readResult = (response: ApiResponse<BalanceGameResult>) => {
  const result = unwrap(response);
  if (
    !result ||
    !isPhilosopherType(result.type) ||
    typeof result.name !== "string" ||
    typeof result.alias !== "string" ||
    !Array.isArray(result.sections) ||
    result.sections.length === 0 ||
    !result.sections.every(
      (section) =>
        typeof section?.title === "string" && typeof section.content === "string",
    )
  ) {
    throw new Error("밸런스 게임 결과 응답이 올바르지 않습니다.");
  }
  return result;
};

export const getBalanceQuestions = async (signal?: AbortSignal) => {
  const response = await api.get<ApiResponse<BalanceQuestion[]>>(
    `${BASE_PATH}/questions`,
    { signal },
  );
  const questions = unwrap(response.data);
  if (
    !Array.isArray(questions) ||
    questions.length !== BALANCE_QUESTION_COUNT ||
    !questions.every(
      (question) =>
        Number.isInteger(question?.number) &&
        typeof question.question === "string" &&
        typeof question.optionA === "string" &&
        typeof question.optionB === "string",
    ) ||
    new Set(questions.map(({ number }) => number)).size !== BALANCE_QUESTION_COUNT
  ) {
    throw new Error("밸런스 게임 질문 응답이 올바르지 않습니다.");
  }
  return [...questions].sort((left, right) => left.number - right.number);
};

export const getPhilosopherResult = async (
  type: PhilosopherType,
  signal?: AbortSignal,
) => {
  const response = await api.get<ApiResponse<BalanceGameResult>>(
    `${BASE_PATH}/philosophers/${type}`,
    { signal },
  );
  return readResult(response.data);
};

// 비로그인은 미리보기 쿠키, 로그인(게스트 포함)은 계정에 결과를 저장합니다.
// 공통 클라이언트의 withCredentials로 미리보기 HttpOnly 쿠키를 전달합니다.
export const submitBalanceAnswers = async (
  answers: BalanceAnswer[],
  isAuthenticated: boolean,
) => {
  if (
    answers.length !== BALANCE_QUESTION_COUNT ||
    !answers.every((answer) => answer === "A" || answer === "B")
  ) {
    throw new Error("12개 질문에 모두 답해주세요.");
  }
  const response = await api.post<ApiResponse<BalanceGameResult>>(
    `${BASE_PATH}/${isAuthenticated ? "result" : "preview"}`,
    { answers },
  );
  return readResult(response.data);
};

export const skipBalanceGame = async (isAuthenticated: boolean) => {
  const response = await api.post<ApiResponse<string>>(
    `${BASE_PATH}/${isAuthenticated ? "skip" : "preview/skip"}`,
  );
  unwrap(response.data);
};
