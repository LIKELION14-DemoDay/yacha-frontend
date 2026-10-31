/**
 * 화면 키보드가 올라오면 앱 화면을 "실제로 보이는 영역"(visualViewport)에 맞춤
 * iOS 는 키보드가 올라와도 화면 높이를 줄이지 않고 보이는 영역을 위로 옮기므로,
 * 그 위치 · 높이를 따라가 위쪽(상단 바 · 타이머)은 제자리, 아래쪽(입력창)만 키보드 위에 붙게 함
 * 폼 이동 바(위 · 아래 · 완료)가 있으면 그 높이도 이미 빠져 있어 바 위에, 없으면 키보드 위에 붙음
 */
import { useEffect } from "react";

// 키보드 없을 때보다 이만큼 넘게 줄면 키보드가 올라온 것으로 봄 (주소창이 접히고 펴지는 정도는 무시)
const KEYBOARD_MIN_HEIGHT_PX = 120;

// 글자를 입력하는 칸에 포커스가 있는지 (키보드는 이때만 올라옴)
const isEditing = () => {
  const element = document.activeElement;
  return (
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement ||
    (element instanceof HTMLElement && element.isContentEditable)
  );
};

// iPhone 홈 화면 앱(상태 표시줄 투명)은 화면 높이를 상태 표시줄만큼 짧게 알려 줘서 아래에 빈 띠가 생김
// 실제 화면 높이와의 차이를 재서 앱 틀을 그만큼 아래로 늘림 (차이가 없는 iOS 에서는 0)
const getStandaloneBottomGap = () => {
  const isIosStandalone =
    (navigator as Navigator & { standalone?: boolean }).standalone === true;
  if (!isIosStandalone) return 0;

  const isPortrait = window.innerHeight >= window.innerWidth;
  const screenHeight = isPortrait
    ? Math.max(screen.width, screen.height)
    : Math.min(screen.width, screen.height);

  return Math.max(0, screenHeight - window.innerHeight);
};

export const useKeyboardViewport = () => {
  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;

    const html = document.documentElement;
    let frame = 0;
    // 키보드가 없을 때의 화면 높이 (iOS 버전에 따라 키보드가 올라오면 window 높이도 같이 줄어서 따로 기억)
    let fullHeight = Math.max(viewport.height, window.innerHeight);

    // iOS 가 보이는 영역을 옮기는 매 순간 같은 프레임에 따라가야 출렁임이 적음
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const editing = isEditing();
        // 입력 중이 아니면 키보드가 없으니 지금 높이가 기준 (화면 회전 · 주소창 변화 반영)
        if (!editing) {
          fullHeight = Math.max(viewport.height, window.innerHeight);
          html.style.setProperty(
            "--standalone-bottom-gap",
            `${getStandaloneBottomGap()}px`,
          );
        }

        const isKeyboardOpen =
          editing && fullHeight - viewport.height > KEYBOARD_MIN_HEIGHT_PX;

        html.style.setProperty("--viewport-height", `${viewport.height}px`);
        html.style.setProperty("--viewport-top", `${viewport.offsetTop}px`);
        html.toggleAttribute("data-keyboard-open", isKeyboardOpen);
      });
    };

    update();
    viewport.addEventListener("resize", update);
    viewport.addEventListener("scroll", update);
    // 키보드가 뜨기 직전 · 닫힌 직후에도 다시 잼
    document.addEventListener("focusin", update);
    document.addEventListener("focusout", update);

    return () => {
      cancelAnimationFrame(frame);
      viewport.removeEventListener("resize", update);
      viewport.removeEventListener("scroll", update);
      document.removeEventListener("focusin", update);
      document.removeEventListener("focusout", update);
      html.removeAttribute("data-keyboard-open");
    };
  }, []);
};
