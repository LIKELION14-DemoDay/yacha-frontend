/**
 * 토론방 페이지 (/game/:sessionId)
 * 매칭 완료부터 채팅까지 한 페이지 안에서 구간(phase)에 따라 화면만 바꿈
 * (페이지를 나누면 바뀔 때마다 실시간 연결이 끊겼다 다시 붙음)
 */
import { useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { leaveSession } from "../../apis/sessions";
import type { ChatSender } from "../../components/ChatMessageList";
import ConfirmModal from "../../components/ConfirmModal";
import LogoLoading from "../../components/LogoLoading";
import PhaseTimer from "../../components/PhaseTimer";
import Toast from "../../components/Toast";
import TopBar from "../../components/TopBar";
import {
  getClockOffset,
  usePhaseCountdown,
} from "../../hooks/usePhaseCountdown";
import { useSessionSocket } from "../../hooks/useSessionSocket";
import { useToast } from "../../hooks/useToast";
import type {
  SessionEvent,
  SessionMessage,
  SessionPhase,
  SessionSocketError,
  SessionState,
  Stance,
} from "../../types/session";
import { getChatErrorMessage } from "../../utils/chatError";
import ArgumentPhase from "./ArgumentPhase";
import ChatPhase from "./ChatPhase";
import MatchedIntro from "./MatchedIntro";

// 구간별 전체 시간 (초) — 진행 막대 계산용
const PHASE_SECONDS: Record<SessionPhase, number> = {
  PREP: 60,
  REVEAL: 20,
  REBUTTAL: 60,
  CHAT: 120,
  JUDGING: 0,
};

// 채팅 구간 마지막 30초는 최종발언
const FINAL_NOTICE_SECONDS = 30;

// 주장 작성 구간 처음 몇 초는 매칭 완료 화면
const MATCHED_INTRO_SECONDS = 3;

type PhaseTiming = {
  phase: SessionPhase;
  endsAt: string | null;
  clockOffset: number;
};

// 같은 메시지가 두 번 와도 한 번만, 메시지 번호 순서대로
const addMessage = (messages: SessionMessage[], message: SessionMessage) =>
  messages.some(({ seqNo }) => seqNo === message.seqNo)
    ? messages
    : [...messages, message].sort((a, b) => a.seqNo - b.seqNo);

const GamePage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const sessionId = Number(params.sessionId);

  const [gameState, setGameState] = useState<SessionState | null>(null);
  const [timing, setTiming] = useState<PhaseTiming | null>(null);
  const [chatMessages, setChatMessages] = useState<SessionMessage[]>([]);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const { toastMessage, showToast } = useToast();

  const handleSync = useCallback((state: SessionState) => {
    setGameState(state);
    setTiming({
      phase: state.phase,
      endsAt: state.endsAt,
      clockOffset: getClockOffset(state.serverNow),
    });
  }, []);

  const myParticipantId = gameState?.myParticipantId;

  const handleEvent = useCallback(
    (event: SessionEvent) => {
      switch (event.type) {
        case "ARGUMENT_SUBMITTED":
          if (event.senderId !== myParticipantId) {
            showToast(
              event.phase === "REBUTTAL"
                ? "상대가 반론을 제출했어요."
                : "상대가 주장을 제출했어요.",
            );
          }
          break;
        case "CHAT":
          setChatMessages((messages) => addMessage(messages, event));
          break;
        case "PHASE_CHANGED":
          setTiming({
            phase: event.phase,
            endsAt: event.endsAt,
            clockOffset: getClockOffset(event.serverNow),
          });
          break;
        case "FINAL_NOTICE":
          setTiming((current) =>
            current ? { ...current, endsAt: event.endsAt } : current,
          );
          break;
        case "OPPONENT_DISCONNECTED":
          showToast("상대의 연결이 끊겼어요. 잠시 기다려 주세요.");
          break;
        case "OPPONENT_RECONNECTED":
          showToast("상대가 다시 연결됐어요.");
          break;
        // 주장 공개 · 게임 종료는 해당 단계 작업에서 처리
        default:
          break;
      }
    },
    [myParticipantId, showToast],
  );

  const handleError = useCallback(
    (error: SessionSocketError) => showToast(getChatErrorMessage(error)),
    [showToast],
  );

  const { connected, sendChat } = useSessionSocket(
    Number.isNaN(sessionId) ? null : sessionId,
    { onEvent: handleEvent, onSync: handleSync, onError: handleError },
  );

  const remainingSeconds = usePhaseCountdown(
    timing?.endsAt ?? null,
    timing?.clockOffset ?? 0,
  );

  const phase = timing?.phase;
  const isMatchedIntro =
    phase === "PREP" &&
    remainingSeconds > PHASE_SECONDS.PREP - MATCHED_INTRO_SECONDS;
  const isWriting =
    (phase === "PREP" && !isMatchedIntro) || phase === "REBUTTAL";
  const isFinalNotice =
    phase === "CHAT" && remainingSeconds <= FINAL_NOTICE_SECONDS;
  // 시간이 다 되면 다음 구간 알림이 오기 전이라도 입력을 막음
  const isChatOver = remainingSeconds <= 0;
  const canSend = connected && !isChatOver;

  const handleSend = (content: string) => {
    if (!canSend) return false;

    const isSent = sendChat(content);
    if (!isSent) {
      showToast("연결이 끊겨 메시지를 보내지 못했어요.");
    }

    return isSent;
  };

  // 상대 닉네임은 아직 서버에서 안 줘서 임시 이름으로 표시
  const getSender = (participantId: number): ChatSender => {
    const participant = gameState?.participants.find(
      (item) => item.participantId === participantId,
    );
    const isMine = participantId === gameState?.myParticipantId;

    return {
      name: isMine ? "나" : participant?.type === "AI" ? "AI" : "상대",
      stance: participant?.stance ?? "AGREE",
    };
  };

  // 입장 말풍선 · 작성 화면에 보일 입장 문장
  const getStanceText = (stance: Stance) =>
    stance === "AGREE"
      ? (gameState?.topic.agreeText ?? "")
      : (gameState?.topic.disagreeText ?? "");

  const me = gameState?.participants.find(
    (item) => item.participantId === gameState.myParticipantId,
  );
  const opponent = gameState?.participants.find(
    (item) => item.participantId !== gameState.myParticipantId,
  );

  const openLeaveModal = () => setIsLeaveModalOpen(true);
  const closeLeaveModal = useCallback(() => setIsLeaveModalOpen(false), []);

  // 게임 중 나가면 바로 몰수패
  const handleLeave = async () => {
    setIsLeaveModalOpen(false);

    try {
      await leaveSession(sessionId);
    } finally {
      navigate("/home");
    }
  };

  return (
    <main
      className={`mx-auto flex h-dvh w-full max-w-100.5 flex-col ${
        phase === "CHAT" ? "bg-neutral-009" : "bg-secondary"
      }`}
    >
      <div className="shrink-0 bg-secondary">
        <TopBar
          // 작성 중에는 뒤로가기 없이 나가기만
          onBack={isWriting ? undefined : openLeaveModal}
          backLabel="토론방 나가기"
          actionLabel="나가기"
          onAction={openLeaveModal}
        />
        {phase && !isMatchedIntro ? (
          <PhaseTimer
            remainingSeconds={remainingSeconds}
            totalSeconds={PHASE_SECONDS[phase]}
            isUrgent={isFinalNotice}
          />
        ) : null}
      </div>

      {gameState && me && opponent && isMatchedIntro ? (
        <MatchedIntro
          mine={{
            name: "나",
            stance: me.stance,
            content: getStanceText(me.stance),
          }}
          opponent={{
            name: opponent.type === "AI" ? "AI" : "상대",
            stance: opponent.stance,
            content: getStanceText(opponent.stance),
          }}
        />
      ) : gameState && me && isWriting ? (
        <ArgumentPhase
          // 구간이 바뀌면 작성 칸을 새로 시작
          key={phase}
          sessionId={sessionId}
          phase={phase === "REBUTTAL" ? "REBUTTAL" : "PREP"}
          title={
            phase === "REBUTTAL"
              ? "반론을 작성해주세요."
              : "근거를 작성해주세요."
          }
          stanceText={getStanceText(me.stance)}
          remainingSeconds={remainingSeconds}
          canUseHints={phase === "PREP"}
          onError={showToast}
        />
      ) : gameState && phase === "CHAT" ? (
        <ChatPhase
          messages={chatMessages}
          myParticipantId={gameState.myParticipantId}
          getSender={getSender}
          isFinalNotice={isFinalNotice}
          onSend={handleSend}
          canSend={canSend}
          inputPlaceholder={
            isChatOver
              ? "채팅이 끝났어요"
              : connected
                ? undefined
                : "다시 연결하는 중이에요"
          }
        />
      ) : (
        // 채팅 외 구간 화면은 각 단계 작업에서 채움
        <div className="flex flex-1 items-center justify-center text-body-r6 text-neutral-006">
          {gameState ? (
            "다음 단계를 준비 중이에요"
          ) : (
            <LogoLoading message="토론방에 들어가는 중이에요" />
          )}
        </div>
      )}

      {/* 작성 화면은 글쓰기 칸을 넓게 쓰도록 광고 없음 (피그마 기준) */}
      {isWriting ? null : (
        <aside aria-label="광고 영역" className="h-20.75 shrink-0 bg-green" />
      )}

      <Toast message={toastMessage} />

      <ConfirmModal
        open={isLeaveModalOpen}
        title="쫄리면 나가시던지"
        description="다시 돌아올 수 없습니다."
        cancelLabel="계속하기"
        confirmLabel="나가기"
        onCancel={closeLeaveModal}
        onConfirm={handleLeave}
      />
    </main>
  );
};

export default GamePage;
