/**
 * 구글 로그인 완료 후 Redirect되는 OAuth 콜백 페이지
 * SDK의 ID 토큰으로 로그인하고, 기존 인가 코드 콜백도 처리합니다.
 */

import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { googleLogin, socialLogin } from "../../apis/auth";
import {
  consumeGoogleCredential,
  getGoogleRedirectUri,
  validateGoogleState,
} from "../../utils/google";
import { getApiErrorMessage } from "../../utils/apiError";

function GoogleCallbackPage() {
  const navigate = useNavigate();

  // useEffect가 두 번 실행되는 것 방지
  const isProcessed = useRef(false);

  useEffect(() => {
    if (isProcessed.current) return;
    isProcessed.current = true;

    const handleGoogleCallback = async () => {
      try {
        const idToken = consumeGoogleCredential();
        let response;

        if (idToken) {
          response = await socialLogin({ provider: "GOOGLE", idToken });
        } else {
          // 이미 진행 중인 기존 인가 코드 로그인도 같은 콜백에서 처리합니다.
          const params = new URLSearchParams(window.location.search);
          const code = params.get("code");
          if (
            params.get("error") ||
            !code ||
            !validateGoogleState(params.get("state"))
          ) {
            navigate("/login", { replace: true });
            return;
          }
          response = await googleLogin(code, getGoogleRedirectUri());
        }

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

    handleGoogleCallback();
  }, [navigate]);

  return null;
}

export default GoogleCallbackPage;
