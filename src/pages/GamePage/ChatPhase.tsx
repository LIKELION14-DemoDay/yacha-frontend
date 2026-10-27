import ChatInput from "../../components/ChatInput";
import ChatMessageList, {
  type ChatSender,
} from "../../components/ChatMessageList";
import type { SessionMessage } from "../../types/session";

interface ChatPhaseProps {
  messages: SessionMessage[];
  myParticipantId: number;
  getSender: (participantId: number) => ChatSender;
  isFinalNotice: boolean;
  onSend: (content: string) => boolean;
  canSend: boolean;
  // 입력을 막은 이유 (예: 다시 연결하는 중)
  inputPlaceholder?: string;
}

// 토론방 채팅 구간 (자유 채팅 → 마지막 30초 최종발언)
const ChatPhase = ({
  messages,
  myParticipantId,
  getSender,
  isFinalNotice,
  onSend,
  canSend,
  inputPlaceholder,
}: ChatPhaseProps) => {
  return (
    <>
      {isFinalNotice ? (
        <p className="shrink-0 bg-neutral-008 px-6 py-2 text-center text-body-m3 text-white">
          30초 동안 최종발언을 해주세요.
        </p>
      ) : (
        <div className="flex shrink-0 items-center gap-2 px-6 py-2.5">
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
