/**
 * 참여 중인 세션으로 돌아갈 주소
 * 대기 중이면 매칭 대기 화면, 진행 중이면 토론방 (없거나 끝난 게임이면 null)
 */
import { getCurrentSession } from "../apis/sessions";

export const getCurrentSessionPath = async () => {
  const current = await getCurrentSession();

  switch (current?.status) {
    case "WAITING":
      return `/game/waiting/${current.sessionId}`;
    case "IN_PROGRESS":
      return `/game/${current.sessionId}`;
    default:
      return null;
  }
};
