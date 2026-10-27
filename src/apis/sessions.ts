/**
 * 토론 세션(매칭 · 토론방 · 결과) 관련 백엔드 API 요청을 관리하는 파일
 * 모든 함수는 서버 응답의 data 만 꺼내서 반환함
 */
import api from "./client";
import type { ApiResponse } from "./types";
import type { TopicCategory } from "../types/topic";
import type {
  CreateBotSessionRequest,
  CreateSessionRequest,
  CurrentSession,
  MemoRequest,
  SessionHints,
  SessionIdResponse,
  SessionMessage,
  SessionProposal,
  SessionResult,
  SessionState,
  SubmittedMemo,
  WaitingRoomsResponse,
} from "../types/session";

const SESSIONS_URL = "/api/v1/sessions";

/* ---------- 방 만들기 · 입장 · 나가기 ---------- */

// 방 생성 → 상대 대기
export const createSession = async (body: CreateSessionRequest) => {
  const response = await api.post<ApiResponse<SessionIdResponse>>(
    SESSIONS_URL,
    body,
  );

  return response.data.data;
};

// 대기 중인 방 입장 (늦게 들어오면 SESSION_NOT_WAITING)
export const joinSession = async (sessionId: number) => {
  const response = await api.post<ApiResponse<SessionIdResponse>>(
    `${SESSIONS_URL}/${sessionId}/join`,
  );

  return response.data.data;
};

// 봇과 바로 시작 (봇은 반대 입장, MATCHED 이벤트 없음)
export const createBotSession = async (body: CreateBotSessionRequest) => {
  const response = await api.post<ApiResponse<SessionIdResponse>>(
    `${SESSIONS_URL}/bot`,
    body,
  );

  return response.data.data;
};

// 대기 중 봇전으로 전환 (방장만)
export const switchToBot = async (sessionId: number) => {
  const response = await api.post<ApiResponse<SessionIdResponse>>(
    `${SESSIONS_URL}/${sessionId}/ai`,
  );

  return response.data.data;
};

// 대기 취소 (방장만)
export const cancelSession = async (sessionId: number) => {
  const response = await api.delete<ApiResponse<SessionIdResponse>>(
    `${SESSIONS_URL}/${sessionId}`,
  );

  return response.data.data;
};

// 게임 중 나가기 (바로 몰수패)
export const leaveSession = async (sessionId: number) => {
  const response = await api.post<ApiResponse<SessionIdResponse>>(
    `${SESSIONS_URL}/${sessionId}/leave`,
  );

  return response.data.data;
};

// 자동 제안 거절
export const rejectProposal = async (sessionId: number) => {
  await api.post(`${SESSIONS_URL}/${sessionId}/reject`);
};

/* ---------- 조회 ---------- */

// 내가 참여 중인 세션 (없으면 null)
export const getCurrentSession = async () => {
  const response = await api.get<ApiResponse<CurrentSession | null>>(
    `${SESSIONS_URL}/current`,
  );

  return response.data.data;
};

// 방 찾기: 카테고리의 대기 방을 오래 기다린 순으로 20개씩 (page 는 0부터)
export const getWaitingRooms = async (category: TopicCategory, page = 0) => {
  const response = await api.get<ApiResponse<WaitingRoomsResponse>>(
    `${SESSIONS_URL}/waiting`,
    { params: { category, page } },
  );

  return response.data.data;
};

// "랜덤 주제로 시작하기": 고른 카테고리부터 8개를 돌며 대기 방을 하나씩 제안
// 다시 부르면 처음부터 다시 돎 (입장이 SESSION_NOT_WAITING 이면 다시 부르면 됨)
export const getProposal = async (category: TopicCategory) => {
  const response = await api.get<ApiResponse<SessionProposal>>(
    `${SESSIONS_URL}/proposal`,
    { params: { category } },
  );

  return response.data.data;
};

// 토론방 현재 상태 (진입 · 재연결 때 구간과 남은 시간 맞추기)
export const getSessionState = async (sessionId: number) => {
  const response = await api.get<ApiResponse<SessionState>>(
    `${SESSIONS_URL}/${sessionId}/state`,
  );

  return response.data.data;
};

// 재연결 뒤 놓친 메시지 (seqNo > afterSeq, 오름차순)
export const getMessages = async (sessionId: number, afterSeq: number) => {
  const response = await api.get<ApiResponse<SessionMessage[]>>(
    `${SESSIONS_URL}/${sessionId}/messages`,
    { params: { afterSeq } },
  );

  return response.data.data;
};

// 판정 · 결과 (PENDING 이면 1.5초마다 다시 조회)
export const getResult = async (sessionId: number) => {
  const response = await api.get<ApiResponse<SessionResult>>(
    `${SESSIONS_URL}/${sessionId}/result`,
  );

  return response.data.data;
};

/* ---------- 주장 · 반론 ---------- */

// 주장 · 반론 제출 (다시 제출하면 덮어씀, 빈 글도 제출로 받음)
export const submitMemo = async (sessionId: number, content: string) => {
  const body: MemoRequest = { content };

  await api.put(`${SESSIONS_URL}/${sessionId}/memo`, body);
};

// 내가 제출한 주장 · 반론 (새로고침 때 복구용, 게임 중에만)
export const getMyMemos = async (sessionId: number) => {
  const response = await api.get<ApiResponse<SubmittedMemo[]>>(
    `${SESSIONS_URL}/${sessionId}/memo`,
  );

  return response.data.data;
};

// 주장 작성 화면의 "힌트 보기" (PENDING 이면 1.5초마다 다시 조회)
export const getHints = async (sessionId: number) => {
  const response = await api.get<ApiResponse<SessionHints>>(
    `${SESSIONS_URL}/${sessionId}/hints`,
  );

  return response.data.data;
};
