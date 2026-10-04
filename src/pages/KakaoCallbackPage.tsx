import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { kakaoLogin } from "../apis/auth";
import { getKakaoRedirectUri, validateKakaoState } from "../utils/kakao";

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
        console.error("카카오 로그인 취소 또는 실패:", error);
        navigate("/login");
        return;
      }

      if (!code) {
        console.error("카카오 인가 코드가 없습니다.");
        navigate("/login");
        return;
      }

      if (!validateKakaoState(state)) {
        console.error("카카오 OAuth state 검증에 실패했습니다.");
        navigate("/login");
        return;
      }

      try {
        const redirectUri = getKakaoRedirectUri();

        const response = await kakaoLogin(code, redirectUri);

        console.log("카카오 로그인 성공:", response);

        navigate("/");
      } catch (error) {
        console.error("카카오 로그인 API 요청 실패:", error);

        navigate("/login");
      }
    };

    handleKakaoCallback();
  }, [navigate]);

  return <div>카카오 로그인 처리 중...</div>;
}

export default KakaoCallbackPage;
