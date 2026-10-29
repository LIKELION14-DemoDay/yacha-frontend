/**
 * 액세스 토큰을 메모리에만 보관하는 파일
 * 새로고침하면 사라지므로, 앱 시작 시 리프레시 쿠키로 재발급해 복구함
 */

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
  listeners.forEach((listener) => listener());
};
