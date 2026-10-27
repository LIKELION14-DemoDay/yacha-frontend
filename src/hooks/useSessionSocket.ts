/**
 * 토론방에서 실시간 연결을 쓰는 훅
 * 들어오면 연결 · 구독하고, 나가면 끊음
 * 연결될 때마다(처음 · 재연결) /state 와 놓친 메시지를 다시 불러와서 화면을 서버와 맞춤
 */
import { useCallback, useEffect, useRef, useState } from "react";
import {
  addConnectionListener,
  connectSocket,
  disconnectSocket,
  sendChat as sendChatMessage,
  subscribeErrors,
  subscribeSession,
} from "../apis/socket";
import { getMessages, getSessionState } from "../apis/sessions";
import type {
  SessionEvent,
  SessionSocketError,
  SessionState,
} from "../types/session";

type UseSessionSocketOptions = {
  // 실시간 이벤트 + 재연결 때 다시 받은 놓친 메시지
  onEvent: (event: SessionEvent) => void;
  // 연결될 때마다 받은 최신 상태 (구간 · 남은 시간 맞추기)
  onSync?: (state: SessionState) => void;
  // 채팅 전송 에러 (글자 수 초과 · 횟수 초과 등)
  onError?: (error: SessionSocketError) => void;
};

export const useSessionSocket = (
  sessionId: number | null,
  { onEvent, onSync, onError }: UseSessionSocketOptions,
) => {
  const [connected, setConnected] = useState(false);

  // 콜백이 바뀌어도 다시 구독하지 않도록 최신 콜백만 따로 들고 있음
  const callbacksRef = useRef({ onEvent, onSync, onError });

  useEffect(() => {
    callbacksRef.current = { onEvent, onSync, onError };
  });

  useEffect(() => {
    if (sessionId === null) {
      return;
    }

    // 마지막으로 받은 메시지 번호 (놓친 메시지 조회 기준 · 중복 거르기)
    let lastSeqNo = 0;
    let disposed = false;

    const handleEvent = (event: SessionEvent) => {
      if (event.type === "ARGUMENT" || event.type === "CHAT") {
        if (event.seqNo <= lastSeqNo) {
          return;
        }
        lastSeqNo = event.seqNo;
      }

      callbacksRef.current.onEvent(event);
    };

    const sync = async () => {
      const [state, messages] = await Promise.all([
        getSessionState(sessionId),
        getMessages(sessionId, lastSeqNo),
      ]);

      if (disposed) {
        return;
      }

      callbacksRef.current.onSync?.(state);
      messages.forEach(handleEvent);
    };

    const unsubscribeSession = subscribeSession(sessionId, handleEvent);
    const unsubscribeErrors = subscribeErrors((error) => {
      callbacksRef.current.onError?.(error);
    });
    const removeConnectionListener = addConnectionListener((isConnected) => {
      setConnected(isConnected);

      if (isConnected) {
        // 실패해도 다음 재연결 때 다시 맞추므로 여기서는 넘어감
        sync().catch(() => {});
      }
    });

    connectSocket();

    return () => {
      disposed = true;
      unsubscribeSession();
      unsubscribeErrors();
      removeConnectionListener();
      setConnected(false);
      void disconnectSocket();
    };
  }, [sessionId]);

  // 연결이 끊겨 있으면 보내지 않고 false 를 반환
  const sendChat = useCallback(
    (content: string) =>
      sessionId === null ? false : sendChatMessage(sessionId, content),
    [sessionId],
  );

  return { connected, sendChat };
};
