/**
 * 주장 · 반론 작성 화면 (PREP · REBUTTAL 구간)
 * 제출하면 상대를 기다리는 화면, "수정하러 가기"로 다시 고쳐 제출하면 덮어씀
 * 시간이 끝나기 직전 제출 안 한 내용이 있으면 자동 제출
 * 제출 전 글은 새로고침해도 남도록 sessionStorage 에, 제출한 글은 서버에서 다시 불러옴
 */
import { useCallback, useEffect, useRef, useState } from "react";

import { getHints, getMyMemos, submitMemo } from "../../apis/sessions";
import LongButton from "../../components/Button";
import CountedTextArea from "../../components/CountedTextArea";
import HintModal from "../../components/HintModal";
import type { SessionHints, SessionPhase } from "../../types/session";

const ARGUMENT_MAX_LENGTH = 200;

// 서버 마감 전에 도착하도록 조금 일찍 자동 제출
const AUTO_SUBMIT_SECONDS = 2;

// 힌트 생성 중(PENDING)이면 다시 조회하는 간격
const HINT_POLL_MS = 1500;

const getDraftKey = (sessionId: number, phase: SessionPhase) =>
  `yacha:draft:${sessionId}:${phase}`;

// 저장소를 못 쓰는 환경(사생활 보호 모드 등)이면 빈 글로 시작
const readDraft = (key: string) => {
  try {
    return sessionStorage.getItem(key) ?? "";
  } catch {
    return "";
  }
};

const writeDraft = (key: string, value: string) => {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    // 저장 못 해도 작성은 계속 가능
  }
};

interface ArgumentPhaseProps {
  sessionId: number;
  phase: "PREP" | "REBUTTAL";
  title: string;
  // 주장 작성 위쪽에 보일 주제 문장과 내 입장 (예: 찬성)
  topicStatement: string;
  stanceLabel: string;
  // 반론 작성 때 위에 보여 줄 상대 주장 (있으면 내 입장 대신 표시, null 이면 아직 불러오는 중)
  opponentArgument?: string | null;
  remainingSeconds: number;
  // 힌트 보기 버튼 (주장 작성에서만)
  canUseHints?: boolean;
  onError: (message: string) => void;
}

const ArgumentPhase = ({
  sessionId,
  phase,
  title,
  topicStatement,
  stanceLabel,
  opponentArgument,
  remainingSeconds,
  canUseHints = false,
  onError,
}: ArgumentPhaseProps) => {
  const draftKey = getDraftKey(sessionId, phase);

  const [content, setContent] = useState(() => readDraft(draftKey));
  // 서버에 마지막으로 제출한 글 (아직 없으면 null)
  const [submittedContent, setSubmittedContent] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // 제출 후 "수정하러 가기"로 다시 작성 칸을 연 상태
  const [isEditing, setIsEditing] = useState(false);
  const [hints, setHints] = useState<SessionHints | null>(null);
  const [isLoadingHints, setIsLoadingHints] = useState(false);
  const [isHintOpen, setIsHintOpen] = useState(false);

  const isActiveRef = useRef(true);
  const autoSubmittedRef = useRef(false);

  useEffect(() => {
    isActiveRef.current = true;
    return () => {
      isActiveRef.current = false;
    };
  }, []);

  // 새로고침 복구: 이미 제출한 글이 있으면 불러오고, 쓰던 글이 없을 때만 칸에 채움
  useEffect(() => {
    let ignore = false;

    getMyMemos(sessionId)
      .then((memos) => {
        const memo = memos.find((item) => item.phase === phase);
        if (ignore || !memo) return;

        setSubmittedContent(memo.content);
        setContent((current) => current || memo.content);
      })
      .catch(() => {
        // 못 불러와도 새로 쓰면 됨
      });

    return () => {
      ignore = true;
    };
  }, [sessionId, phase]);

  const handleChange = (value: string) => {
    setContent(value);
    writeDraft(draftKey, value);
  };

  const isTimeOver = remainingSeconds <= 0;
  const isSubmitted = submittedContent !== null && submittedContent === content;
  // 수정 중에는 그대로 다시 제출해도 대기 화면으로 돌아감
  const canSubmit = !isSubmitting && !isTimeOver && content.trim() !== "";
  // 제출한 글 그대로면 상대를 기다리는 화면
  const isWaiting = isSubmitted && !isEditing;

  // 시간이 끝나기 직전, 제출 안 한 내용이 있으면 자동 제출
  // 빈 글은 보내지 않음 (제출한 글을 빈 글로 덮어쓰지 않도록)
  useEffect(() => {
    if (
      autoSubmittedRef.current ||
      remainingSeconds > AUTO_SUBMIT_SECONDS ||
      isTimeOver ||
      isSubmitted ||
      content.trim() === ""
    ) {
      return;
    }

    autoSubmittedRef.current = true;
    submitMemo(sessionId, content)
      .then(() => {
        if (isActiveRef.current) setSubmittedContent(content);
      })
      .catch(() => {
        // 실패하면 다음 초에 다시 시도
        autoSubmittedRef.current = false;
      });
  }, [remainingSeconds, isTimeOver, isSubmitted, sessionId, content]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await submitMemo(sessionId, content);
      if (isActiveRef.current) {
        setSubmittedContent(content);
        setIsEditing(false);
      }
    } catch {
      onError("제출하지 못했어요. 다시 시도해 주세요.");
    } finally {
      if (isActiveRef.current) setIsSubmitting(false);
    }
  };

  // 힌트는 처음 열 때 한 번 받아 두고 다시 씀 (만드는 중이면 다시 조회, 실패하면 버튼 비활성화)
  const openHints = async () => {
    if (hints?.status === "READY") {
      setIsHintOpen(true);
      return;
    }

    setIsLoadingHints(true);
    try {
      let result = await getHints(sessionId);
      while (result.status === "PENDING" && isActiveRef.current) {
        await new Promise((resolve) => setTimeout(resolve, HINT_POLL_MS));
        result = await getHints(sessionId);
      }
      if (!isActiveRef.current) return;

      setHints(result);
      if (result.status === "READY" && result.hints?.length) {
        setIsHintOpen(true);
      } else {
        onError("힌트를 만들지 못했어요.");
      }
    } catch {
      onError("힌트를 불러오지 못했어요.");
    } finally {
      if (isActiveRef.current) setIsLoadingHints(false);
    }
  };

  // 쓰던 글 뒤에 이어 붙임 (200자를 넘으면 잘림)
  const pasteHint = (hint: string) => {
    const separator = content && !/\s$/.test(content) ? " " : "";
    handleChange(`${content}${separator}${hint}`.slice(0, ARGUMENT_MAX_LENGTH));
    setIsHintOpen(false);
  };

  const closeHints = useCallback(() => setIsHintOpen(false), []);

  const hasHintFailed = hints?.status === "FAILED";

  if (isWaiting) {
    return (
      <>
        <section className="flex min-h-0 flex-1 flex-col justify-center py-2.5 text-center">
          <p role="status" className="px-6 py-2.5 text-headline-sb5 text-white">
            상대방이 아직 작성 중입니다...
          </p>
          <div className="px-6 py-1">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              disabled={isTimeOver}
              className="cursor-pointer text-body-m3 text-neutral-007 transition-colors hover:text-neutral-005 disabled:cursor-not-allowed"
            >
              수정하러 가기
            </button>
          </div>
        </section>

        <aside aria-label="광고 영역" className="h-25 shrink-0 bg-green" />
      </>
    );
  }

  return (
    <>
      {opponentArgument === undefined ? (
        <section className="shrink-0 py-2.5">
          <div className="flex flex-col px-6 py-1">
            <p className="text-body-r4 wrap-break-word text-neutral-007">
              “{topicStatement}”
            </p>
            <p className="text-body-m1 text-main">{stanceLabel} 입장</p>
          </div>
          <h1 className="px-6 py-2.5 text-headline-sb5 text-white">{title}</h1>
        </section>
      ) : (
        <section className="shrink-0">
          <h1 className="px-6 py-2.5 text-headline-sb5 text-white">{title}</h1>
          <div className="flex flex-col gap-1 px-6.5 py-3">
            <p className="text-subhead-m7 text-neutral-008">상대 입장</p>
            {/* 긴 주장은 이 칸 안에서 스크롤 (얇은 스크롤 막대) */}
            <p className="h-25 overflow-y-auto py-1 pr-5 text-body-r4 wrap-break-word whitespace-pre-wrap text-neutral-006 [scrollbar-color:var(--color-neutral-003)_var(--color-neutral-008)] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-[11px] [&::-webkit-scrollbar-thumb]:bg-neutral-003 [&::-webkit-scrollbar-track]:rounded-[10px] [&::-webkit-scrollbar-track]:bg-neutral-008">
              {opponentArgument === null
                ? "상대 주장을 불러오는 중이에요"
                : opponentArgument.trim() || "상대가 작성한 주장이 없어요"}
            </p>
          </div>
        </section>
      )}

      <section
        className={`flex min-h-0 flex-1 flex-col px-6 ${canUseHints ? "" : "pt-2 pb-8"}`}
      >
        <CountedTextArea
          value={content}
          onChange={handleChange}
          maxLength={ARGUMENT_MAX_LENGTH}
          label={title}
          notice="상대에게는 제출 후 공개됩니다."
          disabled={isTimeOver}
          spaced={!canUseHints}
        />
      </section>

      {canUseHints ? (
        <section className="shrink-0 px-6 pb-10">
          <button
            type="button"
            onClick={openHints}
            disabled={isLoadingHints || hasHintFailed || isTimeOver}
            className="w-25 cursor-pointer rounded-[10px] bg-neutral-008 px-5 py-4 text-subhead-b6 whitespace-nowrap text-white disabled:cursor-not-allowed disabled:text-neutral-006"
          >
            {isLoadingHints ? "..." : "힌트보기"}
          </button>
        </section>
      ) : null}

      <HintModal
        open={isHintOpen}
        hints={hints?.hints ?? []}
        onClose={closeHints}
        onPaste={pasteHint}
      />

      <div className="shrink-0 px-6 pt-2.5 pb-12.5">
        <LongButton
          disabled={!canSubmit}
          onClick={handleSubmit}
          className={
            canSubmit
              ? "!bg-main !text-white hover:!bg-main-006"
              : "!bg-main-009 !text-neutral-004"
          }
        >
          {submittedContent === null ? "제출하기" : "다시 제출하기"}
        </LongButton>
      </div>
    </>
  );
};

export default ArgumentPhase;
