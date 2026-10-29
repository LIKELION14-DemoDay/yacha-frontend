import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useNavigate } from "react-router-dom";

import {
  getBalanceQuestions,
  skipBalanceGame,
  submitBalanceAnswers,
} from "../../apis/balanceGame";
import { getAccessToken, subscribeAccessToken } from "../../apis/tokenStore";
import LongButton from "../../components/Button";
import ChoiceOptions from "../../components/ChoiceOptions";
import ConfirmModal from "../../components/ConfirmModal";
import StatusBar from "../../components/StatusBar";
import Toast from "../../components/Toast";
import TopBar from "../../components/TopBar";
import { useToast } from "../../hooks/useToast";
import {
  BALANCE_QUESTION_COUNT,
  type BalanceAnswer,
  type BalanceQuestion,
} from "../../types/balanceGame";
import { getApiErrorMessage } from "../../utils/apiError";

function BalanceGamePlayPage() {
  const navigate = useNavigate();
  const token = useSyncExternalStore(subscribeAccessToken, getAccessToken);
  const [questions, setQuestions] = useState<BalanceQuestion[]>([]);
  const [loadError, setLoadError] = useState("");
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [answers, setAnswers] = useState<BalanceAnswer[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [quitOpen, setQuitOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const pendingRef = useRef(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const { toastMessage, showToast } = useToast();

  useEffect(() => {
    const controller = new AbortController();
    getBalanceQuestions(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setQuestions(data);
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) setLoadError(getApiErrorMessage(error));
      });
    return () => controller.abort();
  }, [loadAttempt]);

  const question = questions[answers.length];
  const questionNumber = answers.length + 1;
  const canConfirm = Boolean(question) && selectedIndex !== null && !isPending;

  const handleConfirm = async () => {
    if (!question || selectedIndex === null || pendingRef.current) return;
    const nextAnswers: BalanceAnswer[] = [
      ...answers,
      selectedIndex === 0 ? "A" : "B",
    ];

    if (nextAnswers.length < BALANCE_QUESTION_COUNT) {
      setAnswers(nextAnswers);
      setSelectedIndex(null);
      contentRef.current?.scrollTo({ top: 0 });
      return;
    }

    pendingRef.current = true;
    setIsPending(true);
    try {
      const result = await submitBalanceAnswers(nextAnswers, Boolean(token));
      // 결과를 받은 뒤에는 skip을 호출하지 않아 미리보기 쿠키를 보존합니다.
      navigate(`/balance/result/${result.type}`, {
        replace: true,
        state: { result },
      });
    } catch (error: unknown) {
      showToast(getApiErrorMessage(error));
    } finally {
      pendingRef.current = false;
      setIsPending(false);
    }
  };

  const handleQuit = async () => {
    if (pendingRef.current) return;
    pendingRef.current = true;
    setIsPending(true);
    setQuitOpen(false);
    try {
      await skipBalanceGame(Boolean(token));
      navigate(token ? "/mypage" : "/login", { replace: true });
    } catch (error: unknown) {
      showToast(getApiErrorMessage(error));
    } finally {
      pendingRef.current = false;
      setIsPending(false);
    }
  };

  return (
    <main className="mx-auto flex h-dvh w-full max-w-100.5 flex-col overflow-hidden bg-secondary text-white">
      <div className="shrink-0">
        <StatusBar />
      </div>
      <TopBar
        action={
          <div className="relative flex w-full items-center justify-center">
            <h1 className="text-subhead-m5">밸런스 게임</h1>
            <button
              type="button"
              disabled={isPending}
              onClick={() => setQuitOpen(true)}
              className="absolute right-0 cursor-pointer text-body-r6 text-neutral-007 disabled:cursor-not-allowed"
            >
              그만하기
            </button>
          </div>
        }
      />

      <div
        ref={contentRef}
        className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        inert={quitOpen || isPending}
      >
        <div className="shrink-0 px-6 pt-5 pb-10">
          <div className="h-1.25 w-full bg-neutral-008">
            <div
              className="h-full bg-main transition-[width] duration-300 motion-reduce:transition-none"
              style={{
                width: `${question ? (questionNumber / BALANCE_QUESTION_COUNT) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        {question ? (
          <>
            <section className="flex shrink-0 flex-col items-start gap-5 px-6">
              <p className="flex items-baseline gap-1">
                <span className="text-subhead-b4 tracking-[0.2px]">
                  Q. {questionNumber}
                </span>
                <span className="text-caption-r2 font-bold text-neutral-007">
                  /{BALANCE_QUESTION_COUNT}
                </span>
              </p>
              <div className="flex w-full flex-col gap-3">
                <h2 className="text-headline-sb5 break-keep">
                  {question.question}
                </h2>
                <p className="text-body-r2 text-neutral-006">당신의 선택은?</p>
              </div>
            </section>
            <section className="flex flex-1 items-center px-6 py-10">
              <ChoiceOptions
                options={[question.optionA, question.optionB]}
                selectedIndex={selectedIndex}
                onSelect={setSelectedIndex}
              />
            </section>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 text-center">
            <p className="text-body-r4 text-neutral-005">
              {loadError || "질문을 불러오는 중이에요."}
            </p>
            {loadError && (
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
      </div>

      <div className="shrink-0 px-6 pt-2.5 pb-12.5" inert={quitOpen}>
        <LongButton
          disabled={!canConfirm}
          onClick={handleConfirm}
          className={
            canConfirm
              ? "!bg-main !text-white hover:!bg-main-006"
              : "!bg-main-009 !text-neutral-004"
          }
        >
          {isPending ? "처리 중..." : "확인"}
        </LongButton>
      </div>
      <aside className="h-17.5 shrink-0 bg-green" />
      <ConfirmModal
        open={quitOpen}
        title="밸런스 게임을 종료할까요?"
        description="지금 나가면 진행 중인 내용은 사라집니다."
        cancelLabel="그만하기"
        confirmLabel="계속하기"
        onCancel={handleQuit}
        onConfirm={() => setQuitOpen(false)}
        onDismiss={() => setQuitOpen(false)}
      />
      <Toast message={toastMessage} />
    </main>
  );
}

export default BalanceGamePlayPage;
