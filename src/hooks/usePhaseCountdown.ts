/**
 * 구간 남은 시간(초)을 계산하는 훅
 * 내 기기 시계가 서버와 달라도 맞도록 clockOffset(서버 시각 - 내 시각)을 더해서 셈
 */
import { useEffect, useState } from "react";

const TICK_MS = 250;

// 서버 응답의 serverNow 를 받은 순간에 불러서 시계 차이를 구함
export const getClockOffset = (serverNow: string) =>
  Date.parse(serverNow) - Date.now();

export const usePhaseCountdown = (
  endsAt: string | null,
  clockOffset: number,
) => {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!endsAt) return;

    const intervalId = setInterval(() => setNow(Date.now()), TICK_MS);

    return () => clearInterval(intervalId);
  }, [endsAt]);

  if (!endsAt) {
    return 0;
  }

  return Math.max(0, (Date.parse(endsAt) - (now + clockOffset)) / 1000);
};
