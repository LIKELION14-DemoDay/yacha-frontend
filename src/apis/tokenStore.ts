/**
 * 액세스 토큰을 메모리에만 보관하는 파일
 * 새로고침하면 사라지므로, 앱 시작 시 리프레시 쿠키로 재발급해 복구함
 */

let accessToken: string | null = null;

export const getAccessToken = () => accessToken;

export const setAccessToken = (token: string) => {
  accessToken = token;
};

export const clearAccessToken = () => {
  accessToken = null;
};
