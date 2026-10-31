import ChatBubble from "./ChatBubble";
import PhilosopherImage from "./PhilosopherImage";
import type { Stance } from "../types/session";
import { STANCE_LABEL } from "../utils/stance";

interface ChatMessageGroupProps {
  isMine: boolean;
  name: string;
  stance: Stance;
  // 철학자 유형 사진 (없으면 기본 아이콘)
  imageUrl?: string | null;
  // 같은 사람이 연달아 보낸 메시지 (보낸 순서대로)
  messages: { seqNo: number; content: string }[];
}

const ChatMessageGroup = ({
  isMine,
  name,
  stance,
  imageUrl,
  messages,
}: ChatMessageGroupProps) => {
  return (
    <div
      className={`flex w-full items-start gap-2 px-5 ${isMine ? "flex-row-reverse" : ""}`}
    >
      <PhilosopherImage imageUrl={imageUrl} alt="" size="xs" />

      <div
        className={`flex min-w-0 flex-col gap-2 ${isMine ? "items-end" : "items-start"}`}
      >
        <p className="flex items-center gap-1 whitespace-nowrap">
          <span className="text-subhead-m7 text-neutral-004">{name}</span>
          <span className="text-subhead-r8 text-neutral-006">
            ({STANCE_LABEL[stance]})
          </span>
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
