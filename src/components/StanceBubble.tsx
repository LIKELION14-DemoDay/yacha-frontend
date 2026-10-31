import { useLayoutEffect, useRef } from "react";

import chatTailMine from "../assets/chat-tail-mine.svg";
import chatTailOpponent from "../assets/chat-tail-opponent.svg";
import PhilosopherImage from "./PhilosopherImage";
import type { Stance } from "../types/session";
import { STANCE_LABEL } from "../utils/stance";

// 줄인 본문 칸의 최대 높이 (max-h-21.5)
const CLAMPED_BOX_HEIGHT_PX = 86;

interface StanceBubbleProps {
  isMine: boolean;
  name: string;
  stance: Stance;
  // 철학자 유형 사진 (없으면 기본 아이콘)
  imageUrl?: string | null;
  // 입장 문장 (철학자 유형 말투의 stanceText) 또는 공개된 주장
  content: string;
  // 따옴표로 감싸기 (입장 문장), 주장 본문은 끔
  quoted?: boolean;
  // 4줄까지만 보이고 나머지는 … 으로 줄임
  clamped?: boolean;
}

// 입장 말풍선 (내 것은 빨강 · 오른쪽, 상대는 회색 · 왼쪽) — 매칭 완료 · 주장 공개
const StanceBubble = ({
  isMine,
  name,
  stance,
  imageUrl,
  content,
  quoted = true,
  clamped = false,
}: StanceBubbleProps) => {
  const textColor = isMine ? "text-white" : "text-neutral-004";
  const clampBoxRef = useRef<HTMLDivElement>(null);
  const clampTextRef = useRef<HTMLParagraphElement>(null);

  // 4줄을 넘겨 잘렸으면 칸 높이를 86px 로 고정
  useLayoutEffect(() => {
    const box = clampBoxRef.current;
    const text = clampTextRef.current;
    if (!box || !text) return;

    const isTruncated = clamped && text.scrollHeight > text.clientHeight;
    box.style.height = isTruncated ? `${CLAMPED_BOX_HEIGHT_PX}px` : "";
  }, [clamped, content]);

  return (
    <div
      className={`flex w-full px-9.25 ${isMine ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`relative flex w-70 max-w-full flex-col gap-2 rounded-[10px] px-4 pt-3 pb-4 ${
          isMine ? "bg-main" : "bg-neutral-008"
        }`}
      >
        <div className="flex items-center gap-2">
          <PhilosopherImage imageUrl={imageUrl} alt="" size="xs" />
          <p className="flex min-w-0 items-center gap-1 whitespace-nowrap">
            <span className={`truncate text-subhead-m7 ${textColor}`}>
              {name}
            </span>
            <span
              className={`shrink-0 text-subhead-r8 ${isMine ? "text-white opacity-70" : "text-neutral-006"}`}
            >
              ({STANCE_LABEL[stance]})
            </span>
          </p>
        </div>

        {/* 줄일 때는 본문 칸 최대 86px 안에 4줄 (넘쳐서 줄였을 때만 칸을 86px 로 채움) */}
        <div
          ref={clampBoxRef}
          className={clamped ? "max-h-21.5 overflow-hidden" : undefined}
        >
          <p
            ref={clampTextRef}
            className={`text-subhead-m7 wrap-break-word whitespace-pre-wrap ${textColor} ${clamped ? "line-clamp-4" : ""}`}
          >
            {quoted ? `“${content}”` : content}
          </p>
        </div>

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
