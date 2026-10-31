/**
 * 토론방 페이지 (/game/:sessionId)
 * 매칭 완료부터 채팅까지 한 페이지 안에서 구간(phase)에 따라 화면만 바꿈
 * (페이지를 나누면 바뀔 때마다 실시간 연결이 끊겼다 다시 붙음)
 */
import { useCallback, useEffect, useRef, useState } from "react";
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
  SessionParticipant,
  SessionPhase,
  SessionSocketError,
  SessionState,
} from "../../types/session";
import { getChatErrorMessage } from "../../utils/chatError";
import { STANCE_LABEL } from "../../utils/stance";
import ArgumentPhase from "./ArgumentPhase";
import ChatPhase from "./ChatPhase";
import MatchedIntro from "./MatchedIntro";
import RevealPhase from "./RevealPhase";

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

// 상대 끊김 안내를 미루는 시간 (입장 직후 끊김 → 다시 연결이 바로 오는 경우를 거름)
const DISCONNECT_NOTICE_DELAY_MS = 2000;

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
  // 공개된 주장 · 반론 (PREP 주장은 REVEAL 에, REBUTTAL 반론은 CHAT 시작 때 공개)
  const [argumentMessages, setArgumentMessages] = useState<SessionMessage[]>(
    [],
  );
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const { toastMessage, showToast, hideToast } = useToast();
  // 내가 이미 제출한 구간 (상대까지 내면 바로 다음 화면으로 넘어가서 상대 제출 안내가 필요 없음)
  const mySubmittedPhaseRef = useRef<SessionPhase | null>(null);
  // 상대 끊김 안내는 잠깐 미뤘다가 띄움 (그사이 다시 연결되면 취소)
  const disconnectToastTimeoutRef =
    useRef<ReturnType<typeof setTimeout>>(undefined);
  // 다른 안내 뒤에 줄 서 있는 끊김 안내 취소 (다시 연결되면 띄우지 않음)
  const cancelDisconnectToastRef = useRef<() => void>(undefined);
  // 끊김 안내를 실제로 띄웠을 때만 다시 연결 안내를 띄움
  const isOpponentAwayNoticedRef = useRef(false);

  useEffect(() => () => clearTimeout(disconnectToastTimeoutRef.current), []);

  // 판정이 시작되거나 게임이 끝나면 결과 페이지로 (뒤로 와도 토론방으로 안 돌아오게)
  const goToResult = useCallback(() => {
    navigate(`/game/${sessionId}/result`, { replace: true });
  }, [navigate, sessionId]);

  const handleSync = useCallback(
    (state: SessionState) => {
      if (state.status === "FINISHED" || state.phase === "JUDGING") {
        goToResult();
        return;
      }

      setGameState(state);
      setTiming({
        phase: state.phase,
        endsAt: state.endsAt,
        clockOffset: getClockOffset(state.serverNow),
      });
    },
    [goToResult],
  );

  const myParticipantId = gameState?.myParticipantId;

  const handleEvent = useCallback(
    (event: SessionEvent) => {
      switch (event.type) {
        case "ARGUMENT_SUBMITTED":
          if (event.senderId === myParticipantId) {
            mySubmittedPhaseRef.current = event.phase;
          } else if (mySubmittedPhaseRef.current !== event.phase) {
            showToast(
              event.phase === "REBUTTAL"
                ? "상대가 반론을 제출했어요."
                : "상대가 주장을 제출했어요.",
            );
          }
          break;
        case "ARGUMENT":
          setArgumentMessages((messages) => addMessage(messages, event));
          break;
        case "CHAT":
          setChatMessages((messages) => addMessage(messages, event));
          break;
        case "PHASE_CHANGED":
          // 앞 구간 안내(상대 제출 등)가 다음 화면 위에 남지 않게 닫음
          hideToast();
          if (event.phase === "JUDGING") {
            goToResult();
            break;
          }
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
        // 입장 직후처럼 끊김 바로 뒤에 다시 연결되면 두 안내 모두 띄우지 않음
        case "OPPONENT_DISCONNECTED":
          clearTimeout(disconnectToastTimeoutRef.current);
          cancelDisconnectToastRef.current?.();
          disconnectToastTimeoutRef.current = setTimeout(() => {
            disconnectToastTimeoutRef.current = undefined;
            // 다른 안내(제출 오류 등)가 떠 있으면 끝난 뒤에 띄움
            cancelDisconnectToastRef.current = showToast(
              "상대의 연결이 끊겼어요. 잠시 기다려 주세요.",
              {
                queue: true,
                onShow: () => {
                  isOpponentAwayNoticedRef.current = true;
                },
              },
            );
          }, DISCONNECT_NOTICE_DELAY_MS);
          break;
        case "OPPONENT_RECONNECTED":
          clearTimeout(disconnectToastTimeoutRef.current);
          disconnectToastTimeoutRef.current = undefined;
          cancelDisconnectToastRef.current?.();
          cancelDisconnectToastRef.current = undefined;
          if (isOpponentAwayNoticedRef.current) {
            isOpponentAwayNoticedRef.current = false;
            showToast("상대가 다시 연결됐어요.");
          }
          break;
        // 상대가 나가 몰수승 · 봇 오류로 무효 등 판정 없이 끝난 경우도 결과 페이지에서 안내
        case "SESSION_FINISHED":
          goToResult();
          break;
        default:
          break;
      }
    },
    [myParticipantId, showToast, hideToast, goToResult],
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
  const isReveal = phase === "REVEAL";
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

  // 닉네임 · 철학자 사진은 서버가 주는 값 (혹시 비어 있으면 나 · 상대 · AI 로)
  const getSender = (participantId: number): ChatSender => {
    const participant = gameState?.participants.find(
      (item) => item.participantId === participantId,
    );
    const isMine = participantId === gameState?.myParticipantId;

    return {
      name:
        participant?.nickname ||
        (isMine ? "나" : participant?.type === "AI" ? "AI" : "상대"),
      stance: participant?.stance ?? "AGREE",
      imageUrl: participant?.imageUrl,
    };
  };

  // 입장 말풍선에 보일 문장: 서버가 철학자 유형 말투로 보내줌 (없으면 주제의 예 / 아니오)
  const getStanceText = (participant: SessionParticipant) =>
    participant.stanceText ||
    (participant.stance === "AGREE"
      ? (gameState?.topic.agreeText ?? "")
      : (gameState?.topic.disagreeText ?? ""));

  const me = gameState?.participants.find(
    (item) => item.participantId === gameState.myParticipantId,
  );
  const opponent = gameState?.participants.find(
    (item) => item.participantId !== gameState.myParticipantId,
  );

  // 공개된 주장 · 반론 (아직 안 왔으면 null)
  const getArgument = (
    participantId: number | undefined,
    argumentPhase: "PREP" | "REBUTTAL" = "PREP",
  ) =>
    argumentMessages.find(
      (message) =>
        message.senderId === participantId && message.phase === argumentPhase,
    )?.content ?? null;

  // 닉네임이 비어 있을 때 쓸 상대 이름
  const opponentName = opponent?.type === "AI" ? "AI" : "상대";

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
      // 키보드가 올라와 공간이 모자라면 요소가 겹치지 않고 이 안에서 스크롤
      className={`mx-auto flex h-full w-full max-w-100.5 flex-col overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
        phase === "CHAT" ? "bg-neutral-009" : "bg-secondary"
      }`}
    >
      <div className="shrink-0 bg-secondary">
        <TopBar
          // 작성 · 주장 공개 중에는 뒤로가기 없이 나가기만
          onBack={isWriting || isReveal ? undefined : openLeaveModal}
          backLabel="토론방 나가기"
          actionLabel="나가기"
          onAction={openLeaveModal}
        />
        {phase && !isMatchedIntro && !isReveal ? (
          <PhaseTimer
            remainingSeconds={remainingSeconds}
            totalSeconds={PHASE_SECONDS[phase]}
            isUrgent={isFinalNotice}
            inset={phase !== "CHAT"}
            // 채팅 중에는 시간 아래에 토론 주제
            caption={phase === "CHAT" ? gameState?.topic.statement : undefined}
          />
        ) : null}
      </div>

      {gameState && me && opponent && isMatchedIntro ? (
        <MatchedIntro
          mine={{
            name: me.nickname || "나",
            stance: me.stance,
            imageUrl: me.imageUrl,
            content: getStanceText(me),
          }}
          opponent={{
            name: opponent.nickname || opponentName,
            stance: opponent.stance,
            imageUrl: opponent.imageUrl,
            content: getStanceText(opponent),
          }}
        />
      ) : gameState && me && opponent && isReveal ? (
        <RevealPhase
          mine={{
            name: me.nickname || "나",
            stance: me.stance,
            imageUrl: me.imageUrl,
            content: getArgument(me.participantId),
          }}
          opponent={{
            name: opponent.nickname || opponentName,
            stance: opponent.stance,
            imageUrl: opponent.imageUrl,
            content: getArgument(opponent.participantId),
          }}
          remainingSeconds={remainingSeconds}
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
          topicStatement={gameState.topic.statement}
          stanceLabel={STANCE_LABEL[me.stance]}
          // 반론 때만 상대 주장을 넘김 (아직 안 왔으면 null 로 불러오는 중 표시)
          opponentArgument={
            phase === "REBUTTAL"
              ? getArgument(opponent?.participantId)
              : undefined
          }
          remainingSeconds={remainingSeconds}
          canUseHints={phase === "PREP"}
          onError={showToast}
        />
      ) : gameState && me && opponent && phase === "CHAT" ? (
        <ChatPhase
          myRebuttal={{
            name: me.nickname || "나",
            stance: me.stance,
            imageUrl: me.imageUrl,
            content: getArgument(me.participantId, "REBUTTAL"),
          }}
          opponentRebuttal={{
            name: opponent.nickname || opponentName,
            stance: opponent.stance,
            imageUrl: opponent.imageUrl,
            content: getArgument(opponent.participantId, "REBUTTAL"),
          }}
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

      {/* 작성 · 주장 공개 · 자유 채팅 화면은 광고 없음, 제출 후 대기 화면의 광고는 ArgumentPhase 가 그림 */}
      {isWriting || isReveal || phase === "CHAT" ? null : (
        <aside aria-label="광고 영역" className="h-17.5 shrink-0 bg-green" />
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
