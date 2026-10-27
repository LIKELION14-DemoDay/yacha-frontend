import ChatBubble from "./ChatBubble";
import type { Stance } from "../types/session";

interface ChatMessageGroupProps {
  isMine: boolean;
  name: string;
  stance: Stance;
  // 같은 사람이 연달아 보낸 메시지 (보낸 순서대로)
  messages: { seqNo: number; content: string }[];
}

const STANCE_LABEL: Record<Stance, string> = {
  AGREE: "찬성",
  DISAGREE: "반대",
};

// 철학자 프로필 이미지가 정해지기 전까지 쓰는 자리 표시
const ProfilePlaceholder = () => {
  return (
    <span
      aria-hidden="true"
      className="flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-[4px] border-[0.4px] border-neutral-003 bg-neutral-001 text-[7px] text-neutral-006"
    >
      profile
    </span>
  );
};

const ChatMessageGroup = ({
  isMine,
  name,
  stance,
  messages,
}: ChatMessageGroupProps) => {
  return (
    <div
      className={`flex w-full items-start gap-2 px-5 ${isMine ? "flex-row-reverse" : ""}`}
    >
      <ProfilePlaceholder />

      <div
        className={`flex min-w-0 flex-col gap-2 ${isMine ? "items-end" : "items-start"}`}
      >
        <p className="flex gap-1 text-subhead-m7 text-neutral-004">
          <span>{name}</span>
          <span>({STANCE_LABEL[stance]})</span>
        </p>

        {messages.map((message, index) => (
          <ChatBubble
            key={message.seqNo}
            content={message.content}
            isMine={isMine}
            hasTail={index === 0}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatMessageGroup;
