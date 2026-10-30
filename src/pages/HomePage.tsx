import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import ethicsIcon from "../assets/balance-scale-solid.svg";
import humanIcon from "../assets/home/temporary-human-home.svg";
import lifeIcon from "../assets/home/temporary-life-home.svg";
import moneyIcon from "../assets/home/temporary-money-home.svg";
import relationIcon from "../assets/home/temporary-relation-home.svg";
import socialIcon from "../assets/home/temporary-social-home.svg";
import techIcon from "../assets/home/temporary-tech-home.svg";
import trueIcon from "../assets/home/temporary-true-home.svg";
import homeImage from "../assets/home-image1.png";
import homeLogo from "../assets/home-logo.svg";
import LongButton from "../components/Button";
import PhilosopherImage from "../components/PhilosopherImage";
import ConfirmModal from "../components/ConfirmModal";
import Toast from "../components/Toast";
import { skipBalanceGame } from "../apis/balanceGame";
import { useUserProfile } from "../hooks/useUserProfile";
import { useToast } from "../hooks/useToast";
import { useResumeSession } from "../hooks/useResumeSession";
import { getApiErrorMessage } from "../utils/apiError";
import type { TopicCategory } from "../types/topic";
import { CATEGORIES, CATEGORY_LABEL } from "../utils/category";
import { getAllWaitingRooms, NO_ROOM_MESSAGE } from "../utils/waitingRooms";
import { getThisWeekPhilosophy } from "../apis/philosophy";
import {
  GUEST_ONLY_MESSAGE,
  type PhilosophyArticle,
} from "../types/philosophy";

const CATEGORY_ICONS: Record<TopicCategory, string> = {
  HUMAN: humanIcon,
  RELATIONSHIP: relationIcon,
  ETHICS: ethicsIcon,
  SOCIETY: socialIcon,
  LIFE_AND_DEATH: lifeIcon,
  TECH_AND_FUTURE: techIcon,
  MONEY_AND_SUCCESS: moneyIcon,
  TRUTH_AND_BELIEF: trueIcon,
};

type PhilosophyCardItem = {
  // 이번 주 글이면 상세로 이동할 글 번호 (예시 글은 없음)
  id?: number;
  category: string;
  question: string;
  philosophers: readonly string[];
};

// 게스트(1분 철학 회원 전용)와 이번 주 글이 없을 때 보여 주는 예시 글
const SAMPLE_PHILOSOPHY_CARDS: PhilosophyCardItem[] = [
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
];

const MAX_VISIBLE_PHILOSOPHERS = 2;

const toPhilosophyCard = (article: PhilosophyArticle): PhilosophyCardItem => ({
  id: article.id,
  category: `#${article.topic.categoryName}`,
  question: article.topic.statement,
  philosophers: article.philosophers,
});

function TopicCard({
  topic,
  icon,
  onClick,
}: {
  topic: string;
  icon: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex min-w-0 cursor-pointer flex-col items-center gap-1 text-body-r6 text-white"
      aria-label={`${topic} 주제 선택`}
    >
      {/* 폭에 맞추되 키가 작은 화면에서는 높이 비율로 줄어듦 */}
      <img
        src={icon}
        alt=""
        className="aspect-square w-full max-w-[8cqh] object-contain"
      />
      <span className="w-full truncate text-center">{topic}</span>
    </button>
  );
}

const PhilosophyCard = ({
  card,
  onClick,
}: {
  card: PhilosophyCardItem;
  onClick: () => void;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-[14cqh] min-h-28 w-52.5 shrink-0 cursor-pointer snap-center flex-col items-start justify-between rounded-[10px] bg-neutral-009 px-3 py-2.5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main"
    >
      <div className="flex flex-col items-start gap-1">
        <p className="text-body-r6 text-main">{card.category}</p>
        {/* 카드 높이가 정해져 있어 긴 질문은 두 줄까지만 */}
        <h3 className="line-clamp-2 text-subhead-m7 text-white">
          {card.question}
        </h3>
      </div>

      {/* 한 줄에 두 명까지, 나머지는 +N 으로 */}
      <div className="flex min-w-0 gap-1">
        {card.philosophers
          .slice(0, MAX_VISIBLE_PHILOSOPHERS)
          .map((philosopher) => (
            <span
              key={philosopher}
              className="truncate rounded-full border border-neutral-007 px-2 py-1 text-caption-r2 whitespace-nowrap text-neutral-003"
            >
              {philosopher}
            </span>
          ))}
        {card.philosophers.length > MAX_VISIBLE_PHILOSOPHERS ? (
          <span className="shrink-0 rounded-full border border-neutral-007 px-2 py-1 text-caption-r2 whitespace-nowrap text-neutral-003">
            +{card.philosophers.length - MAX_VISIBLE_PHILOSOPHERS}
          </span>
        ) : null}
      </div>
    </button>
  );
};

function HomePage() {
  const navigate = useNavigate();
  // 참여 중인 게임이 있으면 그 화면으로 바로 이동
  useResumeSession();
  const philosophySliderRef = useRef<HTMLDivElement>(null);
  const { profile } = useUserProfile();
  const [balancePromptDismissed, setBalancePromptDismissed] = useState(false);
  const skipPendingRef = useRef(false);
  const { toastMessage, showToast } = useToast();
  const [isFindingRoom, setIsFindingRoom] = useState(false);

  // 빠른 방 찾기에서 돌아오면 넘겨받은 안내를 한 번 띄움 (뒤로 와도 다시 안 뜨게 지움)
  const location = useLocation();
  const returnedToast = (location.state as { toast?: string } | null)?.toast;

  useEffect(() => {
    if (!returnedToast) return;

    showToast(returnedToast);
    navigate(location.pathname, { replace: true, state: null });
  }, [returnedToast, showToast, navigate, location.pathname]);

  // 빠른 방 찾기: 모든 카테고리의 대기 방을 불러와 있으면 하나씩 보는 화면으로, 없으면 안내
  const handleQuickMatch = async () => {
    setIsFindingRoom(true);
    try {
      const rooms = await getAllWaitingRooms();
      if (rooms.length === 0) {
        showToast(NO_ROOM_MESSAGE);
        return;
      }
      navigate("/game/quick", { state: { rooms } });
    } catch {
      showToast("방 목록을 불러오지 못했어요.");
    } finally {
      setIsFindingRoom(false);
    }
  };

  const handleSkipBalance = async () => {
    if (skipPendingRef.current) return;
    skipPendingRef.current = true;
    try {
      await skipBalanceGame(true);
      setBalancePromptDismissed(true);
    } catch (error: unknown) {
      showToast(getApiErrorMessage(error));
    } finally {
      skipPendingRef.current = false;
    }
  };

  // 회원은 이번 주 글, 게스트는 예시 글 (null 이면 아직 불러오는 중)
  const isMember = profile ? !profile.isGuest : null;
  const [weeklyCards, setWeeklyCards] = useState<PhilosophyCardItem[] | null>(
    null,
  );

  useEffect(() => {
    if (isMember !== true) return;

    const controller = new AbortController();

    getThisWeekPhilosophy(controller.signal)
      .then(({ data }) => setWeeklyCards(data.articles.map(toPhilosophyCard)))
      .catch(() => {
        // 불러오지 못하면 예시 글로 대신 보여 줌
        if (!controller.signal.aborted) setWeeklyCards([]);
      });

    return () => controller.abort();
  }, [isMember]);

  const philosophyCards =
    isMember && weeklyCards?.length ? weeklyCards : SAMPLE_PHILOSOPHY_CARDS;
  // 회원 글을 받기 전에는 예시 글이 잠깐 비치지 않게 자리만 잡아 둠
  const isLoadingCards =
    isMember === null || (isMember && weeklyCards === null);

  // 게스트는 안내만, 회원은 글 상세(예시 글이면 1분 철학 목록)로
  const openPhilosophyCard = (card: PhilosophyCardItem) => {
    if (profile?.isGuest) {
      showToast(GUEST_ONLY_MESSAGE);
      return;
    }
    navigate(card.id ? `/oneminute/${card.id}` : "/oneminute");
  };

  useEffect(() => {
    const slider = philosophySliderRef.current;
    if (!slider) return;

    const centerCard = slider.children.item(1) as HTMLElement | null;
    if (!centerCard) return;

    slider.scrollLeft =
      centerCard.offsetLeft - (slider.clientWidth - centerCard.offsetWidth) / 2;
  }, [weeklyCards, isLoadingCards]);

  return (
    // 높이는 화면(앱 틀) 비율로 나눔: cqh = 화면 높이의 1%, 남는 공간은 상단 이미지가 채움
    // 아주 작은 화면에서는 광고는 아래에 고정하고 그 위만 스크롤
    // 상단 이미지는 노치 뒤까지 이어지고, 로고 · 프로필만 노치 아래로 띄움 (data-under-notch)
    <main
      data-under-notch
      className="mx-auto flex h-full w-full max-w-100.5 flex-col overflow-hidden bg-secondary [container-type:size]"
    >
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <header
          className="min-h-[calc(3rem+env(safe-area-inset-top))] flex-1 bg-cover bg-center pt-[env(safe-area-inset-top)]"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(12, 12, 12, 0.08) 0%, rgba(12, 12, 12, 0.14) 45%, #0c0c0c 100%), url(${homeImage})`,
          }}
        >
          <div className="flex items-start justify-between px-6 pt-3">
            <img src={homeLogo} alt="야차철학" className="object-contain" />

            <button
              type="button"
              aria-label="프로필 보기"
              onClick={() => navigate("/mypage")}
              className="flex size-8 cursor-pointer items-center justify-center rounded-[2px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main"
            >
              <PhilosopherImage
                imageUrl={profile?.philosopher?.imageUrl}
                size="sm"
              />
            </button>
          </div>
        </header>

        <section
          aria-labelledby="colosseum-title"
          className="flex shrink-0 flex-col gap-[1.6cqh] py-[2cqh]"
        >
          <div className="flex flex-col items-start gap-1 px-6">
            <h1 id="colosseum-title" className="text-subhead-m5 text-white">
              야차 콜로세움
            </h1>
            <p className="text-subhead-r8 text-neutral-006">
              다양한 주제로 1대1 키배를 해보세요
            </p>
          </div>

          <div className="px-6">
            <LongButton
              disabled={isFindingRoom}
              aria-busy={isFindingRoom}
              onClick={handleQuickMatch}
              className={
                isFindingRoom
                  ? "!bg-main-009 !text-neutral-004"
                  : "!bg-main !text-white hover:!bg-main-006"
              }
            >
              빠른 방 찾기
            </LongButton>
          </div>

          <div className="grid grid-cols-4 gap-x-5 gap-y-[2cqh] px-6.5">
            {CATEGORIES.map((category) => (
              <TopicCard
                key={category}
                topic={CATEGORY_LABEL[category]}
                icon={CATEGORY_ICONS[category]}
                onClick={() => navigate(`/game/rooms?category=${category}`)}
              />
            ))}
          </div>
        </section>

        <div className="shrink-0 pt-[1.5cqh] pb-[1cqh]" aria-hidden="true">
          <div className="h-1 bg-neutral-009" />
        </div>

        <section
          aria-labelledby="philosophy-title"
          className="flex shrink-0 flex-col gap-[2cqh] pt-[2.4cqh] pb-[2cqh]"
        >
          <div className="flex flex-col gap-1 px-6">
            <div className="flex items-center justify-between">
              <h2 id="philosophy-title" className="text-subhead-m5 text-white">
                오늘의 1분 철학
              </h2>
              <button
                type="button"
                onClick={() => {
                  // 1분 철학은 회원 전용이라 게스트는 안내만
                  if (profile?.isGuest) {
                    showToast(GUEST_ONLY_MESSAGE);
                    return;
                  }
                  navigate("/oneminute");
                }}
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
            aria-busy={isLoadingCards}
            className={`flex snap-x snap-mandatory gap-3 overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden ${isLoadingCards ? "invisible" : ""}`}
          >
            {philosophyCards.map((card) => (
              <PhilosophyCard
                key={card.id ?? card.question}
                card={card}
                onClick={() => openPhilosophyCard(card)}
              />
            ))}
          </div>
        </section>
      </div>

      <aside aria-label="광고 영역" className="h-17.5 shrink-0 bg-green" />
      <ConfirmModal
        open={profile?.balanceGameRequired === true && !balancePromptDismissed}
        title="밸런스 게임을 시작할까요?"
        description="밸런스 게임으로 내 철학 유형을 알아보세요."
        cancelLabel="건너뛰기"
        confirmLabel="시작하기"
        onCancel={handleSkipBalance}
        onConfirm={() => {
          if (!skipPendingRef.current) navigate("/balance");
        }}
        onDismiss={() => setBalancePromptDismissed(true)}
      />
      <Toast message={toastMessage} />
    </main>
  );
}

export default HomePage;
