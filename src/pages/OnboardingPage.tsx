import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import brandLogo from "../assets/brand-logo.svg";
import onboardingImage from "../assets/onboarding.png";
import onboardingSecondImage from "../assets/onboarding2.png";
import { getMyProfile } from "../apis/users";
import { getAccessToken } from "../apis/tokenStore";
import LongButton from "../components/Button";
import { readProfileCache, writeProfileCache } from "../utils/profileCache";

const OnboardingIntro = lazy(() => import("../components/OnboardingIntro"));

const INTRO_STORAGE_KEY = "yacha-onboarding-intro-played";

function shouldShowIntro() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return false;
  }

  try {
    return sessionStorage.getItem(INTRO_STORAGE_KEY) !== "true";
  } catch {
    return true;
  }
}

const onboardingSlides = [
  {
    image: onboardingImage,
    imageAlt: "두 사람이 서로 토론하는 모습",
    title: (
      <>
        야차철학에
        <br />
        오신 것을 환영합니다.
      </>
    ),
    description: (
      <>
        야차철학은 생각이 다른 사람과 철학으로
        <br />
        맞붙는 1:1 토론 배틀 플랫폼입니다.
      </>
    ),
  },
  {
    image: onboardingSecondImage,
    imageAlt: "스마트폰으로 철학 콘텐츠를 공부하는 모습",
    title: (
      <>
        하루에 한 번씩
        <br />
        철학을 공부해보세요.
      </>
    ),
    description: (
      <>
        금주의 이슈와 관련하여 매주 새로운 철학
        <br />
        관련 학습이 가능해요.
      </>
    ),
  },
] as const;

// 다시 들어온 사용자 처리: 로그인한 상태에서 밸런스 게임을 이미 했거나 건너뛰었으면 온보딩 없이 홈으로
// (저장해 둔 내 정보가 있으면 바로, 없으면 서버에 확인하는 동안 빈 화면)
type EntryStatus = "checking" | "onboarding" | "home";

const getInitialEntryStatus = (): EntryStatus => {
  if (!getAccessToken()) return "onboarding";

  const cachedProfile = readProfileCache();
  if (!cachedProfile) return "checking";
  return cachedProfile.balanceGameRequired ? "onboarding" : "home";
};

function OnboardingPage() {
  const navigate = useNavigate();
  const [entryStatus, setEntryStatus] = useState(getInitialEntryStatus);

  useEffect(() => {
    if (entryStatus !== "checking") return;

    const controller = new AbortController();

    getMyProfile(controller.signal)
      .then((profile) => {
        writeProfileCache(profile);
        setEntryStatus(profile.balanceGameRequired ? "onboarding" : "home");
      })
      .catch(() => {
        // 확인하지 못하면 처음 온 사용자처럼 온보딩을 보여 줌
        if (!controller.signal.aborted) setEntryStatus("onboarding");
      });

    return () => controller.abort();
  }, [entryStatus]);
  const [showIntro, setShowIntro] = useState(shouldShowIntro);
  const [currentSlide, setCurrentSlide] = useState(0);

  const finishIntro = useCallback(() => {
    try {
      sessionStorage.setItem(INTRO_STORAGE_KEY, "true");
    } catch {
      // 저장소가 제한된 환경에서도 온보딩으로 전환합니다.
    }
    setShowIntro(false);
  }, []);

  // 다음 슬라이드 그림이 눌렀을 때 비었다가 뜨지 않게 미리 받아 둠
  useEffect(() => {
    onboardingSlides.forEach(({ image }) => {
      new Image().src = image;
    });
  }, []);

  const slide = onboardingSlides[currentSlide];
  const isLastSlide = currentSlide === onboardingSlides.length - 1;

  const handleNext = () => {
    if (isLastSlide) {
      navigate("/balance");
      return;
    }

    setCurrentSlide((index) => Math.min(index + 1, onboardingSlides.length - 1));
  };

  if (entryStatus === "home") {
    return <Navigate to="/home" replace />;
  }

  if (entryStatus === "checking") {
    return <main className="h-full bg-secondary" />;
  }

  if (showIntro) {
    return (
      <main className="relative mx-auto flex h-full w-full max-w-100.5 flex-col overflow-hidden bg-secondary">
        <Suspense fallback={null}>
          <OnboardingIntro onComplete={finishIntro} />
        </Suspense>
      </main>
    );
  }

  return (
    // 가운데 그림이 남는 높이에 맞춰 줄어들어, 작은 화면에서도 버튼까지 한 화면에 (cqh = 화면 높이의 1%)
    // 그래도 모자란 아주 짧은 화면에서는 스크롤
    <main className="mx-auto flex h-full w-full max-w-100.5 flex-col overflow-y-auto bg-secondary [container-type:size] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <section className="flex shrink-0 flex-col gap-6">
        <div className="flex flex-col items-start self-stretch px-6 py-4">
          {/* 크기를 미리 정해 로고가 늦게 떠도 아래 내용이 밀리지 않게 */}
          <img src={brandLogo} alt="야차철학" width={128} height={26} />
        </div>

        <div
          aria-live="polite"
          aria-atomic="true"
          className="flex flex-col items-start gap-3 px-6 py-5"
        >
          <h1 className="text-headline-sb3 whitespace-nowrap text-white">
            {slide.title}
          </h1>
          <p className="text-body-r2 whitespace-nowrap text-neutral-005">
            {slide.description}
          </p>
        </div>
      </section>

      <section className="flex min-h-24 flex-1 items-center justify-center py-[6cqh]">
        <img
          src={slide.image}
          alt={slide.imageAlt}
          className="block aspect-[402/256.416] max-h-full w-full object-contain"
        />
      </section>
      <section className="flex shrink-0 flex-col gap-5">
        <div
          className="flex h-7 shrink-0 items-center justify-center gap-2.5 p-2.5"
          role="img"
          aria-label={`${onboardingSlides.length}개 중 ${currentSlide + 1}번째 화면`}
        >
          {onboardingSlides.map((_, index) => {
            const isActive = index === currentSlide;

            return (
              <span
                key={index}
                aria-hidden="true"
                className={`h-2 shrink-0 rounded-full transition-[width,background-color] duration-300 ${
                  isActive ? "w-5 bg-main" : "w-2 bg-neutral-004"
                }`}
              />
            );
          })}
        </div>

        <div className="px-6 pt-2.5 pb-[9.9cqh]">
          <LongButton
            className="!bg-main !text-white hover:!bg-main-006"
            onClick={handleNext}
          >
            {isLastSlide ? "시작하기" : "다음"}
          </LongButton>
        </div>
      </section>
    </main>
  );
}

export default OnboardingPage;
