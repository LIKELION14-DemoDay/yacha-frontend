import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  addPhilosophyBookmark,
  getPhilosophyArticle,
  removePhilosophyBookmark,
} from "../../apis/philosophy";
import bookmarkIcon from "../../assets/bookmark.svg";
import bookmarkSolidIcon from "../../assets/bookmark-solid.svg";
import Toast from "../../components/Toast";
import TopBar from "../../components/TopBar";
import { usePhilosophyMemo } from "../../hooks/usePhilosophyMemo";
import { useToast } from "../../hooks/useToast";
import type { PhilosophyArticleDetail } from "../../types/philosophy";
import { getApiErrorCode } from "../../utils/apiError";

function OneminuteDetailPage() {
  const { id } = useParams();
  const articleId = Number(id);
  if (!Number.isSafeInteger(articleId) || articleId <= 0) {
    return <Navigate to="/oneminute" replace />;
  }

  return <ArticleDetail key={articleId} articleId={articleId} />;
}

function ArticleDetail({ articleId }: { articleId: number }) {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: unknown } | null)?.from;
  const returnTo =
    typeof from === "string" &&
    /^(?:\/oneminute|\/my\/bookmarks)(?:\?|$)/.test(from)
      ? from
      : "/oneminute";
  const [article, setArticle] = useState<PhilosophyArticleDetail | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isBookmarkSaving, setIsBookmarkSaving] = useState(false);
  const contentRef = useRef<HTMLElement>(null);
  const activeRef = useRef(true);
  const leavingRef = useRef(false);
  const errorRef = useRef<unknown>(null);
  const bookmarkRequestRef = useRef<Promise<void> | null>(null);
  const { memo, initializeMemo, updateMemo, saveMemo } =
    usePhilosophyMemo(articleId);
  const { toastMessage, showToast } = useToast();

  useEffect(() => {
    activeRef.current = true;
    const controller = new AbortController();

    getPhilosophyArticle(articleId, controller.signal)
      .then(({ data }) => {
        if (controller.signal.aborted) return;
        initializeMemo(data.memo);
        setArticle(data);
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        errorRef.current = error;
        if (getApiErrorCode(error) === "ARTICLE_NOT_FOUND") {
          navigate(returnTo, { replace: true });
        }
      });

    return () => {
      activeRef.current = false;
      controller.abort();
    };
  }, [articleId, initializeMemo, navigate, returnTo]);

  const handleBack = async () => {
    if (leavingRef.current) return;
    leavingRef.current = true;
    const [saved] = await Promise.all([saveMemo(), bookmarkRequestRef.current]);
    if (activeRef.current && saved) {
      // 목록을 다시 조회하므로 변경한 북마크 상태도 카드에 반영됩니다.
      if (typeof from === "string" && from === returnTo) navigate(-1);
      else navigate(returnTo, { replace: true });
    } else {
      leavingRef.current = false;
    }
  };

  const toggleBookmark = () => {
    if (!article || bookmarkRequestRef.current) return;
    setIsBookmarkSaving(true);
    const request = article.bookmarked
      ? removePhilosophyBookmark(articleId)
      : addPhilosophyBookmark(articleId);

    bookmarkRequestRef.current = request
      .then(({ data }) => {
        if (!activeRef.current) return;
        setArticle((current) =>
          current ? { ...current, bookmarked: data.bookmarked } : current,
        );
        showToast(
          data.bookmarked
            ? "북마크에 추가되었습니다."
            : "북마크가 해지되었습니다.",
        );
      })
      .catch((error: unknown) => {
        errorRef.current = error;
      })
      .finally(() => {
        bookmarkRequestRef.current = null;
        if (activeRef.current) setIsBookmarkSaving(false);
      });
  };

  const selectPhilosopher = (index: number) => {
    setSelectedIndex(index);
    contentRef.current?.scrollTo({ top: 0 });
  };

  const handleTabKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    const count = article?.philosophers.length ?? 0;
    if (!count) return;
    let next: number;
    if (event.key === "ArrowRight") next = (index + 1) % count;
    else if (event.key === "ArrowLeft") next = (index - 1 + count) % count;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = count - 1;
    else return;

    event.preventDefault();
    selectPhilosopher(next);
    const buttons =
      event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>(
        "button",
      );
    buttons?.[next]?.focus();
  };

  const philosopher = article?.philosophers[selectedIndex];
  const category =
    article?.topic.categoryName || article?.topic.subcategoryName;

  return (
    <main
      aria-busy={!article}
      className="mx-auto flex h-full w-full max-w-100.5 flex-col overflow-hidden bg-secondary text-white"
    >
      <TopBar
        onBack={() => void handleBack()}
        backLabel="1분 철학 목록으로 돌아가기"
        action={
          <button
            type="button"
            aria-label={article?.bookmarked ? "북마크 해제" : "북마크 추가"}
            aria-pressed={article?.bookmarked ?? false}
            disabled={!article || isBookmarkSaving}
            onClick={toggleBookmark}
            className="flex size-6 shrink-0 cursor-pointer items-center justify-center disabled:cursor-not-allowed"
          >
            <img
              src={article?.bookmarked ? bookmarkSolidIcon : bookmarkIcon}
              alt=""
              className="size-6"
            />
          </button>
        }
      />

      <div className="flex min-h-25 shrink-0 flex-col items-start gap-1 px-6 pt-5 pb-6">
        {article && (
          <>
            <p className="text-body-r8 text-main">
              {category?.startsWith("#") ? category : `#${category}`}
            </p>
            <h1 className="w-full wrap-break-words text-subhead-m2 text-neutral-003">
              “{article.topic.statement}”
            </h1>
          </>
        )}
      </div>

      <div
        role="tablist"
        aria-label="철학자 의견"
        className="flex h-8 shrink-0 gap-4 overflow-x-auto px-6 scrollbar-none [&::-webkit-scrollbar]:hidden"
      >
        {article?.philosophers.map((item, index) => (
          <button
            key={`${item.name}-${index}`}
            id={`philosopher-tab-${articleId}-${index}`}
            type="button"
            role="tab"
            aria-selected={selectedIndex === index}
            aria-controls={`philosopher-content-${articleId}`}
            tabIndex={selectedIndex === index ? 0 : -1}
            onClick={() => selectPhilosopher(index)}
            onKeyDown={(event) => handleTabKeyDown(event, index)}
            className={`shrink-0 cursor-pointer border-b-2 py-1 text-body-m3 whitespace-nowrap focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-main ${
              selectedIndex === index
                ? "border-main text-main"
                : "border-transparent text-neutral-007"
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>

      <section
        ref={contentRef}
        id={`philosopher-content-${articleId}`}
        role="tabpanel"
        aria-labelledby={
          philosopher
            ? `philosopher-tab-${articleId}-${selectedIndex}`
            : undefined
        }
        aria-description="AI가 정리한 철학자 의견입니다."
        title="AI가 정리한 철학자 의견입니다."
        tabIndex={0}
        className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-y-contain bg-neutral-009 px-6 py-4 scrollbar-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-main [&::-webkit-scrollbar]:hidden"
      >
        {philosopher?.sections.map((section, index) => (
          <section key={index} className="flex shrink-0 flex-col gap-1">
            <h2 className="wrap-break-words text-subhead-m3 text-white">
              {section.title}
            </h2>
            <p className="wrap-break-words text-body-r8 whitespace-pre-wrap text-neutral-004">
              {section.content}
            </p>
          </section>
        ))}
      </section>

      <section className="flex h-31.5 shrink-0 flex-col gap-1 px-6 py-5">
        <label
          htmlFor={`philosophy-memo-${articleId}`}
          className="text-body-m3 text-white"
        >
          메모
        </label>
        <textarea
          id={`philosophy-memo-${articleId}`}
          value={memo}
          disabled={!article}
          onChange={(event) => updateMemo(event.currentTarget.value)}
          onBlur={() => void saveMemo()}
          maxLength={1000}
          placeholder="이곳에 메모를 작성하세요."
          className="min-h-0 w-full flex-1 resize-none bg-transparent text-body-r6 text-neutral-004 outline-none placeholder:text-neutral-006"
        />
      </section>

      <aside aria-label="광고 영역" className="h-17.5 shrink-0 bg-green" />
      <Toast message={toastMessage} />
    </main>
  );
}

export default OneminuteDetailPage;
