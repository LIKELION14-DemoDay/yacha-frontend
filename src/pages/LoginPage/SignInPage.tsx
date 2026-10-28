import axios from "axios";
import { useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { checkEmailAvailability, signUp } from "../../apis/auth";
import type { ApiResponse } from "../../apis/types";
import angleLeft from "../../assets/angle-left.svg";
import LongButton from "../../components/Button";
import InputContainer from "../../components/InputContainer";
import StatusBar from "../../components/StatusBar";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [checkedEmail, setCheckedEmail] = useState<string | null>(null);
  const [emailServerError, setEmailServerError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const isRequestPending = useRef(false);
  const isBusy = isSubmitting || isCheckingEmail;
  const normalizedEmail = email.trim().toLowerCase();

  const hasNickname = nickname.trim().length > 0;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isPasswordValid = password.length >= 8 && password.length <= 72;
  const passwordsMatch =
    passwordConfirmation.length > 0 && password === passwordConfirmation;

  const emailError =
    emailChecked && !isEmailValid
      ? "올바른 이메일을 입력해주세요."
      : emailServerError || undefined;
  const passwordError =
    passwordChecked && !isPasswordValid
      ? "8자 이상 72자 이하로 입력해주세요."
      : undefined;
  const confirmationError =
    confirmationChecked && !passwordsMatch
      ? "비밀번호가 일치하지 않습니다."
      : undefined;
  const isNextDisabled =
    isBusy ||
    !hasNickname ||
    (step === "email" && email.trim().length === 0);

  const clearServerErrors = () => {
    setSubmitError("");
  };

  const handleBack = () => {
    navigate("/login");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isRequestPending.current || !hasNickname) return;
    clearServerErrors();

    if (step === "nickname") {
      setStep("email");
      return;
    }

    setEmailChecked(true);
    if (!isEmailValid) {
      setStep("email");
      return;
    }

    if (step === "email" || checkedEmail !== normalizedEmail) {
      isRequestPending.current = true;
      setIsCheckingEmail(true);
      setEmailServerError("");

      try {
        const available = await checkEmailAvailability(normalizedEmail);
        if (!available) {
          setCheckedEmail(null);
          setEmailServerError("이미 가입된 이메일입니다.");
          setStep("email");
          return;
        }

        setCheckedEmail(normalizedEmail);
        setStep("password");
      } catch (error: unknown) {
        setCheckedEmail(null);
        setStep("email");

        if (axios.isAxiosError(error) && error.response?.status === 429) {
          setEmailServerError("요청이 너무 많습니다. 잠시 후 다시 시도해주세요.");
        } else if (axios.isAxiosError(error) && error.response?.status === 400) {
          setEmailServerError("이메일의 형식과 길이를 확인해주세요.");
        } else if (axios.isAxiosError(error) && !error.response) {
          setEmailServerError("서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.");
        } else {
          setEmailServerError("이메일 중복 확인에 실패했습니다. 다시 시도해주세요.");
        }
      } finally {
        isRequestPending.current = false;
        setIsCheckingEmail(false);
      }

      return;
    }

    setPasswordChecked(true);
    setConfirmationChecked(true);
    if (!isPasswordValid || !passwordsMatch) return;

    isRequestPending.current = true;
    setIsSubmitting(true);

    try {
      const response = await signUp({
        nickname: nickname.trim(),
        email: normalizedEmail,
        password,
      });

      navigate("/complete", {
        replace: true,
        state: { nickname: response.data.nickname },
      });
    } catch (error: unknown) {
      if (
        axios.isAxiosError<ApiResponse<null>>(error) &&
        error.response?.data?.error?.code === "EMAIL_ALREADY_EXISTS"
      ) {
        setCheckedEmail(null);
        setEmailServerError("이미 가입된 이메일입니다.");
        setStep("email");
      } else if (
        axios.isAxiosError<ApiResponse<null>>(error) &&
        error.response?.data?.error?.code === "VALIDATION_FAILED"
      ) {
        setSubmitError("입력한 회원정보의 형식과 길이를 확인해주세요.");
      } else if (axios.isAxiosError(error) && !error.response) {
        setSubmitError("서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.");
      } else {
        setSubmitError("회원가입에 실패했습니다. 잠시 후 다시 시도해주세요.");
      }
    } finally {
      isRequestPending.current = false;
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto flex h-dvh min-h-166.75 w-full max-w-100.5 flex-col bg-secondary">
      <form
        noValidate
        onSubmit={handleSubmit}
        aria-busy={isBusy}
        className="flex min-h-0 flex-1 flex-col justify-between"
      >
        <div className="min-h-0 flex-1 overflow-y-auto">
          <StatusBar />

          <header className="flex h-12 items-center gap-2.5 px-6 py-2 text-white">
            <button
              type="button"
              disabled={isBusy}
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
              disabled={isBusy}
              onChange={(event) => {
                setNickname(event.currentTarget.value);
                clearServerErrors();
              }}
              clearable={focusedField === "nickname"}
              onClear={() => {
                setNickname("");
                clearServerErrors();
              }}
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
                disabled={isBusy}
                errorMessage={
                  emailError ? <span role="alert">{emailError}</span> : undefined
                }
                onChange={(event) => {
                  setEmail(event.currentTarget.value);
                  setEmailChecked(false);
                  setCheckedEmail(null);
                  setEmailServerError("");
                  if (step === "password") setStep("email");
                  clearServerErrors();
                }}
                clearable={focusedField === "email"}
                onClear={() => {
                  setEmail("");
                  setEmailChecked(false);
                  setCheckedEmail(null);
                  setEmailServerError("");
                  if (step === "password") setStep("email");
                  clearServerErrors();
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
                    disabled={isBusy}
                    errorMessage={passwordError}
                    aria-describedby="signup-password-hint"
                    onChange={(event) => {
                      setPassword(event.currentTarget.value);
                      clearServerErrors();
                    }}
                    clearable={focusedField === "password"}
                    onClear={() => {
                      setPassword("");
                      clearServerErrors();
                    }}
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
                    *비밀번호는 8자 이상 72자 이하이어야 합니다.
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
                  disabled={isBusy}
                  errorMessage={confirmationError}
                  onChange={(event) => {
                    setPasswordConfirmation(event.currentTarget.value);
                    clearServerErrors();
                  }}
                  clearable={focusedField === "passwordConfirmation"}
                  onClear={() => {
                    setPasswordConfirmation("");
                    clearServerErrors();
                  }}
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
          {submitError && (
            <p role="alert" className="text-caption-r1 text-main">
              {submitError}
            </p>
          )}
          <LongButton
            type="submit"
            disabled={isNextDisabled}
            className={
              step === "password"
                ? "!bg-main !text-white hover:!bg-main-006 disabled:!bg-neutral-008"
                : "!bg-neutral-008 !text-white"
            }
          >
            {isCheckingEmail
              ? "확인 중..."
              : isSubmitting
                ? "가입 중..."
                : step === "password"
                  ? "시작하기"
                  : "다음"}
          </LongButton>
        </div>
      </form>
    </main>
  );
}

export default SignInPage;
