/**
 * 실시간 연결(STOMP over WebSocket)을 관리하는 파일
 * 앱 전체에서 연결 하나를 같이 쓰며, 끊기면 자동으로 다시 연결하고 구독도 다시 걸어 줌
 * 토큰은 연결할 때만 검사하므로, 연결 · 재연결 직전에 토큰을 새로 받아서 붙임
 */
import { Client, type StompSubscription } from "@stomp/stompjs";
import { API_BASE_URL, refreshAccessToken } from "./client";
import { getAccessToken } from "./tokenStore";
import type {
  MatchEvent,
  SessionEvent,
  SessionSocketError,
} from "../types/session";

// http(s)://… → ws(s)://…/ws
const socketUrl = new URL("/ws", API_BASE_URL || window.location.origin);
socketUrl.protocol = socketUrl.protocol === "https:" ? "wss:" : "ws:";
const SOCKET_URL = socketUrl.toString();

// 상대 이탈 유예가 10초라서 그 안에 다시 붙도록 짧게 잡음
const RECONNECT_DELAY_MS = 2000;

type Listener = {
  destination: string;
  onMessage: (body: unknown) => void;
  subscription: StompSubscription | null;
};

// 지금 걸려 있어야 하는 구독 목록 (재연결하면 이 목록대로 다시 구독)
const listeners = new Set<Listener>();

// 연결 · 끊김을 알려 줄 곳 (재연결 뒤 /state · /messages 다시 불러오기 등)
const connectionListeners = new Set<(connected: boolean) => void>();

const attach = (listener: Listener) => {
  listener.subscription = client.subscribe(listener.destination, (message) => {
    listener.onMessage(JSON.parse(message.body));
  });
};

const notifyConnection = (connected: boolean) => {
  connectionListeners.forEach((callback) => callback(connected));
};

const client = new Client({
  brokerURL: SOCKET_URL,
  reconnectDelay: RECONNECT_DELAY_MS,

  beforeConnect: async () => {
    try {
      await refreshAccessToken();
    } catch {
      // 재발급에 실패하면 로그인이 풀린 상태라 다시 연결하지 않음
      await client.deactivate();
      return;
    }

    client.connectHeaders = { Authorization: `Bearer ${getAccessToken()}` };
  },

  onConnect: () => {
    listeners.forEach(attach);
    notifyConnection(true);
  },

  onWebSocketClose: () => {
    listeners.forEach((listener) => {
      listener.subscription = null;
    });
    notifyConnection(false);
  },
});

/* ---------- 연결 ---------- */

// 이미 연결 중이면 아무것도 하지 않음
export const connectSocket = () => {
  if (!client.active) {
    client.activate();
  }
};

export const disconnectSocket = async () => {
  await client.deactivate();
};

export const isSocketConnected = () => client.connected;

// 연결되면 true, 끊기면 false 로 호출됨 (해제 함수를 반환)
export const addConnectionListener = (
  callback: (connected: boolean) => void,
) => {
  connectionListeners.add(callback);

  return () => {
    connectionListeners.delete(callback);
  };
};

/* ---------- 구독 ---------- */

// 연결 전에 구독해도 연결되는 순간 걸림 (해제 함수를 반환)
const subscribe = <T>(destination: string, onMessage: (body: T) => void) => {
  const listener: Listener = {
    destination,
    onMessage: (body) => onMessage(body as T),
    subscription: null,
  };

  listeners.add(listener);

  if (client.connected) {
    attach(listener);
  }

  return () => {
    if (client.connected) {
      listener.subscription?.unsubscribe();
    }
    listeners.delete(listener);
  };
};

// 토론방 이벤트 (주장 공개 · 채팅 · 구간 변경 · 종료 등)
export const subscribeSession = (
  sessionId: number,
  onEvent: (event: SessionEvent) => void,
) => subscribe(`/topic/sessions/${sessionId}`, onEvent);

// 방장 알림 (매칭됨 · 대기 안내 · 대기 만료)
export const subscribeMatch = (onEvent: (event: MatchEvent) => void) =>
  subscribe("/user/queue/match", onEvent);

// 채팅 전송 에러 (글자 수 초과 · 횟수 초과 등)
export const subscribeErrors = (
  onError: (error: SessionSocketError) => void,
) => subscribe("/user/queue/errors", onError);

/* ---------- 보내기 ---------- */

// 연결이 끊겨 있으면 보내지 않고 false 를 반환
export const sendChat = (sessionId: number, content: string) => {
  if (!client.connected) {
    return false;
  }

  client.publish({
    destination: `/app/sessions/${sessionId}/chat`,
    body: JSON.stringify({ content }),
  });

  return true;
};
