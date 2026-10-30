import scoreLineLeft from "../assets/score-line-left.svg";
import scoreLineRight from "../assets/score-line-right.svg";

interface ScoreCompareRowProps {
  label: string;
  // 왼쪽(나) · 오른쪽(상대) 점수 비율 (둘을 더하면 100)
  leftScore: number;
  rightScore: number;
}

const scoreClassName = (isHigher: boolean) =>
  isHigher ? "text-subhead-m7 text-main" : "text-body-r4 text-neutral-007";

// 결과 화면의 기준별 점수 비교 (높은 쪽 숫자가 빨갛고, 막대는 높은 쪽에서부터 채움)
const ScoreCompareRow = ({
  label,
  leftScore,
  rightScore,
}: ScoreCompareRowProps) => {
  const isLeftHigher = leftScore > rightScore;
  const isRightHigher = rightScore > leftScore;
  const fillPercent = Math.max(leftScore, rightScore);

  return (
    // 줄 사이 여백은 쓰는 쪽(결과 화면)에서 화면 높이에 맞춰 늘고 줄어드는 빈 공간으로 둠
    <div className="flex w-full flex-col items-center">
      <div className="flex w-63.75 items-center justify-center gap-2 px-5">
        <img src={scoreLineLeft} alt="" className="h-[0.5px] min-w-0 flex-1" />
        <p className="shrink-0 text-body-r6 whitespace-nowrap text-neutral-004">
          {label}
        </p>
        <img src={scoreLineRight} alt="" className="h-[0.5px] min-w-0 flex-1" />
      </div>

      <div className="flex w-full items-center gap-0.5 px-6">
        <p className={`w-10.75 shrink-0 ${scoreClassName(isLeftHigher)}`}>
          {leftScore}점
        </p>
        <div
          role="meter"
          aria-label={`${label} 점수 비율`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={leftScore}
          className="relative h-1.25 min-w-0 flex-1 overflow-hidden rounded-[30px] bg-neutral-008"
        >
          <div
            className={`absolute top-0 h-full rounded-[30px] bg-main ${isRightHigher ? "right-0" : "left-0"}`}
            style={{ width: `${fillPercent}%` }}
          />
        </div>
        <p
          className={`w-10.75 shrink-0 text-right ${scoreClassName(isRightHigher)}`}
        >
          {rightScore}점
        </p>
      </div>
    </div>
  );
};

export default ScoreCompareRow;
