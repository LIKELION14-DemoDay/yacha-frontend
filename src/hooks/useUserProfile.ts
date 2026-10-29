import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { clearAccessToken } from "../apis/tokenStore";
import { getMyProfile } from "../apis/users";
import type { UserProfile } from "../types/user";
import { getApiErrorCode } from "../utils/apiError";

export const useUserProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    getMyProfile(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setProfile(data);
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;

        // 클라이언트의 토큰 재발급까지 실패한 경우 재조회 대신 다시 로그인합니다.
        if (
          (axios.isAxiosError(error) && error.response?.status === 401) ||
          getApiErrorCode(error) === "UNAUTHORIZED"
        ) {
          clearAccessToken();
          navigate("/login", { replace: true });
        }
      });

    return () => controller.abort();
  }, [navigate]);

  return { profile };
};
