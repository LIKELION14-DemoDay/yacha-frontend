/**
 * 토론방 페이지 (/game/:sessionId)
 * 매칭 완료부터 채팅까지 한 페이지 안에서 구간(phase)에 따라 화면만 바꿈
 * (페이지를 나누면 바뀔 때마다 실시간 연결이 끊겼다 다시 붙음)
 */
import { useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { leaveSession } from "../../apis/sessions";
import type { ChatSender } from "../../components/ChatMessageList";
import PhaseTimer from "../../components/PhaseTimer";
import TopBar from "../../components/TopBar";
import {
  getClockOffset,
  usePhaseCountdown,
} from "../../hooks/usePhaseCountdown";
import { useSessionSocket } from "../../hooks/useSessionSocket";
import type {
  SessionEvent,
  SessionMessage,
  SessionPhase,
  SessionState,
} from "../../types/session";
import ChatPhase from "./ChatPhase";

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

  const handleSync = useCallback((state: SessionState) => {
    setGameState(state);
    setTiming({
      phase: state.phase,
      endsAt: state.endsAt,
      clockOffset: getClockOffset(state.serverNow),
    });
  }, []);

  const handleEvent = useCallback((event: SessionEvent) => {
    switch (event.type) {
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
      // 주장 공개 · 상대 연결 끊김 · 게임 종료는 해당 단계 작업에서 처리
      default:
        break;
    }
  }, []);

  const { connected, sendChat } = useSessionSocket(
    Number.isNaN(sessionId) ? null : sessionId,
    { onEvent: handleEvent, onSync: handleSync },
  );

  const remainingSeconds = usePhaseCountdown(
    timing?.endsAt ?? null,
    timing?.clockOffset ?? 0,
  );

  const phase = timing?.phase;
  const isFinalNotice =
    phase === "CHAT" && remainingSeconds <= FINAL_NOTICE_SECONDS;

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

  // 게임 중 나가면 바로 몰수패 (확인 팝업은 공통 팝업 작업 후 교체)
  const handleLeave = async () => {
    if (!window.confirm("지금 나가면 패배로 처리돼요. 나갈까요?")) return;

    try {
      await leaveSession(sessionId);
    } finally {
      navigate("/home");
    }
  };

  return (
    <main className="mx-auto flex h-dvh w-full max-w-100.5 flex-col bg-neutral-009">
      <div className="shrink-0 bg-secondary">
        <TopBar
          onBack={handleLeave}
          backLabel="토론방 나가기"
          actionLabel="나가기"
          onAction={handleLeave}
        />
        {phase ? (
          <PhaseTimer
            remainingSeconds={remainingSeconds}
            totalSeconds={PHASE_SECONDS[phase]}
            isUrgent={isFinalNotice}
          />
        ) : null}
      </div>

      {gameState && phase === "CHAT" ? (
        <ChatPhase
          messages={chatMessages}
          myParticipantId={gameState.myParticipantId}
          getSender={getSender}
          isFinalNotice={isFinalNotice}
          onSend={sendChat}
          canSend={connected}
        />
      ) : (
        // 채팅 외 구간 화면은 각 단계 작업에서 채움
        <div className="flex flex-1 items-center justify-center text-body-r6 text-neutral-006">
          {gameState
            ? "다음 단계를 준비 중이에요"
            : "토론방에 들어가는 중이에요"}
        </div>
      )}

      <aside aria-label="광고 영역" className="h-20.75 shrink-0 bg-green" />
    </main>
  );
};

export default GamePage;
