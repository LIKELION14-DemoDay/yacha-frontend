/**
 * 구글 OAuth 인가 코드 방식 로그인을 처리하는 유틸리티 파일
 * 구글 인증 URL을 생성하고 로그인 페이지로 이동시키며,
 * Redirect URI 생성과 OAuth CSRF 방지를 위한 state 생성 및 검증을 담당
 */

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const GOOGLE_STATE_KEY = "google_oauth_state";

export const getGoogleRedirectUri = () => {
  return `${window.location.origin}/oauth/google`;
};

const createState = () => {
  return crypto.randomUUID();
};

export const startGoogleLogin = () => {
  if (!GOOGLE_CLIENT_ID) {
    throw new Error("구글 클라이언트 ID가 설정되지 않았습니다.");
  }

  const redirectUri = getGoogleRedirectUri();
  const state = createState();

  sessionStorage.setItem(GOOGLE_STATE_KEY, state);

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: "code",
    // openid가 빠지면 백엔드에서 로그인 처리가 되지 않음
    scope: "openid email profile",
    state,
  });

  window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};

export const validateGoogleState = (returnedState: string | null) => {
  const savedState = sessionStorage.getItem(GOOGLE_STATE_KEY);

  sessionStorage.removeItem(GOOGLE_STATE_KEY);

  if (!returnedState || !savedState) {
    return false;
  }

  return returnedState === savedState;
};
