/**
 * 방 찾기 페이지 (/game/rooms?category=HUMAN)
 * 고른 카테고리의 대기 방 목록을 보여주고, 방에 들어가거나 랜덤 주제로 시작함
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import {
  getProposal,
  getWaitingRooms,
  joinSession,
  rejectProposal,
} from "../../apis/sessions";
import randomStartIcon from "../../assets/random-start.svg";
import LongButton from "../../components/Button";
import ConfirmModal from "../../components/ConfirmModal";
import RoomCard from "../../components/RoomCard";
import Toast from "../../components/Toast";
import TopBar from "../../components/TopBar";
import { useToast } from "../../hooks/useToast";
import type { SessionProposal, WaitingRoom } from "../../types/session";
import type { TopicCategory } from "../../types/topic";
import { getApiErrorCode } from "../../utils/apiError";
import { CATEGORY_LABEL, toCategory } from "../../utils/category";
import { STANCE_LABEL } from "../../utils/stance";

const JOIN_ERROR_MESSAGES: Record<string, string> = {
  SESSION_NOT_WAITING: "이미 시작된 방이에요.",
  ALREADY_IN_SESSION: "이미 참여 중인 게임이 있어요.",
  CANNOT_JOIN_OWN_ROOM: "내가 만든 방에는 들어갈 수 없어요.",
};

// 받침이 있으면 "을", 없으면 "를" (예: 미래 기술을, 윤리를)
const withObjectParticle = (word: string) => {
  const code = word.charCodeAt(word.length - 1) - 0xac00;
  const hasFinalConsonant = code >= 0 && code % 28 !== 0;

  return `${word}${hasFinalConsonant ? "을" : "를"}`;
};

// 카테고리가 바뀌면 목록 · 페이지 · 제안 상태를 처음부터 다시 시작
const RoomListPage = () => {
  const [searchParams] = useSearchParams();
  const category = toCategory(searchParams.get("category"));

  return <RoomListContent key={category} category={category} />;
};

const RoomListContent = ({ category }: { category: TopicCategory }) => {
  const navigate = useNavigate();

  // 화면을 떠난 뒤(카테고리 변경 포함) 늦게 온 응답은 반영하지 않음
  const isActiveRef = useRef(true);

  useEffect(() => {
    isActiveRef.current = true;
    return () => {
      isActiveRef.current = false;
    };
  }, []);

  // null 이면 첫 목록을 불러오는 중
  const [rooms, setRooms] = useState<WaitingRoom[] | null>(null);
  // 다음에 불러올 페이지 (더 없으면 null)
  const [nextPage, setNextPage] = useState<number | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [isProposing, setIsProposing] = useState(false);
  const [proposal, setProposal] = useState<SessionProposal | null>(null);
  const { toastMessage, showToast } = useToast();

  // 매칭 대기에서 끝나고 돌아오면 넘겨받은 안내를 한 번 띄움 (뒤로 와도 다시 안 뜨게 지움)
  const location = useLocation();
  const returnedToast = (location.state as { toast?: string } | null)?.toast;

  useEffect(() => {
    if (!returnedToast) return;

    showToast(returnedToast);
    navigate(`${location.pathname}${location.search}`, {
      replace: true,
      state: null,
    });
  }, [returnedToast, showToast, navigate, location.pathname, location.search]);

  const listRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // 첫 페이지 (나가면 늦게 온 응답은 무시)
  useEffect(() => {
    let ignore = false;

    getWaitingRooms(category)
      .then(({ rooms: firstRooms, hasNext }) => {
        if (ignore) return;
        setRooms(firstRooms);
        setNextPage(hasNext ? 1 : null);
      })
      .catch(() => {
        if (ignore) return;
        setRooms([]);
        showToast("방 목록을 불러오지 못했어요.");
      });

    return () => {
      ignore = true;
    };
  }, [category, showToast]);

  // 다음 페이지 (그사이 방이 빠지면 같은 방이 또 올 수 있어 거름)
  const loadMore = useCallback(async () => {
    if (nextPage === null || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      const { rooms: moreRooms, hasNext } = await getWaitingRooms(
        category,
        nextPage,
      );
      if (!isActiveRef.current) return;

      setRooms((items) => {
        const current = items ?? [];
        const ids = new Set(current.map((room) => room.sessionId));
        return [
          ...current,
          ...moreRooms.filter((room) => !ids.has(room.sessionId)),
        ];
      });
      setNextPage(hasNext ? nextPage + 1 : null);
    } catch {
      showToast("방 목록을 불러오지 못했어요.");
    } finally {
      setIsLoadingMore(false);
    }
  }, [category, nextPage, isLoadingMore, showToast]);

  // 목록 끝이 보이면 다음 페이지
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || nextPage === null) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void loadMore();
      },
      { root: listRef.current },
    );
    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [loadMore, nextPage]);

  // "랜덤 주제로 시작하기": 대기 방을 하나씩 제안, 없으면 새 주제로 입장 선택 화면
  const requestProposal = async () => {
    setIsProposing(true);
    try {
      const nextProposal = await getProposal(category);
      if (!isActiveRef.current) return;

      if (nextProposal.result === "NEW_TOPIC") {
        navigate(`/game/select?category=${category}`, {
          state: { topic: nextProposal.topic },
        });
        return;
      }
      setProposal(nextProposal);
    } catch {
      showToast("방을 찾지 못했어요.");
    } finally {
      setIsProposing(false);
    }
  };

  // 성공하면 토론방으로, 실패하면 false
  const joinRoom = async (sessionId: number) => {
    setIsJoining(true);
    try {
      await joinSession(sessionId);
      // 들어간 방은 떠났어도 진행 중이므로 토론방으로 이동
      navigate(`/game/${sessionId}`);
      return true;
    } catch (error) {
      const code = getApiErrorCode(error);

      // 이미 시작된 방은 목록에서 뺌
      if (code === "SESSION_NOT_WAITING") {
        setRooms(
          (items) =>
            items?.filter((room) => room.sessionId !== sessionId) ?? null,
        );
      }
      showToast(
        (code && JOIN_ERROR_MESSAGES[code]) ?? "방에 들어가지 못했어요.",
      );
      setIsJoining(false);
      return false;
    }
  };

  // 제안 수락 (그사이 시작된 방이면 다음 방 제안)
  const acceptProposal = async () => {
    if (!proposal?.sessionId) return;

    const { sessionId } = proposal;
    setProposal(null);

    if (!(await joinRoom(sessionId))) {
      void requestProposal();
    }
  };

  // 제안 거절 후 다음 방 제안
  const declineProposal = async () => {
    if (!proposal?.sessionId) return;

    const { sessionId } = proposal;
    setProposal(null);

    try {
      await rejectProposal(sessionId);
    } catch {
      // 거절 기록이 안 남아도 다음 제안은 받을 수 있음
    }
    void requestProposal();
  };

  const isBusy = isJoining || isProposing;

  return (
    <main className="mx-auto flex h-dvh w-full max-w-100.5 flex-col bg-secondary">
      <TopBar onBack={() => navigate(-1)} />

      <section className="shrink-0">
        <h1 className="px-6 py-4 text-headline-sb5 text-white">
          {withObjectParticle(CATEGORY_LABEL[category])} 주제로
          <br />
          야차를 떠보세요!
        </h1>

        <div className="px-6 pb-5">
          <LongButton
            disabled={isBusy}
            onClick={requestProposal}
            className={
              isBusy
                ? "!bg-main-009 !text-neutral-004"
                : "!bg-main !text-white hover:!bg-main-006"
            }
          >
            <img src={randomStartIcon} alt="" />
            랜덤 주제로 시작하기
          </LongButton>
        </div>
      </section>

      <section
        aria-labelledby="room-list-title"
        className="flex min-h-0 flex-1 flex-col gap-4 rounded-2xl bg-neutral-009 pt-7"
      >
        <div className="flex shrink-0 flex-col gap-1 px-6">
          <h2 id="room-list-title" className="text-subhead-m5 text-white">
            야차판 모음
          </h2>
          <p className="text-subhead-r8 text-neutral-005">
            내 입장에 맞는 사람을 찾아 바로 매치를 시작하세요
          </p>
        </div>

        <div
          ref={listRef}
          className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto px-6 pb-7"
        >
          {rooms?.map((room) => (
            <RoomCard
              key={room.sessionId}
              statement={room.topic.statement}
              wantedStance={room.wantedStance}
              disabled={isBusy}
              onClick={() => void joinRoom(room.sessionId)}
            />
          ))}

          {rooms === null ? (
            <p
              role="status"
              className="py-10 text-center text-body-r6 text-neutral-006"
            >
              야차판을 불러오는 중이에요
            </p>
          ) : null}

          {rooms?.length === 0 ? (
            <p className="py-10 text-center text-body-r6 text-neutral-006">
              아직 열린 야차판이 없어요.
              <br />
              랜덤 주제로 먼저 판을 열어 보세요!
            </p>
          ) : null}

          <div ref={sentinelRef} className="h-px shrink-0" />
        </div>
      </section>

      <aside aria-label="광고 영역" className="h-17.5 shrink-0 bg-green" />

      <Toast message={toastMessage} />

      <ConfirmModal
        open={proposal !== null}
        title="이 야차판에 들어갈까요?"
        description={
          proposal?.myStance
            ? `“${proposal.topic.statement}” · ${STANCE_LABEL[proposal.myStance]}`
            : undefined
        }
        cancelLabel="다른 판 보기"
        confirmLabel="들어가기"
        onCancel={declineProposal}
        onConfirm={acceptProposal}
      />
    </main>
  );
};

export default RoomListPage;
