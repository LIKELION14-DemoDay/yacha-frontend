import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  getPastPhilosophy,
  getThisWeekPhilosophy,
} from "../../apis/philosophy";
import angleLeft from "../../assets/angle-left.svg";
import OneminuteCard from "../../components/OneminuteCard";
import StatusBar from "../../components/StatusBar";
import type { PhilosophyArticle } from "../../types/philosophy";

const periods = [
  { id: "current", label: "금주의 1분 철학" },
  { id: "previous", label: "이전 콘텐츠" },
] as const;

type Period = (typeof periods)[number]["id"];

function OneMinutePage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [request, setRequest] = useState<{
    period: Period;
    page: number;
    attempt: number;
  }>({
    period: searchParams.get("period") === "previous" ? "previous" : "current",
    page: 0,
    attempt: 0,
  });
  const [articles, setArticles] = useState<PhilosophyArticle[]>([]);
  const [hasNext, setHasNext] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const isRequestPending = useRef(true);
  const listRef = useRef<HTMLElement>(null);
  const selectedPeriod = request.period;

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        const response =
          request.period === "current"
            ? await getThisWeekPhilosophy(controller.signal)
            : await getPastPhilosophy(request.page, controller.signal);

        if (controller.signal.aborted) return;

        const { data } = response;
        setArticles((current) => {
          // 페이지 경계에 같은 글이 와도 중복 카드를 표시하지 않습니다.
          const byId = new Map(
            (request.page === 0 ? [] : current).map((article) => [
              article.id,
              article,
            ]),
          );
          data.articles.forEach((article) => byId.set(article.id, article));
          return [...byId.values()];
        });
        setHasNext("hasNext" in data && data.hasNext);
      } catch (cause: unknown) {
        if (controller.signal.aborted) return;

        // traceId를 포함한 오류 원본을 보존하고 화면에는 안내를 추가하지 않습니다.
        setError(cause);
      } finally {
        if (!controller.signal.aborted) {
          isRequestPending.current = false;
        }
      }
    };

    void load();
    return () => controller.abort();
  }, [request]);

  const handlePeriodChange = (period: Period) => {
    if (period === selectedPeriod) return;

    setArticles([]);
    setHasNext(false);
    isRequestPending.current = true;
    setError(null);
    setRequest({ period, page: 0, attempt: 0 });
    setSearchParams(period === "previous" ? { period: "previous" } : {}, {
      replace: true,
    });
    listRef.current?.scrollTo({ top: 0 });
  };

  const loadMore = () => {
    if (selectedPeriod !== "previous" || isRequestPending.current || !hasNext) {
      return;
    }

    isRequestPending.current = true;
    setError(null);
    setRequest((current) => ({
      ...current,
      // 실패한 페이지는 재시도하고, 성공한 페이지의 다음 장만 요청합니다.
      page: error ? current.page : current.page + 1,
      attempt: current.attempt + 1,
    }));
  };

  const handleListScroll = () => {
    const list = listRef.current;
    if (list && list.scrollHeight - list.scrollTop - list.clientHeight <= 100) {
      loadMore();
    }
  };

  return (
    <main className="mx-auto flex h-dvh w-full max-w-100.5 flex-col overflow-hidden bg-secondary text-white">
      <div className="shrink-0">
        <StatusBar />
      </div>

      <header className="flex h-12 shrink-0 items-center justify-between px-6 py-2">
        <button
          type="button"
          onClick={() => navigate("/home")}
          className="flex h-8 w-6 shrink-0 cursor-pointer items-center justify-center"
        >
          <img src={angleLeft} alt="" className="size-6" />
        </button>
      </header>

      <div className="flex shrink-0 flex-col items-start gap-1 px-6 pb-5">
        <h1 className="text-subhead-m2">1분 철학</h1>
        <p className="text-subhead-r8 text-neutral-007">
          하루 1분, 가볍게 철학을 만나보세요.
        </p>
      </div>

      <nav className="flex shrink-0 px-6 pt-2 pb-5">
        {periods.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => handlePeriodChange(id)}
            className={`flex min-w-0 flex-1 cursor-pointer items-center justify-center pb-3 ${
              selectedPeriod === id
                ? "border-b-2 border-main text-body-m3 text-main"
                : "border-b border-neutral-007 text-body-r4 text-neutral-007"
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      <section
        ref={listRef}
        onScroll={handleListScroll}
        tabIndex={0}
        className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-6 scrollbar-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-main [&::-webkit-scrollbar]:hidden"
      >
        <ul className="flex flex-col gap-2 pb-2">
          {articles.map((article) => (
            <li key={article.id}>
              <OneminuteCard article={article} />
            </li>
          ))}
        </ul>
      </section>

      {/* 추후 광고를 삽입할 독립 영역입니다. */}
      <aside className="h-17.5 shrink-0 bg-green" />
    </main>
  );
}

export default OneMinutePage;
