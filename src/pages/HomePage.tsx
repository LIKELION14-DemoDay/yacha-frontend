import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import homeImage from "../assets/home-image1.png";
import homeLogo from "../assets/home-logo.svg";
import StatusBar from "../components/StatusBar";

const debateTopics = [
  "인간",
  "관계",
  "윤리",
  "사회",
  "삶과 죽음",
  "미래 기술",
  "돈과 성공",
  "진실과 거짓",
] as const;

const philosophyCards = [
  {
    category: "#인간",
    question: "인간은 본래 선한 존재일까?",
    philosophers: ["루소", "호브스"],
  },
  {
    category: "#진실과 거짓",
    question: "“행복을 위해 거짓말을 해도 될까?”",
    philosophers: ["아리스토텔레스", "플라톤"],
  },
  {
    category: "#윤리",
    question: "옳은 선택은 결과로 판단할 수 있을까?",
    philosophers: ["칸트", "밀"],
  },
] as const;

function TopicCard({ topic }: { topic: (typeof debateTopics)[number] }) {
  return (
    <button
      type="button"
      className="group flex min-w-0 cursor-pointer flex-col items-center gap-1 text-body-r6 text-white"
      aria-label={`${topic} 주제 선택`}
    >
      <span
        aria-hidden="true"
        className="aspect-square w-full bg-white transition-colors group-hover:bg-neutral-003 group-focus-visible:bg-neutral-003"
      />
      <span className="w-full truncate text-center">{topic}</span>
    </button>
  );
}

function PhilosophyCard({ card }: { card: (typeof philosophyCards)[number] }) {
  return (
    <article className="flex h-32 w-52.5 shrink-0 snap-center flex-col items-start justify-between rounded-[10px] bg-neutral-009 px-3 py-2.5">
      <div className="flex flex-col items-start gap-1">
        <p className="text-body-r6 text-main">{card.category}</p>
        <h3 className="text-subhead-m7 text-white">{card.question}</h3>
      </div>

      <div className="flex flex-wrap gap-1">
        {card.philosophers.map((philosopher) => (
          <span
            key={philosopher}
            className="rounded-full border border-neutral-007 px-2 py-1 text-caption-r2 whitespace-nowrap text-neutral-003"
          >
            {philosopher}
          </span>
        ))}
      </div>
    </article>
  );
}

function HomePage() {
  const navigate = useNavigate();
  const philosophySliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const slider = philosophySliderRef.current;
    if (!slider) return;

    const centerCard = slider.children.item(1) as HTMLElement | null;
    if (!centerCard) return;

    slider.scrollLeft =
      centerCard.offsetLeft - (slider.clientWidth - centerCard.offsetWidth) / 2;
  }, []);

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-100.5 flex-col overflow-hidden bg-secondary">
      <header
        className="h-48 shrink-0 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(12, 12, 12, 0.08) 0%, rgba(12, 12, 12, 0.14) 45%, #0c0c0c 100%), url(${homeImage})`,
        }}
      >
        <StatusBar />

        <div className="flex h-34 items-start justify-between px-6 pt-3 pb-20">
          <img src={homeLogo} alt="야차철학" className="object-contain" />

          <button
            type="button"
            aria-label="프로필 보기"
            onClick={() => navigate("/mypage")}
            className="flex size-8 cursor-pointer items-center justify-center rounded-md bg-neutral-001 text-[8px] text-neutral-006 transition-colors hover:bg-neutral-003 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main"
          >
            profile
          </button>
        </div>
      </header>

      <section
        aria-labelledby="colosseum-title"
        className="flex h-80 shrink-0 flex-col gap-4 py-5"
      >
        <div className="flex flex-col items-start gap-1 px-6">
          <h1 id="colosseum-title" className="text-subhead-m5 text-white">
            야차 콜로세움
          </h1>
          <p className="text-subhead-r8 text-neutral-006">
            주제를 고르고 1대1 키배를 해보세요.
          </p>
        </div>

        <div className="grid flex-1 grid-cols-4 gap-x-5 gap-y-5 px-6.5">
          {debateTopics.map((topic) => (
            <TopicCard key={topic} topic={topic} />
          ))}
        </div>
      </section>

      <div className="shrink-0 pt-3 pb-2" aria-hidden="true">
        <div className="h-1 bg-neutral-009" />
      </div>

      <section
        aria-labelledby="philosophy-title"
        className="flex h-63.75 shrink-0 flex-col gap-4 pt-5 pb-10"
      >
        <div className="flex flex-col gap-1 px-6">
          <div className="flex items-center justify-between">
            <h2 id="philosophy-title" className="text-subhead-m5 text-white">
              오늘의 1분 철학
            </h2>
            <button
              type="button"
              onClick={() => navigate("/oneminute")}
              className="shrink-0 cursor-pointer text-body-r6 text-neutral-002 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main"
            >
              더 보기
            </button>
          </div>
          <p className="text-subhead-r8 text-neutral-006">
            매일매일 하는 철학 공부로 논리력 향상!
          </p>
        </div>

        <div
          ref={philosophySliderRef}
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto scrollbar-width:none [&::-webkit-scrollbar]:hidden"
        >
          {philosophyCards.map((card) => (
            <PhilosophyCard key={card.question} card={card} />
          ))}
        </div>
      </section>

      <aside aria-label="광고 영역" className="min-h-20.75 flex-1 bg-green" />
    </main>
  );
}

export default HomePage;
