import ChatInput from "../../components/ChatInput";
import ChatMessageList, {
  type ChatSender,
} from "../../components/ChatMessageList";
import ChatMessageGroup from "../../components/ChatMessageGroup";
import {
  SLAM_FROM_LEFT_CLASS_NAME,
  SLAM_FROM_RIGHT_CLASS_NAME,
  SLAM_MOTION_CLASS_NAME,
  useSlamMotion,
} from "../../hooks/useSlamMotion";
import type { SessionMessage, Stance } from "../../types/session";

type RebuttalInfo = {
  name: string;
  stance: Stance;
  imageUrl: string;
  // 아직 공개 전이면 null
  content: string | null;
};

interface ChatPhaseProps {
  messages: SessionMessage[];
  myParticipantId: number;
  getSender: (participantId: number) => ChatSender;
  isFinalNotice: boolean;
  onSend: (content: string) => boolean;
  canSend: boolean;
  // 입력을 막은 이유 (예: 다시 연결하는 중)
  inputPlaceholder?: string;
  // 채팅 시작 때 공개되는 양측 반론 (채팅으로 보내지는 않지만 첫 채팅과 똑같은 모양으로 맨 위에 보임)
  myRebuttal: RebuttalInfo;
  opponentRebuttal: RebuttalInfo;
}

// 빈 제출일 때 말풍선에 보일 문구
const getRebuttalText = (content: string | null) =>
  content === null ? "" : content.trim() || "작성한 반론이 없어요";

// 토론방 채팅 구간 (자유 채팅 → 마지막 30초 최종발언)
const ChatPhase = ({
  messages,
  myParticipantId,
  getSender,
  isFinalNotice,
  onSend,
  canSend,
  inputPlaceholder,
  myRebuttal,
  opponentRebuttal,
}: ChatPhaseProps) => {
  // 두 반론이 오면 매칭 완료 때처럼 양옆에서 날아와 부딪힘
  const { isEntered } = useSlamMotion(
    myRebuttal.content !== null && opponentRebuttal.content !== null,
  );

  const rebuttals = (
    <div
      aria-hidden={!isEntered}
      className="flex shrink-0 flex-col gap-2 pt-2.5"
    >
      <div
        className={`${SLAM_MOTION_CLASS_NAME} ${isEntered ? "translate-x-0" : SLAM_FROM_RIGHT_CLASS_NAME}`}
      >
        <ChatMessageGroup
          isMine
          name={myRebuttal.name}
          stance={myRebuttal.stance}
          imageUrl={myRebuttal.imageUrl}
          messages={[
            { seqNo: -2, content: getRebuttalText(myRebuttal.content) },
          ]}
        />
      </div>
      <div
        className={`${SLAM_MOTION_CLASS_NAME} ${isEntered ? "translate-x-0" : SLAM_FROM_LEFT_CLASS_NAME}`}
      >
        <ChatMessageGroup
          isMine={false}
          name={opponentRebuttal.name}
          stance={opponentRebuttal.stance}
          imageUrl={opponentRebuttal.imageUrl}
          messages={[
            { seqNo: -1, content: getRebuttalText(opponentRebuttal.content) },
          ]}
        />
      </div>
    </div>
  );

  return (
    <>
      {isFinalNotice ? (
        <p className="shrink-0 bg-neutral-008 px-6 py-2 text-center text-body-m3 text-white">
          30초 동안 최종발언을 해주세요.
        </p>
      ) : (
        <div className="mt-2.5 flex shrink-0 items-center gap-2 px-6 py-2.5">
          <span aria-hidden="true" className="h-px flex-1 bg-neutral-007" />
          <p className="shrink-0 text-body-r6 text-neutral-004">
            지금부터 자유롭게 싸우세요!
          </p>
          <span aria-hidden="true" className="h-px flex-1 bg-neutral-007" />
        </div>
      )}

      <ChatMessageList
        messages={messages}
        myParticipantId={myParticipantId}
        getSender={getSender}
        paddedTop={isFinalNotice}
        header={rebuttals}
      />

      <div className="shrink-0 px-2.25 py-2.5">
        <ChatInput
          onSend={onSend}
          disabled={!canSend}
          placeholder={inputPlaceholder}
        />
      </div>
    </>
  );
};

export default ChatPhase;
