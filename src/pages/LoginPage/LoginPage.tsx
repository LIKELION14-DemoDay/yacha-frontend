import axios from "axios";
import { useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { login } from "../../apis/auth";
import type { ApiResponse } from "../../apis/types";
import arrowRight from "../../assets/arrow-right.svg";
import googleLogo from "../../assets/google-logo.svg";
import kakaoLogin from "../../assets/kakao_login.svg";
import loginLogo from "../../assets/login-logo.svg?raw";
import LongButton from "../../components/Button";
import InputContainer from "../../components/InputContainer";
import StatusBar from "../../components/StatusBar";
import { startGoogleLogin } from "../../utils/google";
import { startKakaoLogin } from "../../utils/kakao";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const isRequestPending = useRef(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isRequestPending.current) return;

    isRequestPending.current = true;
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await login({ email: email.trim(), password });
      navigate("/home", { replace: true });
    } catch (error: unknown) {
      if (
        axios.isAxiosError<ApiResponse<null>>(error) &&
        (error.response?.status === 401 ||
          error.response?.data?.error?.code === "LOGIN_FAILED")
      ) {
        setErrorMessage("아이디 또는 비밀번호가 일치하지 않습니다.");
      } else if (axios.isAxiosError(error) && !error.response) {
        setErrorMessage("서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.");
      } else {
        setErrorMessage("로그인에 실패했습니다. 잠시 후 다시 시도해주세요.");
      }
    } finally {
      isRequestPending.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto flex h-dvh min-h-166.75 w-full max-w-100.5 flex-col overflow-hidden bg-secondary">
      <StatusBar />

      <section className="flex shrink-0 flex-col items-center pt-30 pb-10">
        <span
          className="text-white"
          role="img"
          aria-label="야차철학"
          dangerouslySetInnerHTML={{ __html: loginLogo }}
        />
      </section>

      <form
        onSubmit={handleSubmit}
        aria-label="이메일 로그인"
        aria-busy={isSubmitting}
        className="shrink-0"
      >
        <div className="flex flex-col gap-5 py-6">
          <InputContainer
            label="아이디"
            type="email"
            name="email"
            autoComplete="email"
            placeholder="이메일@example.com"
            required
            value={email}
            disabled={isSubmitting}
            onChange={(event) => {
              setEmail(event.currentTarget.value);
              setErrorMessage("");
            }}
            clearable
            onClear={() => {
              setEmail("");
              setErrorMessage("");
            }}
          />
          <InputContainer
            label="비밀번호"
            type="password"
            name="password"
            autoComplete="current-password"
            placeholder="비밀번호를 입력하세요."
            required
            value={password}
            disabled={isSubmitting}
            errorMessage={
              errorMessage ? <span role="alert">{errorMessage}</span> : undefined
            }
            onChange={(event) => {
              setPassword(event.currentTarget.value);
              setErrorMessage("");
            }}
          />
        </div>

        <div className="px-6 py-2">
          <LongButton
            type="submit"
            disabled={isSubmitting || !email.trim() || !password}
            className="!bg-main !text-white hover:!bg-main-006 disabled:!bg-neutral-008"
          >
            {isSubmitting ? "로그인 중..." : "로그인"}
          </LongButton>
        </div>
      </form>

      <section className="flex h-30 shrink-0 flex-col">
        <div className="flex items-center justify-center gap-10 py-2.5 text-body-r6 text-neutral-007">
          <button type="button" className="cursor-pointer">
            비밀번호 찾기
          </button>
          <span aria-hidden="true">|</span>
          <button
            type="button"
            onClick={() => navigate("/signin")}
            className="cursor-pointer"
          >
            회원가입
          </button>
        </div>

        <div className="flex items-center justify-center gap-1 pt-4 pb-10">
          <button
            type="button"
            className="flex cursor-pointer items-center gap-1 text-body-m3 text-main"
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
