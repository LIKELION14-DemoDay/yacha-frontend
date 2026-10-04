const KAKAO_REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;

const KAKAO_STATE_KEY = "kakao_oauth_state";

export const getKakaoRedirectUri = () => {
  return `${window.location.origin}/oauth/kakao`;
};

const createState = () => {
  return crypto.randomUUID();
};

export const startKakaoLogin = () => {
  if (!KAKAO_REST_API_KEY) {
    throw new Error("카카오 REST API 키가 설정되지 않았습니다.");
  }

  const redirectUri = getKakaoRedirectUri();
  const state = createState();

  sessionStorage.setItem(KAKAO_STATE_KEY, state);

  const params = new URLSearchParams({
    client_id: KAKAO_REST_API_KEY,
    redirect_uri: redirectUri,
    response_type: "code",
    state,
  });

  window.location.href = `https://kauth.kakao.com/oauth/authorize?${params.toString()}`;
};

export const validateKakaoState = (returnedState: string | null) => {
  const savedState = sessionStorage.getItem(KAKAO_STATE_KEY);

  sessionStorage.removeItem(KAKAO_STATE_KEY);

  if (!returnedState || !savedState) {
    return false;
  }

  return returnedState === savedState;
};
