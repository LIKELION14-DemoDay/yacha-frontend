interface PhaseTimerProps {
  // 남은 시간 (초)
  remainingSeconds: number;
  // 이번 구간 전체 시간 (초)
  totalSeconds: number;
  // 마감 임박이면 빨간 글씨
  isUrgent?: boolean;
  // 진행 막대를 좌우 여백 안쪽에 둠 (작성 화면), 아니면 화면 끝까지 (채팅)
  inset?: boolean;
  // 시간 아래 한 줄 안내 (예: 채팅 중 토론 주제), 시간과 같은 색
  caption?: string;
}

const formatTime = (seconds: number) => {
  const safeSeconds = Math.max(0, Math.ceil(seconds));
  const minutes = String(Math.floor(safeSeconds / 60)).padStart(2, "0");
  const rest = String(safeSeconds % 60).padStart(2, "0");

  return `${minutes}:${rest}`;
};

const PhaseTimer = ({
  remainingSeconds,
  totalSeconds,
  isUrgent = false,
  inset = false,
  caption,
}: PhaseTimerProps) => {
  const progress =
    totalSeconds > 0
      ? Math.min(1, Math.max(0, remainingSeconds / totalSeconds))
      : 0;

  return (
    <div className="flex w-full flex-col">
      <p
        role="timer"
        aria-label="남은 시간"
        className={`text-center text-headline-sb3 ${isUrgent ? "text-main" : "text-white"}`}
      >
        {formatTime(remainingSeconds)}
      </p>
      {caption ? (
        <p
          className={`line-clamp-2 px-6 pb-2.5 text-center text-caption-r1 break-keep ${isUrgent ? "text-main" : "text-white"}`}
        >
          {caption}
        </p>
      ) : null}

      <div className={inset ? "px-6 py-5" : "pt-0.5"}>
        <div className="h-1.25 w-full bg-neutral-008">
          <div
            className="h-full bg-main"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default PhaseTimer;
