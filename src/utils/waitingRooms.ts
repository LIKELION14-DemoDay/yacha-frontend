/**
 * 빠른 방 찾기용: 모든 카테고리의 대기 방을 한 번에 모음
 * 카테고리마다 동시에 불러오고, 다음 페이지가 있으면 끝까지 이어서 불러옴
 */
import { getWaitingRooms } from "../apis/sessions";
import type { WaitingRoom } from "../types/session";
import type { TopicCategory } from "../types/topic";
import { CATEGORIES } from "./category";

// 대기 방이 하나도 없을 때 안내
export const NO_ROOM_MESSAGE =
  "현재 야차 중인 방이 없습니다.\n직접 방을 생성해주세요.";

const getRoomsInCategory = async (category: TopicCategory) => {
  const rooms: WaitingRoom[] = [];

  for (let page = 0; ; page += 1) {
    const { rooms: pageRooms, hasNext } = await getWaitingRooms(category, page);
    rooms.push(...pageRooms);
    if (!hasNext) return rooms;
  }
};

// 방 번호는 만든 순서대로 커지므로 작은 번호부터 = 오래 기다린 방부터
// (불러오는 사이 방이 빠지면 같은 방이 다음 페이지에 또 올 수 있어 거름)
export const getAllWaitingRooms = async () => {
  const rooms = (await Promise.all(CATEGORIES.map(getRoomsInCategory))).flat();
  const uniqueRooms = new Map(rooms.map((room) => [room.sessionId, room]));

  return [...uniqueRooms.values()].sort(
    (left, right) => left.sessionId - right.sessionId,
  );
};
