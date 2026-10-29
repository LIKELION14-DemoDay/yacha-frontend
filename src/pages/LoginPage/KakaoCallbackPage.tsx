/**
 * 카카오 로그인 완료 후 Redirect되는 OAuth 콜백 페이지
 * URL에서 카카오 인가 코드(code)와 state를 추출하고,
 * state 검증 후 인가 코드를 백엔드로 전달하여 로그인 처리를 완료
 */

import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { kakaoLogin } from "../../apis/auth";
import { getKakaoRedirectUri, validateKakaoState } from "../../utils/kakao";
import { getApiErrorMessage } from "../../utils/apiError";

function KakaoCallbackPage() {
  const navigate = useNavigate();

  // 개발 환경 StrictMode에서 useEffect가 두 번 실행되는 것 방지
  const isProcessed = useRef(false);

  useEffect(() => {
    if (isProcessed.current) return;
    isProcessed.current = true;

    const handleKakaoCallback = async () => {
      const params = new URLSearchParams(window.location.search);

      const code = params.get("code");
      const state = params.get("state");
      const error = params.get("error");

      if (error) {
        navigate("/login", { replace: true });
        return;
      }

      if (!code) {
        navigate("/login", { replace: true });
        return;
      }

      if (!validateKakaoState(state)) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        const redirectUri = getKakaoRedirectUri();

        const response = await kakaoLogin(code, redirectUri);
        navigate(response.data.isNewUser ? "/my/setting" : "/home", {
          replace: true,
          state: response.data.isNewUser ? { initialSetup: true } : undefined,
        });
      } catch (error: unknown) {
        navigate("/login", {
          replace: true,
          state: { socialError: getApiErrorMessage(error) },
        });
      }
    };

    handleKakaoCallback();
  }, [navigate]);

  return null;
}

export default KakaoCallbackPage;
