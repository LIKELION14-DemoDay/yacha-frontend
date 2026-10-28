/**
 * 켜져 있는 동안 Esc 키를 누르면 콜백을 부르는 훅 (팝업 · 바텀시트 닫기)
 */
import { useEffect } from "react";

export const useEscapeKey = (enabled: boolean, onEscape: () => void) => {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onEscape();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled, onEscape]);
};
