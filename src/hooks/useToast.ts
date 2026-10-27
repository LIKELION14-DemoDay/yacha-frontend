/**
 * 토스트 알림을 띄우고 일정 시간 뒤 자동으로 닫는 훅
 * 새 알림이 오면 이전 알림을 바로 바꿔서 보여줌
 */
import { useCallback, useEffect, useRef, useState } from "react";

const TOAST_DURATION_MS = 2500;

export const useToast = () => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setToastMessage(message);
    timeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, TOAST_DURATION_MS);
  }, []);

  useEffect(
    () => () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    },
    [],
  );

  return { toastMessage, showToast };
};
