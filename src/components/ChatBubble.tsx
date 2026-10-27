import chatTailMine from "../assets/chat-tail-mine.svg";
import chatTailOpponent from "../assets/chat-tail-opponent.svg";

interface ChatBubbleProps {
  content: string;
  isMine: boolean;
  // 같은 사람이 연달아 보낸 메시지 중 첫 번째에만 꼬리를 붙임
  hasTail?: boolean;
}

const ChatBubble = ({ content, isMine, hasTail = false }: ChatBubbleProps) => {
  return (
    <div className="px-2.5">
      <div
        className={`relative rounded-[10px] px-4 py-3 ${isMine ? "bg-main" : "bg-neutral-008"}`}
      >
        <p
          className={`max-w-62 text-subhead-m7 break-words whitespace-pre-wrap ${isMine ? "text-white" : "text-neutral-004"}`}
        >
          {content}
        </p>

        {hasTail ? (
          <span
            aria-hidden="true"
            className={`absolute top-0 size-[26.5px] ${isMine ? "-right-[13.5px] -scale-y-100" : "-left-[13px] rotate-180"}`}
          >
            <img
              src={isMine ? chatTailMine : chatTailOpponent}
              alt=""
              className="block"
            />
          </span>
        ) : null}
      </div>
    </div>
  );
};

export default ChatBubble;
