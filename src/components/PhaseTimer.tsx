interface PhaseTimerProps {
  // 남은 시간 (초)
  remainingSeconds: number;
  // 이번 구간 전체 시간 (초)
  totalSeconds: number;
  // 마감 임박이면 빨간 글씨 (예: 최종발언 30초)
  isUrgent?: boolean;
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

      <div className="pt-2.5">
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
