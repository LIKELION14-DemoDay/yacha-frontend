import { useEffect, useRef, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import loginLogo from "../../assets/login-logo.svg?raw";
import LongButton from "../../components/Button";
import InputContainer from "../../components/InputContainer";
import StatusBar from "../../components/StatusBar";
import Toast from "../../components/Toast";
import TopBar from "../../components/TopBar";
import { useToast } from "../../hooks/useToast";

type ResetStep = "email" | "verification" | "password" | "complete";

// API 연결 전 화면 흐름용 인증번호. 실제 이메일 발송이나 비밀번호 변경은 수행하지 않습니다.
const DEMO_VERIFICATION_CODE = "123456";
const VERIFICATION_DURATION_SECONDS = 180;

function ResetPwPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<ResetStep>("email");
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationError, setVerificationError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmationTouched, setConfirmationTouched] = useState(false);
  const codeInputRef = useRef<HTMLInputElement>(null);
  const { toastMessage, showToast } = useToast();

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isPasswordValid = password.length >= 8;
  const passwordsMatch =
    passwordConfirmation.length > 0 && password === passwordConfirmation;
  const isExpired =
    step === "verification" && !isVerified && remainingSeconds === 0;
  const passwordError =
    passwordTouched && password.length > 0 && !isPasswordValid
      ? "비밀번호는 8자 이상이어야 합니다."
      : "";
  const confirmationError =
    confirmationTouched && passwordConfirmation.length > 0 && !passwordsMatch
      ? "비밀번호가 일치하지 않습니다."
      : "";
  const isNextDisabled =
    step === "email"
      ? !isEmailValid
      : step === "verification"
        ? !isVerified
        : !isPasswordValid || !passwordsMatch;

  useEffect(() => {
    if (step !== "verification" || isVerified || expiresAt === null) return;

    // 백그라운드 탭에서도 실제 경과 시간을 기준으로 만료시킵니다.
    const timer = window.setInterval(() => {
      setRemainingSeconds(
        Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000)),
      );
    }, 1000);

    return () => window.clearInterval(timer);
  }, [step, isVerified, expiresAt]);

  const requestCode = () => {
    setVerificationCode("");
    setVerificationError("");
    setIsVerified(false);
    setRemainingSeconds(VERIFICATION_DURATION_SECONDS);
    setExpiresAt(Date.now() + VERIFICATION_DURATION_SECONDS * 1000);
    setStep("verification");
  };

  const verifyCode = () => {
    if (isVerified || expiresAt === null) return;
    if (Date.now() >= expiresAt) {
      setRemainingSeconds(0);
      setVerificationError("인증 번호를 다시 요청해주세요.");
      return;
    }

    if (verificationCode !== DEMO_VERIFICATION_CODE) {
      setVerificationError("인증번호가 올바르지 않습니다.");
      return;
    }

    setVerificationError("");
    setIsVerified(true);
    setExpiresAt(null);
    showToast("인증이 완료되었습니다.");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (step === "email" && isEmailValid) {
      setEmail(email.trim());
      requestCode();
    } else if (step === "verification" && isVerified) {
      setStep("password");
    } else if (step === "password" && isPasswordValid && passwordsMatch) {
      // API 연결 시 비밀번호 변경 요청에 성공한 뒤 완료 화면으로 전환합니다.
      setPassword("");
      setPasswordConfirmation("");
      setStep("complete");
    }
  };

  const handleBack = () => {
    navigate("/login");
  };

  if (step === "complete") {
    return (
      <main className="mx-auto flex min-h-dvh w-full max-w-100.5 flex-col bg-secondary">
        <StatusBar />
        <div className="flex shrink-0 flex-col items-center pt-50 pb-10">
          <span
            className="text-main"
            role="img"
            aria-label="야차철학"
            dangerouslySetInnerHTML={{ __html: loginLogo }}
          />
        </div>
        <section className="flex flex-col items-center gap-3 px-6 py-5 text-center">
          <h1 className="text-headline-sb5 text-white">
            비밀번호가 변경되었습니다!
          </h1>
          <p className="text-subhead-r8 text-neutral-006">
            지금 바로 자유롭게 싸워보세요.
          </p>
        </section>
        <div className="px-6 py-10">
          <LongButton
            className="!bg-main !text-white hover:!bg-main-006"
            onClick={() => navigate("/login", { replace: true })}
          >
            홈으로
          </LongButton>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex h-dvh min-h-166.75 w-full max-w-100.5 flex-col bg-secondary">
      <form
        noValidate
        onSubmit={handleSubmit}
        aria-label="비밀번호 재설정"
        className="flex min-h-0 flex-1 flex-col justify-between"
      >
        <div className="min-h-0 flex-1 overflow-y-auto">
          <StatusBar />
          <TopBar title="비밀번호 찾기" onBack={handleBack} />
          <div className="px-6 pt-8 pb-6" aria-live="polite">
            <h1 className="text-headline-sb5 text-white">
              {step === "email" ? (
                "아이디를 입력해주세요."
              ) : step === "verification" ? (
                <>
                  이메일로 온 인증번호를
                  <br />
                  입력해주세요.
                </>
              ) : (
                <>
                  새 비밀번호를
                  <br />
                  만들어 주세요.
                </>
              )}
            </h1>
          </div>

          {step !== "password" ? (
            <div className="flex flex-col gap-5 py-6">
              <InputContainer
                label="아이디"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="이메일@example.com"
                required
                value={email}
                readOnly={step === "verification"}
                onChange={(event) => setEmail(event.currentTarget.value)}
              />
              {step === "verification" && (
                <div className="flex flex-col gap-2 px-6">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="reset-verification-code"
                      className="text-subhead-m7 text-white"
                    >
                      인증번호
                    </label>
                    <button
                      type="button"
                      disabled={isVerified}
                      onClick={() => {
                        requestCode();
                        codeInputRef.current?.focus();
                      }}
                      className="cursor-pointer text-subhead-r8 text-neutral-007 underline underline-offset-2 disabled:cursor-not-allowed"
                    >
                      다시 요청
                    </button>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-start gap-2">
                      <div className="relative min-w-0 flex-1">
                        {/* 오류를 아래에만 표시하여 unselected/selected/inputted 상태를 유지합니다. */}
                        <InputContainer
                          ref={codeInputRef}
                          id="reset-verification-code"
                          label={null}
                          name="verificationCode"
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          placeholder="인증번호 입력"
                          maxLength={6}
                          required
                          value={verificationCode}
                          readOnly={isVerified}
                          containerClassName="!gap-0 !px-0 [&>div:first-child]:sr-only [&>div:last-child]:h-13.25"
                          className={isVerified ? "" : "pr-14"}
                          aria-invalid={Boolean(verificationError)}
                          aria-describedby={
                            verificationError ? "reset-code-error" : undefined
                          }
                          onChange={(event) => {
                            setVerificationCode(
                              event.currentTarget.value
                                .replace(/\D/g, "")
                                .slice(0, 6),
                            );
                            setVerificationError("");
                          }}
                          onKeyDown={(event) => {
                            if (event.key === "Enter" && !isVerified) {
                              event.preventDefault();
                              verifyCode();
                            }
                          }}
                        />
                        {!isVerified && (
                          <span
                            className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-subhead-r8 text-main tabular-nums"
                            role="timer"
                            aria-label={`인증 남은 시간 ${Math.floor(remainingSeconds / 60)}분 ${remainingSeconds % 60}초`}
                          >
                            {Math.floor(remainingSeconds / 60)}:
                            {String(remainingSeconds % 60).padStart(2, "0")}
                          </span>
                        )}
                      </div>
                      <LongButton
                        disabled={isVerified || (!verificationCode && !isExpired)}
                        onClick={verifyCode}
                        className={`h-13.25 !w-25 shrink-0 !px-3 ${
                          isVerified
                            ? "!bg-green !text-white/60"
                            : "!bg-main !text-white enabled:hover:!bg-main-006 disabled:opacity-50"
                        }`}
                      >
                        {isVerified ? "인증완료" : "인증하기"}
                      </LongButton>
                    </div>
                    {verificationError && (
                      <p
                        id="reset-code-error"
                        role="alert"
                        className="text-caption-r1 text-main"
                      >
                        *{verificationError}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-4 py-6">
              <div className="flex flex-col gap-1">
                <InputContainer
                  label="새 비밀번호"
                  type="password"
                  name="newPassword"
                  autoComplete="new-password"
                  placeholder="비밀번호를 입력해주세요."
                  required
                  minLength={8}
                  value={password}
                  aria-invalid={Boolean(passwordError)}
                  aria-describedby="reset-password-hint"
                  onChange={(event) => setPassword(event.currentTarget.value)}
                  onBlur={() => setPasswordTouched(true)}
                />
                <p
                  id="reset-password-hint"
                  role={passwordError ? "alert" : undefined}
                  className={`px-6 ${passwordError ? "text-caption-r1 text-main" : "text-body-r6 text-neutral-007"}`}
                >
                  *비밀번호는 8자 이상이어야 합니다.
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <InputContainer
                  label="비밀번호"
                  type="password"
                  name="passwordConfirmation"
                  autoComplete="new-password"
                  placeholder="비밀번호를 한번 더 입력해주세요."
                  required
                  value={passwordConfirmation}
                  aria-invalid={Boolean(confirmationError)}
                  aria-describedby={
                    confirmationError ? "reset-confirmation-error" : undefined
                  }
                  onChange={(event) =>
                    setPasswordConfirmation(event.currentTarget.value)
                  }
                  onBlur={() => setConfirmationTouched(true)}
                />
                {confirmationError && (
                  <p
                    id="reset-confirmation-error"
                    role="alert"
                    className="px-6 text-caption-r1 text-main"
                  >
                    *{confirmationError}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="shrink-0 px-6 pt-2.5 pb-12.5">
          <LongButton
            type="submit"
            disabled={isNextDisabled}
            className={
              step === "password"
                ? "!bg-main !text-white enabled:hover:!bg-main-006 disabled:!bg-neutral-009 disabled:!text-neutral-007"
                : "!bg-neutral-008 !text-white disabled:!bg-neutral-009 disabled:!text-neutral-007"
            }
          >
            {step === "password" ? "변경하기" : "다음"}
          </LongButton>
        </div>
      </form>
      {step === "verification" && (
        <div className="[&>div]:bottom-32.5">
          <Toast message={toastMessage} />
        </div>
      )}
    </main>
  );
}

export default ResetPwPage;
