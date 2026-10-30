/**
 * 판정 · 결과 페이지 (/game/:sessionId/result)
 * 판정 중(PENDING)이면 대기 화면을 보여주며 다시 조회하고, 끝나면 승패와 기준별 점수를 보여줌
 * 새로고침해도 서버 결과를 다시 받아 같은 화면이 나옴
 */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getResult } from "../../apis/sessions";
import crownGlowIcon from "../../assets/crown-glow.svg";
import crownIcon from "../../assets/crown.svg";
import yachaLogo from "../../assets/loading-logo.svg";
import resultGlow from "../../assets/result-glow.svg";
import LongButton from "../../components/Button";
import LogoLoading from "../../components/LogoLoading";
import PhilosopherImage from "../../components/PhilosopherImage";
import ScoreCompareRow from "../../components/ScoreCompareRow";
import TopBar from "../../components/TopBar";
import type {
  CriterionKey,
  ResultParticipant,
  SessionResult,
} from "../../types/session";

// 판정 중이면 다시 조회하는 간격 · 최대 횟수 (서버는 10분이 지나면 판정을 포기함)
const RESULT_POLL_MS = 1500;
const RESULT_POLL_LIMIT = 400;

// 화면에 보이는 기준 순서와 이름
const CRITERIA: { key: CriterionKey; label: string }[] = [
  { key: "LOGIC", label: "논리성" },
  { key: "REBUTTAL", label: "반박력" },
  { key: "CONSISTENCY", label: "일관성" },
  { key: "EVIDENCE", label: "근거 활용" },
];

const getName = (participant: ResultParticipant | undefined) =>
  participant?.nickname ?? "AI";

// 두 사람 점수를 비율로 (둘 다 0점이면 반반)
const toShares = (mine: number, opponent: number) => {
  const total = mine + opponent;
  if (total === 0) return [50, 50];

  const mineShare = Math.round((mine / total) * 100);
  return [mineShare, 100 - mineShare];
};

const ResultPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const sessionId = Number(params.sessionId);

  const [result, setResult] = useState<SessionResult | null>(null);
  const [hasError, setHasError] = useState(false);

  // 판정이 끝날 때까지 다시 조회 (나가면 멈춤)
  useEffect(() => {
    let ignore = false;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const poll = (count: number) => {
      getResult(sessionId)
        .then((nextResult) => {
          if (ignore) return;
          setResult(nextResult);

          if (nextResult.status === "PENDING" && count < RESULT_POLL_LIMIT) {
            timeoutId = setTimeout(() => poll(count + 1), RESULT_POLL_MS);
          }
        })
        .catch(() => {
          if (!ignore) setHasError(true);
        });
    };

    poll(0);

    return () => {
      ignore = true;
      clearTimeout(timeoutId);
    };
  }, [sessionId]);

  const goHome = () => navigate("/home");

  const isJudging = !hasError && (!result || result.status === "PENDING");

  if (isJudging) {
    return (
      <main className="mx-auto flex h-dvh w-full max-w-100.5 flex-col justify-between bg-secondary">
        <TopBar onBack={goHome} backLabel="홈으로" />
        <section className="flex min-h-0 flex-1 items-center justify-center">
          <LogoLoading message="AI가 승패판정 중..." />
        </section>
        <aside aria-label="광고 영역" className="h-25 shrink-0 bg-green" />
      </main>
    );
  }

  const me = result?.participants.find((participant) => participant.isMe);
  const opponent = result?.participants.find(
    (participant) => !participant.isMe,
  );

  // 판정 실패 · 무효 처리 · 결과를 못 받은 경우
  if (
    !result ||
    result.status === "FAILED" ||
    result.finishReason === "ABORTED" ||
    !me
  ) {
    return (
      <main className="mx-auto flex h-dvh w-full max-w-100.5 flex-col bg-secondary">
        <TopBar onBack={goHome} backLabel="홈으로" />
        <section className="flex min-h-0 flex-1 flex-col items-center justify-center gap-1 px-6 text-center">
          <h1 className="text-subhead-m5 text-white">승패를 가리지 못했어요</h1>
          <p className="text-body-r4 text-neutral-007">
            이번 대결은 무효 처리되었습니다.
          </p>
        </section>
        <div className="shrink-0 px-6 py-5">
          <LongButton
            onClick={goHome}
            className="!bg-main !text-white hover:!bg-main-006"
          >
            홈으로 돌아가기
          </LongButton>
        </div>
        <aside aria-label="광고 영역" className="h-25 shrink-0 bg-green" />
      </main>
    );
  }

  // 승패는 승자 기준 (게스트는 몰수패해도 내 result 가 null 로 와서 무승부로 보이던 문제)
  const winnerId = result.winnerParticipantId;
  const isWin = winnerId === me.participantId;
  const isLose = winnerId !== null && !isWin;
  const isForfeitWin = isWin && result.finishReason === "FORFEIT";

  const title = isWin
    ? `${getName(me)}님의 승리!!`
    : isLose
      ? `${getName(me)}님의 패배...`
      : "무승부!";
  const description = isForfeitWin
    ? "상대가 쫄아서 런쳤습니다..."
    : isWin
      ? "승리를 축하해요!"
      : isLose
        ? "공부를 더 하셔야겠어요~"
        : "팽팽한 승부였어요.";

  return (
    // 작은 폰에서는 전체가 스크롤되고, 남는 높이는 광고 영역이 채움
    <main className="relative isolate mx-auto flex h-dvh w-full max-w-100.5 flex-col overflow-y-auto bg-secondary [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {/* 위쪽 빨간 빛 번짐 배경 (화면 밖으로 넘치는 부분은 잘라서 가로 스크롤이 안 생기게) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <img
          src={resultGlow}
          alt=""
          className="absolute -top-32 -left-11 size-[490px] max-w-none"
        />
      </div>

      <TopBar onBack={goHome} backLabel="홈으로" />

      <section className="flex shrink-0 flex-col items-center gap-3 pt-12.5">
        <div className="relative">
          <PhilosopherImage imageUrl={me.imageUrl} alt="" size="xl" />
          {/* 이기면 로고, 지면 로고를 뒤집어서 */}
          <img
            src={yachaLogo}
            alt=""
            className={`absolute -top-7.25 left-19.25 h-8.75 w-10.75 ${isLose ? "rotate-180" : ""}`}
          />
        </div>
        <div className="flex flex-col items-center gap-1 text-center whitespace-nowrap">
          <h1 className="text-subhead-m5 text-white">{title}</h1>
          <p className="text-body-r4 text-neutral-007">{description}</p>
        </div>
      </section>

      <section aria-label="기준별 점수" className="shrink-0 pt-8 pb-5">
        <div className="relative flex items-center justify-between px-6 pt-5">
          <div className="flex w-[39px] flex-col items-center gap-[9px]">
            <PhilosopherImage imageUrl={me.imageUrl} alt="" size="xs" />
            <p className="w-full truncate text-center text-caption-r1 text-white">
              {getName(me)}
            </p>
          </div>
          <p className="text-right text-subhead-m7 text-neutral-007">VS</p>
          <div className="flex w-[39px] flex-col items-center gap-[9px]">
            <PhilosopherImage imageUrl={opponent?.imageUrl} alt="" size="xs" />
            <p className="w-full truncate text-center text-caption-r1 text-white">
              {getName(opponent)}
            </p>
          </div>

          {/* 승자 프로필 위 왕관 (빛 번짐 + 왕관 두 겹) */}
          {winnerId !== null ? (
            <span
              role="img"
              aria-label="승자"
              className={`absolute -top-0.75 size-6 ${
                winnerId === me.participantId
                  ? "left-[31.5px]"
                  : "right-[31.5px]"
              }`}
            >
              <img
                src={crownGlowIcon}
                alt=""
                className="absolute -top-[1.75px] -left-[2.5px] h-6.5 w-[29px] max-w-none"
              />
              <img src={crownIcon} alt="" className="absolute inset-0 size-6" />
            </span>
          ) : null}
        </div>

        {/* 몰수승 · 시간 초과로 점수가 없으면 기준별 점수는 생략 */}
        {me.scores && opponent?.scores ? (
          <div className="flex w-full flex-col">
            {CRITERIA.map(({ key, label }) => {
              const [mineShare, opponentShare] = toShares(
                me.scores?.[key] ?? 0,
                opponent.scores?.[key] ?? 0,
              );

              return (
                <ScoreCompareRow
                  key={key}
                  label={label}
                  leftScore={mineShare}
                  rightScore={opponentShare}
                />
              );
            })}
          </div>
        ) : null}
      </section>

      <div className="shrink-0 px-6 py-5">
        <LongButton
          onClick={goHome}
          className="!bg-main !text-white hover:!bg-main-006"
        >
          홈으로 돌아가기
        </LongButton>
      </div>

      {/* 남는 높이만 채우고, 모자라면 줄어들어 스크롤이 생기지 않게 */}
      <aside aria-label="광고 영역" className="min-h-0 flex-1 bg-green" />
    </main>
  );
};

export default ResultPage;
