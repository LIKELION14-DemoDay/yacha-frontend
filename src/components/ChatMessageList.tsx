import { useEffect, useRef } from "react";

import ChatMessageGroup from "./ChatMessageGroup";
import type { SessionMessage, Stance } from "../types/session";

export type ChatSender = {
  name: string;
  stance: Stance;
};

interface ChatMessageListProps {
  // 메시지 번호(seqNo) 오름차순
  messages: SessionMessage[];
  myParticipantId: number;
  getSender: (participantId: number) => ChatSender;
}

// 이 거리 안에서 보고 있으면 새 메시지가 올 때 맨 아래로 따라 내려감
const AUTO_SCROLL_THRESHOLD_PX = 80;

type MessageGroup = {
  senderId: number;
  messages: SessionMessage[];
};

// 같은 사람이 연달아 보낸 메시지를 한 묶음으로
const groupMessages = (messages: SessionMessage[]) =>
  messages.reduce<MessageGroup[]>((groups, message) => {
    const lastGroup = groups.at(-1);

    if (lastGroup?.senderId === message.senderId) {
      lastGroup.messages.push(message);
    } else {
      groups.push({ senderId: message.senderId, messages: [message] });
    }

    return groups;
  }, []);

const ChatMessageList = ({
  messages,
  myParticipantId,
  getSender,
}: ChatMessageListProps) => {
  const listRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef(true);

  const handleScroll = () => {
    const list = listRef.current;
    if (!list) return;

    isNearBottomRef.current =
      list.scrollHeight - list.scrollTop - list.clientHeight <
      AUTO_SCROLL_THRESHOLD_PX;
  };

  // 위쪽 지난 메시지를 보고 있을 때는 내 메시지가 아니면 스크롤을 건드리지 않음
  useEffect(() => {
    const list = listRef.current;
    const lastMessage = messages.at(-1);
    if (!list || !lastMessage) return;

    if (isNearBottomRef.current || lastMessage.senderId === myParticipantId) {
      list.scrollTop = list.scrollHeight;
    }
  }, [messages, myParticipantId]);

  return (
    <div
      ref={listRef}
      onScroll={handleScroll}
      role="log"
      aria-label="채팅"
      aria-live="polite"
      className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto py-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {groupMessages(messages).map((group) => {
        const sender = getSender(group.senderId);

        return (
          <ChatMessageGroup
            key={group.messages[0].seqNo}
            isMine={group.senderId === myParticipantId}
            name={sender.name}
            stance={sender.stance}
            messages={group.messages}
          />
        );
      })}
    </div>
  );
};

export default ChatMessageList;
