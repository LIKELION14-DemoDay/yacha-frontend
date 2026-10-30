import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getPhilosophyBookmarks } from "../../apis/philosophy";
import OneminuteCard from "../../components/OneminuteCard";
import TopBar from "../../components/TopBar";
import type { PhilosophyArticle } from "../../types/philosophy";

function MyBookmarkPage() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<PhilosophyArticle[]>([]);
  const [hasNext, setHasNext] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [request, setRequest] = useState({ page: 0, attempt: 0 });
  const isRequestPending = useRef(true);
  const listRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const controller = new AbortController();

    getPhilosophyBookmarks(request.page, controller.signal)
      .then(({ data }) => {
        if (controller.signal.aborted) return;

        setArticles((current) => {
          const byId = new Map(
            (request.page === 0 ? [] : current).map((article) => [
              article.id,
              article,
            ]),
          );
          data.articles.forEach((article) => byId.set(article.id, article));
          return [...byId.values()];
        });
        setHasNext(data.hasNext);
      })
      .catch((cause: unknown) => {
        if (!controller.signal.aborted) setError(cause);
      })
      .finally(() => {
        if (!controller.signal.aborted) isRequestPending.current = false;
      });

    return () => controller.abort();
  }, [request]);

  const handleListScroll = () => {
    const list = listRef.current;
    if (
      !list ||
      isRequestPending.current ||
      !hasNext ||
      list.scrollHeight - list.scrollTop - list.clientHeight > 100
    ) {
      return;
    }

    isRequestPending.current = true;
    setError(null);
    setRequest((current) => ({
      page: error ? current.page : current.page + 1,
      attempt: current.attempt + 1,
    }));
  };

  return (
    <main className="mx-auto flex h-full w-full max-w-100.5 flex-col overflow-hidden bg-secondary text-white">
      <TopBar title="북마크" onBack={() => navigate("/mypage")} />

      <section
        ref={listRef}
        onScroll={handleListScroll}
        className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-6 scrollbar-none [&::-webkit-scrollbar]:hidden"
      >
        <ul className="flex flex-col gap-2.5 pb-6">
          {articles.map((article) => (
            <li key={article.id}>
              <OneminuteCard article={article} />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default MyBookmarkPage;
