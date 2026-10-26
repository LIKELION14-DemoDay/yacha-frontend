import arrowRight from "../assets/arrow-right.svg";
import googleLogo from "../assets/google-logo.svg";
import kakaoLogin from "../assets/kakao_login.svg";
import loginLogo from "../assets/login-logo.svg";
import LongButton from "../components/Button";
import InputContainer from "../components/InputContainer";
import StatusBar from "../components/StatusBar";
import { startGoogleLogin } from "../utils/google";
import { startKakaoLogin } from "../utils/kakao";

function LoginPage() {
  return (
    <main className="mx-auto flex h-dvh min-h-166.75 w-full max-w-100.5 flex-col overflow-hidden bg-secondary">
      <StatusBar />

      <section className="flex shrink-0 flex-col items-center pt-30 pb-10">
        <img src={loginLogo} alt="야차철학" />
      </section>

      <section className="shrink-0">
        <div className="flex flex-col gap-5 py-6">
          <InputContainer
            label="아이디"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="이메일@example.com"
            clearable
          />
          <InputContainer
            label="비밀번호"
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="비밀번호를 입력하세요."
          />
        </div>

        <div className="px-6 py-2">
          <LongButton className="!bg-main !text-white hover:!bg-main-006">
            로그인
          </LongButton>
        </div>
      </section>

      <section className="flex h-30 shrink-0 flex-col">
        <div className="flex items-center justify-center gap-10 py-2.5 text-body-r6 text-neutral-002">
          <button type="button" className="cursor-pointer">
            비밀번호 찾기
          </button>
          <span aria-hidden="true">|</span>
          <button type="button" className="cursor-pointer">
            회원가입
          </button>
        </div>

        <div className="flex items-center justify-center gap-1 pt-4 pb-10">
          <button
            type="button"
            className="flex cursor-pointer items-center gap-1 text-body-r6 text-main"
          >
            비회원으로 시작하기
            <img src={arrowRight} alt="" className="size-6" />
          </button>
        </div>
      </section>

      <section className="shrink-0">
        <div className="flex items-center justify-center gap-2 px-6 py-2.5 text-body-r6 text-neutral-005">
          <span className="h-px flex-1 bg-neutral-005" aria-hidden="true" />
          <span>소셜로그인</span>
          <span className="h-px flex-1 bg-neutral-005" aria-hidden="true" />
        </div>

        <div className="grid grid-cols-2 gap-3 px-6 py-2.5">
          <button
            type="button"
            onClick={startKakaoLogin}
            className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-yellow text-body-r6 text-[#191919]"
          >
            <img src={kakaoLogin} alt="" className="h-[15px] w-[17px]" />
            카카오 로그인
          </button>

          <button
            type="button"
            onClick={startGoogleLogin}
            className="flex h-11 cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-neutral-002 text-body-r6 text-[#191919]"
          >
            <img src={googleLogo} alt="" className="size-5" />
            구글로 로그인
          </button>
        </div>
      </section>
    </main>
  );
}

export default LoginPage;
