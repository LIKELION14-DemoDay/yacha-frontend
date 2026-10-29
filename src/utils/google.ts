/**
 * 구글 SDK 로그인과 기존 인가 코드 콜백에 필요한 값을 관리합니다.
 */

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const GOOGLE_STATE_KEY = "google_oauth_state";

type GoogleIdentity = {
  initialize: (options: {
    client_id: string;
    callback: (response: { credential: string }) => void;
    auto_select: boolean;
  }) => void;
  renderButton: (
    element: HTMLElement,
    options: {
      theme: "outline";
      size: "large";
      shape: "rectangular";
      text: "signin_with";
      width: number;
      locale: "ko";
    },
  ) => void;
};

declare global {
  interface Window {
    google?: { accounts: { id: GoogleIdentity } };
  }
}

let sdkPromise: Promise<GoogleIdentity> | null = null;
let pendingIdToken: string | null = null;

// 로그인 페이지에서 콜백 페이지로 전달할 ID 토큰은 메모리에만 잠시 보관합니다.
export const storeGoogleCredential = (idToken: string) => {
  pendingIdToken = idToken;
};

export const consumeGoogleCredential = () => {
  const token = pendingIdToken;
  pendingIdToken = null;
  return token;
};

export const loadGoogleIdentity = (): Promise<GoogleIdentity> => {
  if (!GOOGLE_CLIENT_ID) {
    return Promise.reject(new Error("구글 클라이언트 ID가 설정되지 않았습니다."));
  }
  if (window.google?.accounts?.id) {
    return Promise.resolve(window.google.accounts.id);
  }

  if (!sdkPromise) {
    sdkPromise = new Promise<GoogleIdentity>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.onload = () => {
        if (window.google?.accounts?.id) {
          resolve(window.google.accounts.id);
        } else {
          script.remove();
          reject(new Error("구글 로그인을 초기화하지 못했습니다."));
        }
      };
      script.onerror = () => {
        script.remove();
        reject(new Error("구글 로그인에 연결할 수 없습니다."));
      };
      document.head.appendChild(script);
    }).catch((error: unknown) => {
      sdkPromise = null;
      throw error;
    });
  }
  return sdkPromise;
};

export const initializeGoogleIdentity = (
  identity: GoogleIdentity,
  onCredential: (idToken: string) => void,
) => {
  identity.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: ({ credential }) => onCredential(credential),
    auto_select: false,
  });
};

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
