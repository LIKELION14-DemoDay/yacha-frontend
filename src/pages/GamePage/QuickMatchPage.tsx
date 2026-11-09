/**
 * 빠른 방 찾기 페이지 (/game/quick)
 * 모든 카테고리의 대기 방을 오래 기다린 순으로 하나씩 보여주고, 참여하거나 다음 방으로 넘김
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { joinSession } from "../../apis/sessions";
import tooltipTail from "../../assets/stance-tooltip-tail.svg";
import LongButton from "../../components/Button";
import PhilosopherImage from "../../components/PhilosopherImage";
import Toast from "../../components/Toast";
import TopBar from "../../components/TopBar";
import { useToast } from "../../hooks/useToast";
import type { WaitingRoom } from "../../types/session";
import { getApiErrorCode } from "../../utils/apiError";
import { getCurrentSessionPath } from "../../utils/currentSession";
import { STANCE_LABEL } from "../../utils/stance";
import { getAllWaitingRooms, NO_ROOM_MESSAGE } from "../../utils/waitingRooms";

const LOAD_ERROR_MESSAGE = "방 목록을 불러오지 못했어요.";

const QuickMatchPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // 홈에서 미리 불러온 방 목록 (새로고침 등으로 없으면 여기서 불러옴)
  const initialRooms =
    (location.state as { rooms?: WaitingRoom[] } | null)?.rooms ?? null;

  // 주소로 바로 들어와 앱 안의 이전 화면이 없으면 홈으로
  const goBack = () => {
    if (location.key === "default") {
      navigate("/home", { replace: true });
      return;
    }
    navigate(-1);
  };

  const [rooms, setRooms] = useState<WaitingRoom[] | null>(initialRooms);
  const [index, setIndex] = useState(0);
  const [isBusy, setIsBusy] = useState(false);
  const { toastMessage, showToast } = useToast();

  // 화면을 떠난 뒤 늦게 온 응답은 반영하지 않음
  const isActiveRef = useRef(true);

  useEffect(() => {
    isActiveRef.current = true;
    return () => {
      isActiveRef.current = false;
    };
  }, []);

  // 방이 하나도 없으면 홈으로 돌아가 안내
  const goHomeWithMessage = useCallback(
    (message: string) =>
      navigate("/home", { replace: true, state: { toast: message } }),
    [navigate],
  );

  useEffect(() => {
    if (initialRooms) return;

    let ignore = false;

    getAllWaitingRooms()
      .then((nextRooms) => {
        if (ignore) return;
        if (nextRooms.length === 0) {
          goHomeWithMessage(NO_ROOM_MESSAGE);
          return;
        }
        setRooms(nextRooms);
      })
      .catch(() => {
        if (!ignore) goHomeWithMessage(LOAD_ERROR_MESSAGE);
      });

    return () => {
      ignore = true;
    };
  }, [initialRooms, goHomeWithMessage]);

  // 마지막 방 다음: 그사이 새 방이 생겼을 수 있어 다시 불러와 처음부터
  const reloadRooms = async () => {
    try {
      const nextRooms = await getAllWaitingRooms();
      if (!isActiveRef.current) return;

      if (nextRooms.length === 0) {
        goHomeWithMessage(NO_ROOM_MESSAGE);
        return;
      }
      setRooms(nextRooms);
      setIndex(0);
    } catch {
      showToast(LOAD_ERROR_MESSAGE);
    }
  };

  const room = rooms?.[index];

  const showNextRoom = async () => {
    if (!rooms) return;

    if (index < rooms.length - 1) {
      setIndex(index + 1);
      return;
    }

    setIsBusy(true);
    await reloadRooms();
    setIsBusy(false);
  };

  // 바로 입장 → 토론방(매칭 완료 화면부터 시작)
  const joinRoom = async () => {
    if (!rooms || !room) return;

    setIsBusy(true);
    try {
      await joinSession(room.sessionId);
      navigate(`/game/${room.sessionId}`);
    } catch (error) {
      const code = getApiErrorCode(error);

      // 이미 참여 중인 게임이 있으면 그 게임으로 이동
      if (code === "ALREADY_IN_SESSION") {
        const path = await getCurrentSessionPath().catch(() => null);
        if (path) {
          navigate(path, { replace: true });
          return;
        }
      }

      // 그사이 시작된 방은 빼고 다음 방 (마지막이었으면 다시 불러옴)
      if (code === "SESSION_NOT_WAITING") {
        showToast("이미 시작된 방이에요.");
        const remaining = rooms.filter(
          (item) => item.sessionId !== room.sessionId,
        );
        setRooms(remaining);
        if (index >= remaining.length) await reloadRooms();
      } else {
        showToast("방에 들어가지 못했어요.");
      }
      setIsBusy(false);
    }
  };

  const canAct = Boolean(room) && !isBusy;

  return (
    // 세로 여백은 화면 높이 비율로 늘고 줄어듦 (cqh = 화면 높이의 1%)
    <main className="mx-auto flex h-full w-full max-w-100.5 flex-col bg-secondary [container-type:size]">
      <TopBar title="빠른 방 찾기" onBack={goBack} />

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {room && rooms ? (
          <div
            aria-live="polite"
            className="flex flex-1 flex-col items-center pt-[9cqh] text-center"
          >
            <section className="flex w-full shrink-0 flex-col items-center gap-10">
              <p className="text-subhead-r8 text-neutral-006">
                {index + 1}/{rooms.length}
              </p>
              <div className="flex w-full flex-col gap-3">
                <h1 className="text-headline-sb4 break-keep text-white">
                  {room.topic.statement}
                </h1>
                <p className="text-subhead-m5 text-neutral-006">
                  당신의 선택은?
                </p>
              </div>
            </section>

            <section className="flex flex-1 flex-col items-center justify-center gap-4 py-6">
              <div className="flex max-w-full flex-col items-center gap-1">
                <PhilosopherImage
                  imageUrl={room.host.imageUrl}
                  alt=""
                  size="host"
                />
                <p className="max-w-full text-body-r6 break-all text-white">
                  {room.host.nickname}
                </p>
              </div>

              {/* 방장 프로필을 가리키는 말풍선 */}
              <div className="relative max-w-67.5 rounded-[10px] bg-neutral-008 px-4 py-3">
                <img
                  src={tooltipTail}
                  alt=""
                  className="absolute -top-3.75 left-1/2 -translate-x-1/2 -rotate-90"
                />
                <p
                  className={`relative text-subhead-m7 ${room.wantedStance === "AGREE" ? "text-green" : "text-main"}`}
                >
                  {STANCE_LABEL[room.wantedStance]} 입장인 사람을 찾아요
                </p>
              </div>
            </section>
          </div>
        ) : (
          <p
            role="status"
            className="flex flex-1 items-center justify-center text-body-r6 text-neutral-006"
          >
            야차판을 불러오는 중이에요
          </p>
        )}

        <div className="flex shrink-0 flex-col gap-3 pt-2.5 pb-[5.7cqh]">
          <LongButton
            disabled={!canAct}
            onClick={joinRoom}
            className={
              canAct
                ? "!bg-main !text-white hover:!bg-main-006"
                : "!bg-main-009 !text-neutral-004"
            }
          >
            참여하기
          </LongButton>
          <LongButton
            disabled={!canAct}
            onClick={showNextRoom}
            className="!bg-neutral-008 !text-white hover:!bg-neutral-007 disabled:!text-neutral-005"
          >
            다음 방으로
          </LongButton>
        </div>
      </div>

      <Toast message={toastMessage} />
    </main>
  );
};

export default QuickMatchPage;
