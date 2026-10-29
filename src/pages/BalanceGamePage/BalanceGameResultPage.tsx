import { useEffect, useState, useSyncExternalStore } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { getPhilosopherResult } from "../../apis/balanceGame";
import { getAccessToken, subscribeAccessToken } from "../../apis/tokenStore";
import fireIcon from "../../assets/fire-alt-solid.svg";
import linkIcon from "../../assets/link-solid.svg";
import LongButton from "../../components/Button";
import StatusBar from "../../components/StatusBar";
import Toast from "../../components/Toast";
import TopBar from "../../components/TopBar";
import { useToast } from "../../hooks/useToast";
import { isPhilosopherType, type BalanceGameResult } from "../../types/balanceGame";
import { getApiErrorMessage } from "../../utils/apiError";

function BalanceGameResultPage() {
  const { type } = useParams();
  // 공유 링크와 새로고침에서는 공개 유형 조회 API를 사용합니다.
  return <PhilosopherResult key={type} type={type} />;
}

function PhilosopherResult({ type }: { type: string | undefined }) {
  const navigate = useNavigate();
  const location = useLocation();
  const token = useSyncExternalStore(subscribeAccessToken, getAccessToken);
  const submittedResult = (
    location.state as { result?: BalanceGameResult } | null
  )?.result;
  const [result, setResult] = useState<BalanceGameResult | null>(
    submittedResult && submittedResult.type === type ? submittedResult : null,
  );
  const [loadError, setLoadError] = useState("");
  const [loadAttempt, setLoadAttempt] = useState(0);
  const { toastMessage, showToast } = useToast();

  useEffect(() => {
    if (result || !isPhilosopherType(type)) return;
    const controller = new AbortController();
    getPhilosopherResult(type, controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setResult(data);
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) setLoadError(getApiErrorMessage(error));
      });
    return () => controller.abort();
  }, [type, result, loadAttempt]);

  const handleCopy = async () => {
    if (!result) return;
    try {
      const shareUrl = new URL(
        `/balance/result/${result.type}`,
        window.location.origin,
      ).href;
      await navigator.clipboard.writeText(shareUrl);
      showToast("링크를 복사했어요.");
    } catch {
      showToast("링크를 복사하지 못했어요. 다시 시도해주세요.");
    }
  };

  const invalidType = !isPhilosopherType(type);

  return (
    <main className="mx-auto flex h-dvh w-full max-w-100.5 flex-col overflow-hidden bg-secondary text-white">
      <div className="shrink-0">
        <StatusBar />
      </div>
      <TopBar
        action={
          <h1 className="w-full text-center text-subhead-m5 text-neutral-006">
            밸런스 게임 결과...
          </h1>
        }
      />

      {result ? (
        <>
          <section className="flex shrink-0 flex-col items-center gap-2 px-6 pt-5">
            <h2 className="flex flex-col items-center gap-2.5 text-center">
              <span className="text-subhead-r3">당신은</span>
              <span className="text-headline-sb3 break-keep">
                {result.name} 유형입니다.
              </span>
            </h2>
            <p className="flex items-center justify-center gap-1 rounded-[20px] border border-neutral-007 py-1.5 pr-4 pl-3 text-subhead-r8">
              <img src={fireIcon} alt="" className="size-6 shrink-0" />
              {result.alias}
            </p>
          </section>

          <section className="flex min-h-0 flex-1 px-5 py-7.5">
            <article className="flex min-h-0 flex-1 overflow-hidden rounded-[10px] bg-neutral-009 px-4 py-5">
              <div
                tabIndex={0}
                className="flex min-h-0 flex-1 flex-col gap-10 overflow-y-auto overscroll-contain [scrollbar-width:thin]"
              >
                {result.sections.map(({ title, content }, index) => (
                  <section
                    key={`${index}-${title}`}
                    className="flex shrink-0 flex-col items-start gap-3.5"
                  >
                    <h3 className="text-subhead-m5">{title}</h3>
                    <p className="whitespace-pre-line text-body-r4 text-neutral-005">
                      {content}
                    </p>
                  </section>
                ))}
              </div>
            </article>
          </section>

          <div className="flex shrink-0 flex-wrap items-center justify-between gap-y-2 px-6 pt-2.5 pb-7.5">
            <p className="text-body-r6 text-neutral-006">
              친구와 공유하고 유형을 비교해보세요.
            </p>
            <button
              type="button"
              onClick={handleCopy}
              className="flex shrink-0 cursor-pointer items-center gap-1 text-body-m3 text-main"
            >
              링크 복사
              <img src={linkIcon} alt="" className="size-5" />
            </button>
          </div>
        </>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
          <p className="text-body-r4 text-neutral-005">
            {invalidType
              ? "존재하지 않는 철학 유형입니다."
              : loadError || "결과를 불러오는 중이에요."}
          </p>
          {loadError && !invalidType && (
            <LongButton
              onClick={() => {
                setLoadError("");
                setLoadAttempt((attempt) => attempt + 1);
              }}
              className="!bg-main !text-white"
            >
              다시 시도
            </LongButton>
          )}
        </div>
      )}

      <div className="shrink-0 px-6 pt-2.5 pb-5">
        <LongButton
          onClick={() => navigate(token ? "/home" : "/login", { replace: true })}
          className="!bg-main !text-white hover:!bg-main-006"
        >
          야차뜨러 가기
        </LongButton>
      </div>
      <aside className="h-17.5 shrink-0 bg-green" />
      <Toast message={toastMessage} />
    </main>
  );
}

export default BalanceGameResultPage;
