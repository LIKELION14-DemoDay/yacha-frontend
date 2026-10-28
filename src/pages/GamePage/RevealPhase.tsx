/**
 * 주장 공개 화면 (REVEAL 구간, 20초)
 * 양측 주장을 말풍선으로 보여주고, 남은 시간 뒤 반론 작성으로 넘어간다고 알림
 */
import StanceBubble from "../../components/StanceBubble";
import type { Stance } from "../../types/session";

type ArgumentInfo = {
  name: string;
  stance: Stance;
  // 아직 공개 전이면 null
  content: string | null;
};

interface RevealPhaseProps {
  mine: ArgumentInfo;
  opponent: ArgumentInfo;
  remainingSeconds: number;
}

// 공개 전 · 빈 제출일 때 말풍선에 보일 문구
const getArgumentText = (content: string | null) => {
  if (content === null) return "주장을 불러오는 중이에요";
  return content.trim() || "작성한 주장이 없어요";
};

const RevealPhase = ({
  mine,
  opponent,
  remainingSeconds,
}: RevealPhaseProps) => {
  const seconds = Math.max(0, Math.ceil(remainingSeconds));
  // 알림은 정해 둔 시점에서만 바뀌게 (매초 읽지 않도록)
  const announcedSeconds =
    seconds > 10 ? null : seconds > 5 ? 10 : seconds > 0 ? 5 : null;

  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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

      <div className="flex shrink-0 flex-col gap-2">
        <StanceBubble
          isMine
          name={mine.name}
          stance={mine.stance}
          content={getArgumentText(mine.content)}
          quoted={false}
          clamped
        />
        <p className="text-center text-body-r2 text-neutral-008">VS</p>
        <StanceBubble
          isMine={false}
          name={opponent.name}
          stance={opponent.stance}
          content={getArgumentText(opponent.content)}
          quoted={false}
        />
      </div>

      {/* 화면에는 매초 줄어드는 숫자, 스크린 리더에는 10초 · 5초 남았을 때만 알림 */}
      <p
        aria-hidden="true"
        className="shrink-0 py-10 text-center text-subhead-r8 text-neutral-007"
      >
        <span className="text-main">{seconds}</span>초 뒤 반론 작성 페이지로
        넘어갑니다.
      </p>
      <p role="status" className="sr-only">
        {announcedSeconds
          ? `${announcedSeconds}초 뒤 반론 작성 페이지로 넘어갑니다.`
          : ""}
      </p>
    </section>
  );
};

export default RevealPhase;
