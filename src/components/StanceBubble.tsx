import chatTailMine from "../assets/chat-tail-mine.svg";
import chatTailOpponent from "../assets/chat-tail-opponent.svg";
import ProfilePlaceholder from "./ProfilePlaceholder";
import type { Stance } from "../types/session";
import { STANCE_LABEL } from "../utils/stance";

interface StanceBubbleProps {
  isMine: boolean;
  name: string;
  stance: Stance;
  // 입장 문장 (예: 주제의 agreeText / disagreeText)
  content: string;
}

// 매칭 완료 화면의 입장 말풍선 (내 것은 빨강 · 오른쪽, 상대는 회색 · 왼쪽)
const StanceBubble = ({ isMine, name, stance, content }: StanceBubbleProps) => {
  const textColor = isMine ? "text-white" : "text-neutral-004";

  return (
    <div
      className={`flex w-full px-9.25 ${isMine ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`relative flex w-70 max-w-full flex-col gap-2 rounded-[10px] px-4 pt-3 pb-4 ${
          isMine ? "bg-main" : "bg-neutral-008"
        }`}
      >
        <p className={`flex items-center gap-2 text-subhead-m7 ${textColor}`}>
          <ProfilePlaceholder />
          <span className="truncate">{name}</span>
          <span className="shrink-0">({STANCE_LABEL[stance]})</span>
        </p>

        <p className={`text-subhead-m7 break-keep ${textColor}`}>“{content}”</p>

        <span
          aria-hidden="true"
          className={`absolute bottom-0 size-[26.5px] ${
            isMine ? "-right-[13.5px]" : "-left-[13px] rotate-180 -scale-y-100"
          }`}
        >
          <img
            src={isMine ? chatTailMine : chatTailOpponent}
            alt=""
            className="block"
          />
        </span>
      </div>
    </div>
  );
};

export default StanceBubble;
