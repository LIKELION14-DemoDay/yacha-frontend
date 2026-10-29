import { useCallback, useEffect, useRef, useState } from "react";

import { savePhilosophyMemo } from "../apis/philosophy";

export const usePhilosophyMemo = (articleId: number) => {
  const [memo, setMemo] = useState("");
  const draftRef = useRef("");
  const savedRef = useRef("");
  const readyRef = useRef(false);
  const activeRef = useRef(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const pendingRef = useRef<Promise<boolean> | null>(null);

  const initializeMemo = useCallback((value: string | null) => {
    const initial = value ?? "";
    draftRef.current = initial;
    savedRef.current = initial;
    readyRef.current = true;
    setMemo(initial);
  }, []);

  const saveMemo = useCallback((): Promise<boolean> => {
    clearTimeout(timerRef.current);
    if (!readyRef.current) return Promise.resolve(true);
    if (pendingRef.current) return pendingRef.current;

    const flush = async () => {
      // 앞선 저장이 끝난 뒤 최신 초안만 이어서 저장해 응답 순서가 뒤집히지 않게 합니다.
      while (draftRef.current.trim() !== savedRef.current) {
        const submitted = draftRef.current;
        const { data } = await savePhilosophyMemo(articleId, submitted);
        savedRef.current = data.memo ?? "";

        // 저장 중 새로 입력한 내용은 이전 응답으로 덮어쓰지 않습니다.
        if (draftRef.current === submitted) {
          draftRef.current = savedRef.current;
          if (activeRef.current) setMemo(savedRef.current);
        }
      }
      return true;
    };

    pendingRef.current = flush()
      .catch(() => false)
      .finally(() => {
        pendingRef.current = null;
      });
    return pendingRef.current;
  }, [articleId]);

  const updateMemo = (value: string) => {
    const next = value.slice(0, 1000);
    draftRef.current = next;
    setMemo(next);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => void saveMemo(), 600);
  };

  useEffect(() => {
    activeRef.current = true;
    const flush = () => void saveMemo();
    window.addEventListener("pagehide", flush);

    return () => {
      activeRef.current = false;
      window.removeEventListener("pagehide", flush);
      void saveMemo();
    };
  }, [saveMemo]);

  return { memo, initializeMemo, updateMemo, saveMemo };
};
