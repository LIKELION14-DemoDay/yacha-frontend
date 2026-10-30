import { useState, type FormEvent } from "react";

import arrowUp from "../assets/arrow-up.svg";

// 서버 제한: 채팅 한 건 최대 100자
export const CHAT_MAX_LENGTH = 100;

interface ChatInputProps {
  // 보내기에 성공하면 true (입력창을 비움)
  onSend: (content: string) => boolean;
  disabled?: boolean;
  placeholder?: string;
}

const ChatInput = ({
  onSend,
  disabled = false,
  placeholder = "메시지 입력",
}: ChatInputProps) => {
  const [content, setContent] = useState("");
  const canSend = !disabled && content.trim().length > 0;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSend) return;

    if (onSend(content.trim())) {
      setContent("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full items-center justify-between gap-2 rounded-[10px] border border-neutral-007 bg-neutral-008 py-1 pr-1 pl-2.5"
    >
      <input
        type="text"
        value={content}
        maxLength={CHAT_MAX_LENGTH}
        disabled={disabled}
        placeholder={placeholder}
        aria-label="메시지 입력"
        // 키보드의 엔터 키를 "보내기"로 표시
        enterKeyHint="send"
        onChange={(event) => setContent(event.target.value)}
        className="min-w-0 flex-1 bg-transparent text-subhead-m7 text-neutral-002 caret-main outline-none placeholder:text-neutral-006 disabled:cursor-not-allowed"
      />

      <button
        type="submit"
        disabled={!canSend}
        aria-label="메시지 보내기"
        // 눌러도 입력칸 포커스가 빠지지 않게 해 보낸 뒤에도 키보드가 내려가지 않음
        onPointerDown={(event) => event.preventDefault()}
        className="flex size-10.25 shrink-0 cursor-pointer items-center justify-center rounded-[6px] bg-main disabled:cursor-not-allowed disabled:bg-neutral-007"
      >
        <img src={arrowUp} alt="" className="size-6" />
      </button>
    </form>
  );
};

export default ChatInput;
