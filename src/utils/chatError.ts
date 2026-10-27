/**
 * 채팅 전송 에러(/user/queue/errors)를 화면에 띄울 문구로 바꾸는 함수
 */
import type { SessionSocketError } from "../types/session";

const CHAT_ERROR_MESSAGES: Record<string, string> = {
  CONTENT_TOO_LONG: "메시지는 100자까지 보낼 수 있어요.",
  MESSAGE_LIMIT_EXCEEDED: "채팅은 200번까지 보낼 수 있어요.",
  INVALID_PHASE: "지금은 채팅할 수 없어요.",
  SESSION_NOT_IN_PROGRESS: "이미 끝난 게임이에요.",
};

export const getChatErrorMessage = (error: SessionSocketError) =>
  CHAT_ERROR_MESSAGES[error.code] ?? "메시지를 보내지 못했어요.";
