/**
 * 토론 세션(매칭 · 토론방 · 결과) 관련 타입을 정의하는 파일
 * 시각은 모두 ISO 문자열이며, 남은 시간은 endsAt - serverNow 로 계산함
 */
import type { ApiError } from "../apis/types";
import type { Topic, TopicCategory } from "./topic";

export type Stance = "AGREE" | "DISAGREE";

export type SessionStatus = "WAITING" | "IN_PROGRESS" | "FINISHED";

export type RoomType = "RANDOM";

export type SessionMode = "HUMAN" | "AI";

export type SessionPhase = "PREP" | "REVEAL" | "REBUTTAL" | "CHAT" | "JUDGING";

export type ParticipantType = "USER" | "AI";

export type ParticipantRole = "INITIATOR" | "OPPONENT";

export type FinishReason = "COMPLETED" | "FORFEIT" | "ABORTED";

/* ---------- 요청 ---------- */

// POST /sessions
export type CreateSessionRequest = {
  roomType: RoomType;
  topicId: number;
  stance: Stance;
};

// POST /sessions/bot
export type CreateBotSessionRequest = {
  topicId: number;
  stance: Stance;
};

// PUT /sessions/{id}/memo
export type MemoRequest = {
  content: string;
};

/* ---------- 응답 ---------- */

// 방 생성 · 입장 · 봇전 · 봇 전환 · 대기 취소 · 나가기 응답
export type SessionIdResponse = {
  sessionId: number;
};

// GET /sessions/current (참여 중인 세션이 없으면 data 가 null)
export type CurrentSession = {
  sessionId: number;
  status: SessionStatus;
};

// GET /sessions/waiting 의 방 카드
export type WaitingRoom = {
  sessionId: number;
  host: {
    nickname: string;
    philosopherType: string | null;
    // 철학자 유형 이미지 (유형이 없으면 기본 이미지)
    imageUrl: string;
  };
  topic: {
    id: number;
    statement: string;
  };
  // 들어가면 내가 맡게 되는 입장
  wantedStance: Stance;
};

export type WaitingRoomsResponse = {
  rooms: WaitingRoom[];
  hasNext: boolean;
};

export type SessionParticipant = {
  participantId: number;
  type: ParticipantType;
  role: ParticipantRole;
  stance: Stance;
  // 지금 작성 구간에서 제출했는지 (작성 구간이 아니면 null)
  submitted: boolean | null;
  nickname: string;
  philosopherType: string | null;
  // 철학자 유형 사진 (유형이 없으면 기본, 봇은 봇 사진)
  imageUrl: string;
  // 철학자 유형 말투로 쓴 입장 문장 (예: "만인의 투쟁이 시작되겠군")
  stanceText: string;
};

// GET /sessions/{id}/state
export type SessionState = {
  sessionId: number;
  status: SessionStatus;
  roomType: RoomType;
  mode: SessionMode;
  category: TopicCategory;
  topic: Topic;
  phase: SessionPhase;
  startedAt: string;
  endsAt: string | null;
  serverNow: string;
  myParticipantId: number;
  participants: SessionParticipant[];
};

/* ---------- 주장 · 반론 ---------- */

// GET /sessions/{id}/memo 항목 (작성 구간 순서대로)
export type SubmittedMemo = {
  phase: SessionPhase;
  content: string;
  submittedAt: string;
};

// GET /sessions/{id}/hints
// PENDING 이면 1.5초마다 다시 조회, READY · FAILED 면 멈춤
// FAILED 면 "힌트 보기" 비활성화
export type SessionHints = {
  status: ResultStatus;
  // 내 입장에 맞는 20자 이내 문장 3개 (READY 일 때만)
  hints?: string[];
};

/* ---------- 결과 ---------- */

export type ResultStatus = "PENDING" | "READY" | "FAILED";

// 화면에는 항상 논리 → 근거 → 반박 → 일관성 순서로 옴
export type CriterionKey = "LOGIC" | "EVIDENCE" | "REBUTTAL" | "CONSISTENCY";

export type ParticipantOutcome = "WIN" | "LOSE" | "DRAW";

export type ResultCriterion = {
  key: CriterionKey;
  summary: string;
};

export type ResultParticipant = {
  participantId: number;
  // 봇은 null
  nickname: string | null;
  philosopherType: string | null;
  // 철학자 유형 이미지 (유형이 없으면 기본, 봇은 봇 이미지)
  imageUrl: string;
  stance: Stance;
  isMe: boolean;
  // 게스트는 결과가 사라진 뒤 null
  result: ParticipantOutcome | null;
  // 기준마다 0~25점, 몰수패이거나 10분이 지나면 null
  scores: Record<CriterionKey, number> | null;
  total: number | null;
};

// GET /sessions/{id}/result
export type SessionResult = {
  status: ResultStatus;
  finishReason: FinishReason | null;
  // 무승부면 null
  winnerParticipantId: number | null;
  criteria: ResultCriterion[] | null;
  // 판정에 실패(FAILED)하면 null
  participants: ResultParticipant[] | null;
};

/* ---------- 실시간 이벤트 (/topic/sessions/{id}) ---------- */

// 공개된 주장 · 반론과 채팅 (GET /sessions/{id}/messages 응답 항목과 같은 모양)
export type SessionMessage = {
  type: "ARGUMENT" | "CHAT";
  seqNo: number;
  // 참가자 id (내 것인지는 myParticipantId 와 비교)
  senderId: number;
  phase: SessionPhase;
  content: string;
  receivedAt: string;
};

export type SessionEvent =
  | { type: "ARGUMENT_SUBMITTED"; senderId: number; phase: SessionPhase }
  | SessionMessage
  | {
      type: "PHASE_CHANGED";
      phase: SessionPhase;
      // JUDGING 이면 null
      endsAt: string | null;
      serverNow: string;
    }
  | { type: "FINAL_NOTICE"; endsAt: string }
  | { type: "OPPONENT_DISCONNECTED"; graceEndsAt: string }
  | { type: "OPPONENT_RECONNECTED" }
  | { type: "SESSION_FINISHED"; reason: FinishReason };

/* ---------- 방장 알림 (/user/queue/match) ---------- */

export type MatchEvent =
  | { type: "MATCHED"; sessionId: number }
  | { type: "WAIT_PROMPT"; sessionId: number; waitedSeconds: number }
  | { type: "WAIT_EXPIRED"; sessionId: number };

/* ---------- 에러 ---------- */

export type SessionErrorCode =
  | "ALREADY_IN_SESSION"
  | "SESSION_NOT_WAITING"
  | "CANNOT_JOIN_OWN_ROOM"
  | "NOT_ROOM_OWNER"
  | "NOT_PARTICIPANT"
  | "BOT_NOT_AVAILABLE_YET"
  | "SESSION_NOT_FOUND"
  | "TOPIC_NOT_FOUND"
  | "SESSION_NOT_IN_PROGRESS"
  | "SESSION_NOT_FINISHED"
  | "INVALID_PHASE"
  | "CONTENT_TOO_LONG"
  | "MESSAGE_LIMIT_EXCEEDED";

// /user/queue/errors 로 오는 채팅 에러 (REST 에러와 같은 형식)
export type SessionSocketError = ApiError;
