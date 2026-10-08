/**
 * 구글 로그인 완료 후 Redirect되는 OAuth 콜백 페이지
 * URL에서 구글 인가 코드(code)와 state를 추출하고,
 * state 검증 후 인가 코드를 백엔드로 전달하여 로그인 처리를 완료
 */

import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { googleLogin } from "../apis/auth";
import { getGoogleRedirectUri, validateGoogleState } from "../utils/google";

function GoogleCallbackPage() {
  const navigate = useNavigate();

  // useEffect가 두 번 실행되는 것 방지
  const isProcessed = useRef(false);

  useEffect(() => {
    if (isProcessed.current) return;
    isProcessed.current = true;

    const handleGoogleCallback = async () => {
      const params = new URLSearchParams(window.location.search);

      const code = params.get("code");
      const state = params.get("state");
      const error = params.get("error");

      if (error) {
        console.error("구글 로그인 취소 또는 실패:", error);
        navigate("/login");
        return;
      }

      if (!code) {
        console.error("구글 인가 코드가 없습니다.");
        navigate("/login");
        return;
      }

      if (!validateGoogleState(state)) {
        console.error("구글 OAuth state 검증에 실패했습니다.");
        navigate("/login");
        return;
      }

      try {
        const redirectUri = getGoogleRedirectUri();

        const response = await googleLogin(code, redirectUri);

        console.log("구글 로그인 성공:", response);

        navigate("/");
      } catch (error) {
        console.error("구글 로그인 API 요청 실패:", error);

        navigate("/login");
      }
    };

    handleGoogleCallback();
  }, [navigate]);

  return <div>구글 로그인 처리 중...</div>;
}

export default GoogleCallbackPage;
