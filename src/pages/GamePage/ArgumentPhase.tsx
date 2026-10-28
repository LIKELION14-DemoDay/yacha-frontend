/**
 * 주장 · 반론 작성 화면 (PREP · REBUTTAL 구간)
 * 다시 제출하면 덮어쓰고, 시간이 끝나기 직전 고친 내용이 있으면 자동 제출
 * 제출 전 글은 새로고침해도 남도록 sessionStorage 에, 제출한 글은 서버에서 다시 불러옴
 */
import { useEffect, useRef, useState } from "react";

import { getHints, getMyMemos, submitMemo } from "../../apis/sessions";
import LongButton from "../../components/Button";
import CountedTextArea from "../../components/CountedTextArea";
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
  // 내 입장 문장 (주제의 agreeText / disagreeText)
  stanceText: string;
  remainingSeconds: number;
  // 힌트 보기 버튼 (주장 작성에서만)
  canUseHints?: boolean;
  onError: (message: string) => void;
}

const ArgumentPhase = ({
  sessionId,
  phase,
  title,
  stanceText,
  remainingSeconds,
  canUseHints = false,
  onError,
}: ArgumentPhaseProps) => {
  const draftKey = getDraftKey(sessionId, phase);

  const [content, setContent] = useState(() => readDraft(draftKey));
  // 서버에 마지막으로 제출한 글 (아직 없으면 null)
  const [submittedContent, setSubmittedContent] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hints, setHints] = useState<SessionHints | null>(null);
  const [isLoadingHints, setIsLoadingHints] = useState(false);

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
  const canSubmit =
    !isSubmitting && !isTimeOver && !isSubmitted && content.trim() !== "";

  // 시간이 끝나기 직전, 제출 안 한 내용이 있으면 한 번만 자동 제출
  useEffect(() => {
    if (
      autoSubmittedRef.current ||
      remainingSeconds > AUTO_SUBMIT_SECONDS ||
      isTimeOver ||
      isSubmitted
    ) {
      return;
    }

    autoSubmittedRef.current = true;
    submitMemo(sessionId, content)
      .then(() => {
        if (isActiveRef.current) setSubmittedContent(content);
      })
      .catch(() => {
        // 마감 후에는 서버가 정리하므로 따로 알리지 않음
      });
  }, [remainingSeconds, isTimeOver, isSubmitted, sessionId, content]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await submitMemo(sessionId, content);
      if (isActiveRef.current) setSubmittedContent(content);
    } catch {
      onError("제출하지 못했어요. 다시 시도해 주세요.");
    } finally {
      if (isActiveRef.current) setIsSubmitting(false);
    }
  };

  // 힌트는 만들어질 때까지 다시 조회 (실패하면 버튼 비활성화)
  const loadHints = async () => {
    setIsLoadingHints(true);
    try {
      let result = await getHints(sessionId);
      while (result.status === "PENDING" && isActiveRef.current) {
        await new Promise((resolve) => setTimeout(resolve, HINT_POLL_MS));
        result = await getHints(sessionId);
      }
      if (isActiveRef.current) setHints(result);
    } catch {
      onError("힌트를 불러오지 못했어요.");
    } finally {
      if (isActiveRef.current) setIsLoadingHints(false);
    }
  };

  const hasHintFailed = hints?.status === "FAILED";
  const readyHints = hints?.status === "READY" ? (hints.hints ?? []) : [];

  return (
    <>
      <section className="shrink-0 py-2.5">
        <h1 className="px-6 py-2.5 text-headline-sb5 text-white">{title}</h1>
        <div className="flex flex-col px-6 py-1">
          <p className="text-body-m3 text-neutral-007">내 입장</p>
          <p className="text-body-m1 break-keep text-main">“{stanceText}”</p>
        </div>
      </section>

      <section className="flex min-h-0 flex-1 flex-col px-6">
        <CountedTextArea
          value={content}
          onChange={handleChange}
          maxLength={ARGUMENT_MAX_LENGTH}
          label={title}
          notice="상대에게는 제출 후 공개됩니다."
          disabled={isTimeOver}
        />
      </section>

      {canUseHints ? (
        <section className="shrink-0 px-6 pb-10">
          {readyHints.length > 0 ? (
            <ul className="flex flex-col gap-1 rounded-[10px] bg-neutral-009 p-4 text-body-r6 text-neutral-004">
              {readyHints.map((hint) => (
                <li key={hint}>· {hint}</li>
              ))}
            </ul>
          ) : (
            <button
              type="button"
              onClick={loadHints}
              disabled={isLoadingHints || hasHintFailed}
              className="w-25 cursor-pointer rounded-[10px] bg-neutral-008 px-5 py-4 text-subhead-b6 whitespace-nowrap text-white disabled:cursor-not-allowed disabled:text-neutral-006"
            >
              {isLoadingHints ? "..." : "힌트보기"}
            </button>
          )}
        </section>
      ) : null}

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
          {isSubmitted
            ? "제출 완료"
            : submittedContent === null
              ? "제출하기"
              : "다시 제출하기"}
        </LongButton>
      </div>
    </>
  );
};

export default ArgumentPhase;
