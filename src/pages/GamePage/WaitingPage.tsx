/**
 * 매칭 대기 페이지 (/game/waiting/:sessionId)
 * 방장이 상대를 기다리는 화면. 방장 알림(/user/queue/match)으로 매칭 · 봇 제안 · 만료를 받음
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { cancelSession, switchToBot } from "../../apis/sessions";
import {
  connectSocket,
  disconnectSocket,
  subscribeMatch,
} from "../../apis/socket";
import BottomSheet from "../../components/BottomSheet";
import ConfirmModal from "../../components/ConfirmModal";
import LogoLoading from "../../components/LogoLoading";
import Toast from "../../components/Toast";
import TopBar from "../../components/TopBar";
import { useToast } from "../../hooks/useToast";
import type { TopicCategory } from "../../types/topic";
import { getApiErrorCode } from "../../utils/apiError";

// 만료 · 봇 실패 안내를 읽을 시간을 주고 홈으로 이동
const LEAVE_DELAY_MS = 2000;

// 대기 취소가 이 에러면 이미 끝난 방이라 그냥 홈으로
const ENDED_SESSION_CODES = ["SESSION_NOT_WAITING", "SESSION_NOT_FOUND"];

const WaitingPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const sessionId = Number(params.sessionId);
  // 입장 선택에서 넘겨준 카테고리 (새로고침 등으로 없으면 홈으로)
  const category = (useLocation().state as { category?: TopicCategory } | null)
    ?.category;

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  // 봇 제안을 한 번 받은 뒤로는 닫아도 손잡이가 남아 다시 열 수 있음
  const [hasBotPrompt, setHasBotPrompt] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const { toastMessage, showToast } = useToast();
  const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearLeaveTimeout = () => {
    if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
  };

  // 방 찾기 화면으로 돌아가 안내를 띄움 (카테고리를 모르면 여기서 안내 후 홈으로)
  const leaveWithToast = useCallback(
    (message: string) => {
      setIsSheetOpen(false);

      if (category) {
        navigate(`/game/rooms?category=${category}`, {
          replace: true,
          state: { toast: message },
        });
        return;
      }

      showToast(message);
      leaveTimeoutRef.current = setTimeout(
        () => navigate("/home"),
        LEAVE_DELAY_MS,
      );
    },
    [category, navigate, showToast],
  );

  // 화면을 떠나면 예약해 둔 홈 이동 취소
  useEffect(() => clearLeaveTimeout, []);

  // 방장 알림: 매칭되면 토론방으로, 오래 기다리면 봇 제안, 5분 지나면 종료
  useEffect(() => {
    connectSocket();

    const unsubscribe = subscribeMatch((event) => {
      switch (event.type) {
        case "MATCHED":
          navigate(`/game/${event.sessionId}`);
          break;
        case "WAIT_PROMPT":
          setHasBotPrompt(true);
          setIsSheetOpen(true);
          break;
        case "WAIT_EXPIRED":
          leaveWithToast("5분이 지나 매칭이 종료되었습니다.");
          break;
      }
    });

    return () => {
      unsubscribe();
      void disconnectSocket();
    };
  }, [navigate, leaveWithToast]);

  const closeSheet = useCallback(() => setIsSheetOpen(false), []);
  const closeLeaveModal = useCallback(() => setIsLeaveModalOpen(false), []);

  const startWithBot = async () => {
    setIsSheetOpen(false);

    try {
      await switchToBot(sessionId);
      navigate(`/game/${sessionId}`);
    } catch {
      leaveWithToast("AI봇이 호출되지 않아 게임이 종료되었습니다.");
    }
  };

  // 대기 취소 후 홈으로 (이미 끝난 방이면 그대로 홈, 그 외 실패는 대기 화면에 남음)
  const handleLeave = async () => {
    setIsLeaveModalOpen(false);
    clearLeaveTimeout();

    try {
      await cancelSession(sessionId);
      navigate("/home");
    } catch (error) {
      const code = getApiErrorCode(error);

      if (code && ENDED_SESSION_CODES.includes(code)) {
        navigate("/home");
      } else {
        showToast("나가지 못했어요. 다시 시도해 주세요.");
      }
    }
  };

  return (
    <main className="relative mx-auto flex h-dvh w-full max-w-100.5 flex-col bg-secondary">
      <TopBar
        title="랜덤 주제로 야차 뜨기"
        onBack={() => setIsLeaveModalOpen(true)}
        backLabel="대기 나가기"
        actionLabel="나가기"
        onAction={() => setIsLeaveModalOpen(true)}
      />

      <section className="flex min-h-0 flex-1 items-center justify-center">
        <LogoLoading message="대결 상대를 찾고 있습니다..." pulse size="sm" />
      </section>

      {/* 시트는 광고 바로 위에서 자람 (광고는 가리지 않고 배경과 함께 어두워짐) */}
      <div className="relative h-0 shrink-0">
        <BottomSheet
          open={isSheetOpen}
          peek={hasBotPrompt}
          onOpen={() => setIsSheetOpen(true)}
          title="상대방을 찾지 못했습니다."
          description="봇으로 시작하시겠습니까?"
          cancelLabel="계속 기다리기"
          confirmLabel="봇으로 시작"
          onCancel={closeSheet}
          onConfirm={startWithBot}
        />
      </div>

      <aside aria-label="광고 영역" className="h-25 shrink-0 bg-green" />

      <Toast message={toastMessage} />

      <ConfirmModal
        open={isLeaveModalOpen}
        title="쫄리면 나가시던지"
        description="다시 돌아올 수 없습니다."
        cancelLabel="계속 기다리기"
        confirmLabel="나가기"
        onCancel={closeLeaveModal}
        onConfirm={handleLeave}
      />
    </main>
  );
};

export default WaitingPage;
