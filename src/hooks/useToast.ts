/**
 * 토스트 알림을 띄우고 일정 시간 뒤 자동으로 닫는 훅
 * 새 알림이 오면 이전 알림을 바로 바꿔서 보여줌
 * queue 를 켜면 떠 있는 알림이 사라진 뒤에 이어서 보여줌 (덜 급한 안내용)
 */
import { useCallback, useEffect, useRef, useState } from "react";

export const TOAST_DURATION_MS = 2500;

type ShowToastOptions = {
  // 다른 알림이 떠 있으면 끝날 때까지 기다렸다가 표시
  queue?: boolean;
};

export const useToast = () => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // 지금 떠 있는 알림이 나타난 시각 (없으면 null)
  const shownAtRef = useRef<number | null>(null);
  // 기다리는 알림들 (화면을 떠나면 모두 취소)
  const queuedTimeoutsRef = useRef(new Set<ReturnType<typeof setTimeout>>());

  const display = useCallback((message: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setToastMessage(message);
    shownAtRef.current = Date.now();
    timeoutRef.current = setTimeout(() => {
      setToastMessage(null);
      shownAtRef.current = null;
    }, TOAST_DURATION_MS);
  }, []);

  const showToast = useCallback(
    (message: string, { queue = false }: ShowToastOptions = {}) => {
      if (!queue) {
        display(message);
        return;
      }

      // 기다리는 사이 다른 알림이 또 뜨면 그것도 끝날 때까지 다시 기다림
      const showWhenFree = () => {
        const shownAt = shownAtRef.current;
        const waitMs =
          shownAt === null ? 0 : TOAST_DURATION_MS - (Date.now() - shownAt);

        if (waitMs <= 0) {
          display(message);
          return;
        }

        const timeoutId = setTimeout(() => {
          queuedTimeoutsRef.current.delete(timeoutId);
          showWhenFree();
        }, waitMs);
        queuedTimeoutsRef.current.add(timeoutId);
      };

      showWhenFree();
    },
    [display],
  );

  useEffect(() => {
    const queuedTimeouts = queuedTimeoutsRef.current;

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      queuedTimeouts.forEach(clearTimeout);
    };
  }, []);

  return { toastMessage, showToast };
};
