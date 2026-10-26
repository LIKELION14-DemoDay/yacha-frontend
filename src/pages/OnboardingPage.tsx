import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import brandLogo from "../assets/brand-logo.svg";
import onboardingImage from "../assets/onboarding.png";
import LongButton from "../components/Button";
import StatusBar from "../components/StatusBar";

const OnboardingIntro = lazy(() => import("../components/OnboardingIntro"));

const AUTO_PLAY_DELAY = 10_000;
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

function OnboardingPage() {
  const navigate = useNavigate();
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

  useEffect(() => {
    if (showIntro || onboardingSlides.length < 2) return;

    const intervalId = window.setInterval(() => {
      setCurrentSlide(
        (previousSlide) => (previousSlide + 1) % onboardingSlides.length,
      );
    }, AUTO_PLAY_DELAY);

    return () => window.clearInterval(intervalId);
  }, [showIntro]);

  const slide = onboardingSlides[currentSlide];

  if (showIntro) {
    return (
      <main className="relative mx-auto flex h-dvh min-h-166.75 w-full max-w-100.5 flex-col overflow-hidden bg-secondary">
        <StatusBar />
        <Suspense fallback={null}>
          <OnboardingIntro onComplete={finishIntro} />
        </Suspense>
      </main>
    );
  }

  return (
    <main className="mx-auto flex h-dvh min-h-166.75 w-full max-w-100.5 flex-col overflow-hidden bg-secondary">
      <StatusBar />

      <section className="flex shrink-0 flex-col gap-6">
        <div className="flex flex-col items-start self-stretch px-6 py-4">
          <img src={brandLogo} alt="야차철학" />
        </div>

        <div className="flex flex-col items-start gap-3 px-6 py-5">
          <h1 className="text-headline-sb3 whitespace-nowrap text-white">
            {slide.title}
          </h1>
          <p className="text-subhead-m5 whitespace-nowrap text-neutral-006">
            {slide.description}
          </p>
        </div>
      </section>

      <section className="flex min-h-0 flex-1 pt-12.25 pb-20.25">
        <img
          src={onboardingImage}
          alt="두 사람이 서로 토론하는 모습"
          className="h-full max-h-64 w-full object-contain"
        />
      </section>
      <section className="flex h-40.25 shrink-0 flex-col gap-5">
        <div
          className="flex h-7 shrink-0 items-center justify-center gap-2.5 p-2.5"
          aria-label={`${onboardingSlides.length}개 중 ${currentSlide + 1}번째 화면`}
        >
          {onboardingSlides.map((_, index) => {
            const isActive = index === currentSlide;

            return (
              <button
                key={index}
                type="button"
                aria-label={`${index + 1}번째 화면으로 이동`}
                aria-current={isActive ? "step" : undefined}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 shrink-0 cursor-pointer rounded-full transition-[width,background-color] duration-300 ${
                  isActive ? "w-5 bg-main" : "w-2 bg-neutral-004"
                }`}
              />
            );
          })}
        </div>

        <div className="px-6 pt-2.5 pb-20.25">
          <LongButton
            className="!bg-main !text-white hover:!bg-main-006"
            onClick={() => navigate("/balance")}
          >
            시작하기
          </LongButton>
        </div>
      </section>
    </main>
  );
}

export default OnboardingPage;
