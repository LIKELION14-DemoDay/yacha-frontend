import { useLocation, useNavigate } from "react-router-dom";

import loginLogo from "../assets/login-logo.svg?raw";
import LongButton from "../components/Button";
import StatusBar from "../components/StatusBar";

function CompleteSigninPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const nickname =
    typeof state?.nickname === "string"
      ? state.nickname.trim() || "OOO"
      : "OOO";

  return (
    <main className="mx-auto flex h-dvh min-h-166.75 w-full max-w-100.5 flex-col overflow-y-auto bg-secondary">
      <StatusBar />

      <div className="flex shrink-0 flex-col items-center pt-50 pb-10">
        <span
          className="text-main"
          role="img"
          aria-label="야차철학"
          dangerouslySetInnerHTML={{ __html: loginLogo }}
        />
      </div>

      <section className="flex shrink-0 flex-col items-center justify-center gap-3 px-6 py-5 text-center">
        <h1 className="text-headline-sb5 text-white">
          회원가입이 완료되었습니다!
        </h1>
        <p className="text-subhead-r8 text-neutral-006">
          {nickname}님의 회원가입을 축하합니다.
          <br />
          지금 바로 자유롭게 싸워보세요.
        </p>
      </section>

      <div className="flex shrink-0 flex-col gap-3 px-6 py-10">
        <LongButton
          className="!bg-main !text-white hover:!bg-main-006"
          onClick={() => navigate("/home")}
        >
          홈으로
        </LongButton>
      </div>
    </main>
  );
}

export default CompleteSigninPage;
