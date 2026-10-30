/**
 * 화면 키보드가 올라오면 앱 화면을 "실제로 보이는 영역"(visualViewport)에 맞춤
 * iOS 는 키보드가 올라와도 화면 높이를 줄이지 않고 보이는 영역을 위로 옮기므로,
 * 그 위치 · 높이를 따라가 위쪽(상단 바 · 타이머)은 제자리, 아래쪽(입력창)만 키보드 위에 붙게 함
 * 폼 이동 바(위 · 아래 · 완료)가 있으면 그 높이도 이미 빠져 있어 바 위에, 없으면 키보드 위에 붙음
 */
import { useEffect } from "react";

// 이보다 많이 가려지면 키보드가 올라온 것으로 봄 (주소창이 접히고 펴지는 정도는 무시)
const KEYBOARD_MIN_HEIGHT_PX = 120;

export const useKeyboardViewport = () => {
  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;

    const html = document.documentElement;
    let frame = 0;

    // iOS 가 보이는 영역을 옮기는 매 순간 같은 프레임에 따라가야 출렁임이 적음
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const isKeyboardOpen =
          window.innerHeight - viewport.height > KEYBOARD_MIN_HEIGHT_PX;

        html.style.setProperty("--viewport-height", `${viewport.height}px`);
        html.style.setProperty("--viewport-top", `${viewport.offsetTop}px`);
        html.toggleAttribute("data-keyboard-open", isKeyboardOpen);
      });
    };

    update();
    viewport.addEventListener("resize", update);
    viewport.addEventListener("scroll", update);

    return () => {
      cancelAnimationFrame(frame);
      viewport.removeEventListener("resize", update);
      viewport.removeEventListener("scroll", update);
      html.removeAttribute("data-keyboard-open");
    };
  }, []);
};
