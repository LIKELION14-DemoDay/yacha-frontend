import googleLogo from "../assets/google-logo.svg";
import { startGoogleLogin } from "../utils/google";
import { startKakaoLogin } from "../utils/kakao";

function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-5">
      <h1 className="text-headline-3sb">로그인 페이지</h1>

      <button
        type="button"
        onClick={startKakaoLogin}
        className="flex h-13 w-full max-w-80 items-center justify-center gap-2 rounded-xl bg-yellow text-body-m3 text-black"
      >
        카카오로 로그인
      </button>

      <button
        type="button"
        onClick={startGoogleLogin}
        className="flex h-13 w-full max-w-80 items-center justify-center gap-2 rounded-xl bg-neutral-001 text-body-m3 text-black"
      >
        <img src={googleLogo} alt="" />
        구글로 로그인
      </button>
    </main>
  );
}

export default LoginPage;
