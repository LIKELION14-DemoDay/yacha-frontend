/**
 * 주장 공개 화면 (REVEAL 구간, 20초)
 * 양측 주장을 말풍선으로 보여주고, 남은 시간 뒤 반론 작성으로 넘어간다고 알림
 */
import { useEffect, useRef } from "react";

import StanceBubble from "../../components/StanceBubble";
import {
  SLAM_FROM_LEFT_CLASS_NAME,
  SLAM_FROM_RIGHT_CLASS_NAME,
  SLAM_MOTION_CLASS_NAME,
  useSlamMotion,
} from "../../hooks/useSlamMotion";
import type { Stance } from "../../types/session";

type ArgumentInfo = {
  name: string;
  stance: Stance;
  imageUrl: string;
  // 아직 공개 전이면 null
  content: string | null;
};

interface RevealPhaseProps {
  mine: ArgumentInfo;
  opponent: ArgumentInfo;
  remainingSeconds: number;
}

// 빈 제출일 때 말풍선에 보일 문구 (도착 전에는 말풍선을 숨겨 둠)
const getArgumentText = (content: string | null) =>
  content === null ? "" : content.trim() || "작성한 주장이 없어요";

const RevealPhase = ({
  mine,
  opponent,
  remainingSeconds,
}: RevealPhaseProps) => {
  const isArrived = mine.content !== null && opponent.content !== null;
  // 두 주장이 오면 매칭 완료 때처럼 양옆에서 날아오고, 자리를 잡으면 넘어가는 안내를 보여 줌
  const { isEntered, isSettled } = useSlamMotion(isArrived);
  const seconds = Math.max(0, Math.ceil(remainingSeconds));

  // 스크린 리더 알림: 10초 · 5초 경계를 처음 지날 때 그 순간의 실제 남은 시간을 한 번만 읽음
  const statusRef = useRef<HTMLParagraphElement>(null);
  const announcedBoundaryRef = useRef<number | null>(null);

  useEffect(() => {
    const boundary =
      seconds <= 0 ? null : seconds <= 5 ? 5 : seconds <= 10 ? 10 : null;
    if (boundary === null || boundary === announcedBoundaryRef.current) return;

    announcedBoundaryRef.current = boundary;
    if (statusRef.current) {
      statusRef.current.textContent = `${seconds}초 뒤 반론 작성 페이지로 넘어갑니다.`;
    }
  }, [seconds]);

  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="shrink-0 pt-2.5 pb-10">
        <div className="flex flex-col items-center gap-1 px-6 py-2.5 text-center">
          <h1 className="text-headline-sb5 text-white">
            양측의 주장이 공개되었습니다!
          </h1>
          <p className="text-subhead-r8 text-neutral-007">
            상대방의 입장을 읽고 반론을 준비해주세요.
          </p>
        </div>
      </div>

      {/* 두 주장이 도착하면 매칭 완료 때처럼 양옆에서 날아와 부딪힘 */}
      <div aria-hidden={!isEntered} className="flex shrink-0 flex-col gap-2">
        <div
          className={`${SLAM_MOTION_CLASS_NAME} ${isEntered ? "translate-x-0" : SLAM_FROM_RIGHT_CLASS_NAME}`}
        >
          <StanceBubble
            isMine
            name={mine.name}
            stance={mine.stance}
            imageUrl={mine.imageUrl}
            content={getArgumentText(mine.content)}
            quoted={false}
            clamped
          />
        </div>
        <p
          className={`text-center text-body-r2 text-neutral-008 transition-opacity duration-150 motion-reduce:transition-none ${
            isEntered ? "opacity-100" : "opacity-0"
          }`}
        >
          VS
        </p>
        <div
          className={`${SLAM_MOTION_CLASS_NAME} ${isEntered ? "translate-x-0" : SLAM_FROM_LEFT_CLASS_NAME}`}
        >
          <StanceBubble
            isMine={false}
            name={opponent.name}
            stance={opponent.stance}
            imageUrl={opponent.imageUrl}
            content={getArgumentText(opponent.content)}
            quoted={false}
          />
        </div>
      </div>

      {/* 화면에는 매초 줄어드는 숫자, 스크린 리더에는 10초 · 5초 남았을 때만 알림
          말풍선이 자리를 잡은 뒤에 나타남 (자리는 미리 잡아 둬서 나타날 때 화면이 밀리지 않음) */}
      <p
        aria-hidden="true"
        className={`shrink-0 py-10 text-center text-subhead-r8 text-neutral-007 transition-opacity duration-300 motion-reduce:transition-none ${
          isSettled ? "opacity-100" : "opacity-0"
        }`}
      >
        <span className="text-main">{seconds}</span>초 뒤 반론 작성 페이지로
        넘어갑니다.
      </p>
      {/* 내용은 위 effect 가 경계를 지날 때만 채움 */}
      <p ref={statusRef} role="status" className="sr-only" />
    </section>
  );
};

export default RevealPhase;
