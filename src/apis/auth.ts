import api from "./client";

export const kakaoLogin = async (code: string, redirectUri: string) => {
  const response = await api.post("/api/v1/auth/social/kakao", {
    code,
    redirectUri,
  });

  return response.data;
};
