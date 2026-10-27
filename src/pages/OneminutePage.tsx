import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import angleLeft from "../assets/angle-left.svg";
import OneminuteCard from "../components/OneminuteCard";
import StatusBar from "../components/StatusBar";

const periods = [
  { id: "current", label: "금주의 1분 철학" },
  { id: "previous", label: "이전 콘텐츠" },
] as const;

type Period = (typeof periods)[number]["id"];

// API 연동 전 레이아웃과 북마크 표시를 확인하기 위한 예시 데이터입니다.
const contents = [true, false, true, false, false].map(
  (isBookmarked, index) => ({
    id: index + 1,
    category: "sort",
    title: "Title",
    philosophers: ["아리스토텔레스", "플라톤"],
    isBookmarked,
  }),
);

const contentsByPeriod = {
  current: contents,
  previous: [],
};

function OneMinutePage() {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("current");
  const listRef = useRef<HTMLElement>(null);
  const selectedLabel = periods.find(({ id }) => id === selectedPeriod)!.label;
  const visibleContents = contentsByPeriod[selectedPeriod];

  const handlePeriodChange = (period: Period) => {
    setSelectedPeriod(period);
    listRef.current?.scrollTo({ top: 0 });
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
          aria-label="홈으로 돌아가기"
          className="flex h-8 w-6 shrink-0 cursor-pointer items-center justify-center"
        >
          <img src={angleLeft} alt="" className="size-6" />
        </button>
      </header>

      <div className="flex shrink-0 flex-col items-start gap-1 px-6 pb-5">
        <h1 className="text-subhead-m2">1분 철학</h1>
        <p className="text-subhead-r8 text-neutral-005">
          하루 1분, 가볍게 철학을 만나보세요.
        </p>
      </div>

      <nav
        aria-label="콘텐츠 기간 선택"
        className="flex shrink-0 px-6 pt-2 pb-5"
      >
        {periods.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            aria-pressed={selectedPeriod === id}
            aria-controls="oneminute-content-list"
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
        id="oneminute-content-list"
        aria-label={`${selectedLabel} 목록`}
        tabIndex={0}
        className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-6 [scrollbar-width:none] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-main [&::-webkit-scrollbar]:hidden"
      >
        {visibleContents.length > 0 ? (
          <ul className="flex flex-col gap-2 pb-2">
            {visibleContents.map(({ id, ...content }) => (
              <li key={id}>
                <OneminuteCard {...content} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-10 text-center text-body-r4 text-neutral-005">
            이전 콘텐츠가 없습니다.
          </p>
        )}
      </section>

      {/* 추후 광고를 삽입할 독립 영역입니다. */}
      <aside aria-label="광고 영역" className="h-17.5 shrink-0 bg-green" />
    </main>
  );
}

export default OneMinutePage;
