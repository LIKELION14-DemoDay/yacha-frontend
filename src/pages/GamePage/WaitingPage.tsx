/**
 * 매칭 대기 페이지 (/game/waiting/:sessionId)
 * 방장이 상대를 기다리는 화면. 방장 알림(/user/queue/match)으로 매칭 · 봇 제안 · 만료를 받음
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
import { getApiErrorCode } from "../../utils/apiError";

// 만료 · 봇 실패 안내를 읽을 시간을 주고 홈으로 이동
const LEAVE_DELAY_MS = 2000;

// 대기 취소가 이 에러면 이미 끝난 방이라 그냥 홈으로
const ENDED_SESSION_CODES = ["SESSION_NOT_WAITING", "SESSION_NOT_FOUND"];

const WaitingPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const sessionId = Number(params.sessionId);

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const { toastMessage, showToast } = useToast();
  const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearLeaveTimeout = () => {
    if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
  };

  const leaveWithToast = useCallback(
    (message: string) => {
      setIsSheetOpen(false);
      showToast(message);
      leaveTimeoutRef.current = setTimeout(
        () => navigate("/home"),
        LEAVE_DELAY_MS,
      );
    },
    [navigate, showToast],
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
        <LogoLoading message="대결 상대를 찾고 있습니다..." pulse />
      </section>

      <BottomSheet
        open={isSheetOpen}
        onOpen={() => setIsSheetOpen(true)}
        title="상대방을 찾지 못했습니다."
        description="봇으로 시작하시겠습니까?"
        cancelLabel="계속 기다리기"
        confirmLabel="봇으로 시작"
        onCancel={closeSheet}
        onConfirm={startWithBot}
      />

      <aside
        aria-label="광고 영역"
        className="relative z-10 h-25 shrink-0 bg-green"
      />

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
