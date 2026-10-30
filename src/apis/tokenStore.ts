/**
 * 액세스 토큰을 메모리에만 보관하는 파일
 * 새로고침하면 사라지므로, 앱 시작 시 리프레시 쿠키로 재발급해 복구함
 */
import { clearProfileCache } from "../utils/profileCache";

let accessToken: string | null = null;
const listeners = new Set<() => void>();

export const getAccessToken = () => accessToken;

export const subscribeAccessToken = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const setAccessToken = (token: string) => {
  accessToken = token;
  listeners.forEach((listener) => listener());
};

export const clearAccessToken = () => {
  accessToken = null;
  // 로그아웃 · 로그인이 풀리면 기기에 저장한 내 정보도 지움 (다른 계정 정보가 비치지 않게)
  clearProfileCache();
  listeners.forEach((listener) => listener());
};
