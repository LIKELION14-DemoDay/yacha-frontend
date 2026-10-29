/**
 * 참여 중인 게임이 있으면 그 화면으로 바로 보내는 훅 (홈 진입 시)
 * 앱을 껐다 켜거나 게임 도중 홈으로 나와도 이어서 할 수 있게 함
 */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getCurrentSessionPath } from "../utils/currentSession";

export const useResumeSession = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let ignore = false;

    getCurrentSessionPath()
      .then((path) => {
        if (!ignore && path) navigate(path, { replace: true });
      })
      .catch(() => {
        // 조회에 실패하면 그냥 홈에 머무름
      });

    return () => {
      ignore = true;
    };
  }, [navigate]);
};
