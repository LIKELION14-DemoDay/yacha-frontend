import { useEffect, useRef } from "react";
import lottie from "lottie-web";

interface OnboardingIntroProps {
  onComplete: () => void;
}

function OnboardingIntro({ onComplete }: OnboardingIntroProps) {
  const animationContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!animationContainer.current) return;

    // 파일 로딩이나 재생에 실패해도 온보딩으로 진행합니다.
    const fallbackTimeout = window.setTimeout(onComplete, 10_000);
    const animation = lottie.loadAnimation({
      container: animationContainer.current,
      renderer: "svg",
      path: `${import.meta.env.BASE_URL}onboarding-intro.json`,
      autoplay: true,
      loop: false,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid meet",
      },
    });

    animation.addEventListener("complete", onComplete);
    animation.addEventListener("data_failed", onComplete);
    animation.addEventListener("error", onComplete);

    return () => {
      window.clearTimeout(fallbackTimeout);
      animation.removeEventListener("complete", onComplete);
      animation.removeEventListener("data_failed", onComplete);
      animation.removeEventListener("error", onComplete);
      animation.destroy();
    };
  }, [onComplete]);

  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      role="status"
      aria-label="야차철학 시작 중"
    >
      <div
        ref={animationContainer}
        className="h-[220px] w-[146px]"
        aria-hidden="true"
      />
    </div>
  );
}

export default OnboardingIntro;
