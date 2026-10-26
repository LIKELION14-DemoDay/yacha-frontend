import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import angleLeft from "../assets/angle-left.svg";
import LongButton from "../components/Button";
import InputContainer from "../components/InputContainer";
import StatusBar from "../components/StatusBar";

type SignUpStep = "nickname" | "email" | "password";
type FieldName = SignUpStep | "passwordConfirmation";

const instructions: Record<SignUpStep, string> = {
  nickname: "닉네임을 만들어주세요.",
  email: "아이디를 작성해주세요.",
  password: "비밀번호를 작성해주세요.",
};

function SignInPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<SignUpStep>("nickname");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [focusedField, setFocusedField] = useState<FieldName | null>(null);
  const [emailChecked, setEmailChecked] = useState(false);
  const [passwordChecked, setPasswordChecked] = useState(false);
  const [confirmationChecked, setConfirmationChecked] = useState(false);

  const hasNickname = nickname.trim().length > 0;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isPasswordValid = password.length >= 8;
  const passwordsMatch =
    passwordConfirmation.length > 0 && password === passwordConfirmation;

  const emailError =
    emailChecked && !isEmailValid ? "올바른 이메일을 입력해주세요." : undefined;
  const passwordError =
    passwordChecked && !isPasswordValid ? "8자 이상 입력해주세요." : undefined;
  const confirmationError =
    confirmationChecked && !passwordsMatch
      ? "비밀번호가 일치하지 않습니다."
      : undefined;
  const isNextDisabled =
    !hasNickname || (step === "email" && email.trim().length === 0);

  const handleBack = () => {
    navigate("/login");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!hasNickname) return;

    if (step === "nickname") {
      setStep("email");
      return;
    }

    setEmailChecked(true);
    if (!isEmailValid) {
      setStep("email");
      return;
    }

    if (step === "email") {
      setStep("password");
      return;
    }

    setPasswordChecked(true);
    setConfirmationChecked(true);
    if (!isPasswordValid || !passwordsMatch) return;
  };

  return (
    <main className="mx-auto flex h-dvh min-h-166.75 w-full max-w-100.5 flex-col bg-secondary">
      <form
        noValidate
        onSubmit={handleSubmit}
        className="flex min-h-0 flex-1 flex-col justify-between"
      >
        <div className="min-h-0 flex-1 overflow-y-auto">
          <StatusBar />

          <header className="flex h-12 items-center gap-2.5 px-6 py-2 text-white">
            <button
              type="button"
              onClick={handleBack}
              aria-label="로그인 페이지로 돌아가기"
              className="flex h-8 w-6 shrink-0 cursor-pointer items-center justify-center"
            >
              <img src={angleLeft} alt="" className="size-6" />
            </button>
            <h1 className="text-subhead-m5">야차철학 회원가입</h1>
          </header>

          <div className="px-6 pt-8 pb-6" aria-live="polite">
            <h2 className="text-subhead-m5 text-white">
              야차철학에서 사용할
              <br />
              {instructions[step]}
            </h2>
          </div>

          <div className="flex flex-col items-start gap-5 py-6">
            <InputContainer
              label="닉네임"
              name="nickname"
              autoComplete="nickname"
              placeholder="닉네임을 입력해주세요."
              required
              value={nickname}
              onChange={(event) => setNickname(event.currentTarget.value)}
              clearable={focusedField === "nickname"}
              onClear={() => setNickname("")}
              onFocus={() => setFocusedField("nickname")}
              onBlur={() => setFocusedField(null)}
            />

            {step !== "nickname" && (
              <InputContainer
                label="아이디"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="이메일@example.com"
                required
                value={email}
                errorMessage={emailError}
                onChange={(event) => {
                  setEmail(event.currentTarget.value);
                  setEmailChecked(false);
                }}
                clearable={focusedField === "email"}
                onClear={() => {
                  setEmail("");
                  setEmailChecked(false);
                }}
                onFocus={() => setFocusedField("email")}
                onBlur={() => {
                  setFocusedField(null);
                  if (email.length > 0) setEmailChecked(true);
                }}
              />
            )}

            {step === "password" && (
              <div className="flex w-full flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <InputContainer
                    label="비밀번호"
                    type="password"
                    name="password"
                    autoComplete="new-password"
                    placeholder="비밀번호를 입력해주세요."
                    required
                    minLength={8}
                    value={password}
                    errorMessage={passwordError}
                    aria-describedby="signup-password-hint"
                    onChange={(event) => setPassword(event.currentTarget.value)}
                    clearable={focusedField === "password"}
                    onClear={() => setPassword("")}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => {
                      setFocusedField(null);
                      if (password.length > 0) setPasswordChecked(true);
                    }}
                  />
                  <p
                    id="signup-password-hint"
                    className="px-6 text-body-r6 text-neutral-007"
                  >
                    *비밀번호는 8자 이상이어야 합니다.
                  </p>
                </div>

                <InputContainer
                  label="비밀번호 확인"
                  type="password"
                  name="passwordConfirmation"
                  autoComplete="new-password"
                  placeholder="비밀번호를 한번 더 입력해주세요."
                  required
                  value={passwordConfirmation}
                  errorMessage={confirmationError}
                  onChange={(event) =>
                    setPasswordConfirmation(event.currentTarget.value)
                  }
                  clearable={focusedField === "passwordConfirmation"}
                  onClear={() => setPasswordConfirmation("")}
                  onFocus={() => setFocusedField("passwordConfirmation")}
                  onBlur={() => {
                    setFocusedField(null);
                    if (passwordConfirmation.length > 0) {
                      setConfirmationChecked(true);
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-3 px-6 pt-2.5 pb-12.5">
          <LongButton
            type="submit"
            disabled={isNextDisabled}
            className={
              step === "password"
                ? "!bg-main !text-white hover:!bg-main-006 disabled:!bg-neutral-008"
                : "!bg-neutral-008 !text-white"
            }
          >
            {step === "password" ? "시작하기" : "다음"}
          </LongButton>
        </div>
      </form>
    </main>
  );
}

export default SignInPage;
