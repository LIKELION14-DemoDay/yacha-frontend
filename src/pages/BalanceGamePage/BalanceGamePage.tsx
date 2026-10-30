import { useRef, useState, useSyncExternalStore } from "react";
import { useNavigate } from "react-router-dom";

import { skipBalanceGame } from "../../apis/balanceGame";
import { getAccessToken, subscribeAccessToken } from "../../apis/tokenStore";
import balanceFirst from "../../assets/balance-first.svg";
import brandLogo from "../../assets/brand-logo.svg";
import LongButton from "../../components/Button";
import Toast from "../../components/Toast";
import { useToast } from "../../hooks/useToast";
import { getApiErrorMessage } from "../../utils/apiError";

function BalanceGamePage() {
  const navigate = useNavigate();
  const token = useSyncExternalStore(subscribeAccessToken, getAccessToken);
  const [isSkipping, setIsSkipping] = useState(false);
  const skipPendingRef = useRef(false);
  const { toastMessage, showToast } = useToast();

  const handleSkip = async () => {
    if (skipPendingRef.current) return;
    skipPendingRef.current = true;
    setIsSkipping(true);
    try {
      await skipBalanceGame(Boolean(token));
      navigate(token ? "/mypage" : "/login", { replace: true });
    } catch (error: unknown) {
      showToast(getApiErrorMessage(error));
    } finally {
      skipPendingRef.current = false;
      setIsSkipping(false);
    }
  };

  return (
    // 화면이 아주 짧으면 줄어들지 않고 스크롤 (광고가 없는 화면)
    <main className="mx-auto flex h-full w-full max-w-100.5 flex-col justify-between overflow-y-auto bg-secondary [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <section className="flex flex-1 flex-col">
        <div className="flex flex-1 flex-col">
          <div className="flex flex-1 items-end justify-center pb-3">
            <img
              src={balanceFirst}
              alt=""
              className="h-30.75 w-35.75 shrink-0"
            />
          </div>

          <div className="flex shrink-0 flex-col items-center gap-6 px-6 py-5 text-center">
            <div className="flex flex-col items-center gap-2">
              <img src={brandLogo} alt="야차철학" className="h-6.5 w-32" />
              <h1 className="text-headline-sb2 text-white">밸런스 게임</h1>
            </div>

            <p className="text-body-r2 text-neutral-005">
              시작하기에 앞서 밸런스 게임을 통해
              <br />내 철학 유형을 파악해보세요.
            </p>
          </div>
        </div>
      </section>

      <section className="flex shrink-0 flex-col gap-3 px-6 pt-2.5 pb-17.5">
        <LongButton
          className="!bg-main !text-white hover:!bg-main-006"
          onClick={() => navigate("/balance/game")}
          disabled={isSkipping}
        >
          확인
        </LongButton>
        <LongButton
          className="!bg-neutral-008 !text-white hover:!bg-neutral-007"
          onClick={handleSkip}
          disabled={isSkipping}
        >
          {isSkipping ? "처리 중..." : "건너뛰기"}
        </LongButton>
      </section>
      <Toast message={toastMessage} />
    </main>
  );
}

export default BalanceGamePage;
