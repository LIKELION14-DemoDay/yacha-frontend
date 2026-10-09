/**
 * 인증 관련 백엔드 API 요청을 관리하는 파일
 */
import api from "./client";

export const kakaoLogin = async (code: string, redirectUri: string) => {
  const response = await api.post("/api/v1/auth/social/kakao", {
    code,
    redirectUri,
  });

  return response.data;
};

export const googleLogin = async (code: string, redirectUri: string) => {
  const response = await api.post("/api/v1/auth/social/google", {
    code,
    redirectUri,
  });

  return response.data;
};
