/**
 * 입장 선택 페이지 (/game/select?category=HUMAN)
 * 고른 카테고리의 랜덤 주제에 예(찬성) / 아니오(반대)를 고르고 방을 만듦
 */
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import { createSession } from "../../apis/sessions";
import { getRandomTopic } from "../../apis/topics";
import LongButton from "../../components/Button";
import ChoiceOptions from "../../components/ChoiceOptions";
import ChoiceQuestion from "../../components/ChoiceQuestion";
import Toast from "../../components/Toast";
import TopBar from "../../components/TopBar";
import { useToast } from "../../hooks/useToast";
import type { Stance } from "../../types/session";
import type { Topic } from "../../types/topic";
import { getApiErrorCode } from "../../utils/apiError";
import { toCategory } from "../../utils/category";

// 왼쪽 agreeText(예) = 찬성, 오른쪽 disagreeText(아니오) = 반대
const STANCES: [Stance, Stance] = ["AGREE", "DISAGREE"];

const StanceSelectPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const category = toCategory(searchParams.get("category"));
  // 방 찾기의 자동 제안(NEW_TOPIC)에서 넘어오면 받은 주제를 그대로 씀
  const proposedTopic =
    (useLocation().state as { topic?: Topic } | null)?.topic ?? null;

  const [topic, setTopic] = useState<Topic | null>(proposedTopic);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChangingTopic, setIsChangingTopic] = useState(false);
  const { toastMessage, showToast } = useToast();

  // 주제 바꾸기: 방금 본 주제를 빼고 다시 받기 (요청 중에는 다시 누를 수 없음)
  const changeTopic = async () => {
    if (!topic || isChangingTopic) return;

    setIsChangingTopic(true);
    try {
      setTopic(await getRandomTopic(category, topic.id));
      setSelectedIndex(null);
    } catch (error) {
      showToast(
        getApiErrorCode(error) === "TOPIC_NOT_FOUND"
          ? "다른 주제가 없어요."
          : "주제를 불러오지 못했어요.",
      );
    } finally {
      setIsChangingTopic(false);
    }
  };

  // 첫 진입 때 주제 받아오기 (나가면 늦게 온 응답은 무시)
  useEffect(() => {
    if (proposedTopic) return;

    let ignore = false;

    getRandomTopic(category)
      .then((nextTopic) => {
        if (!ignore) setTopic(nextTopic);
      })
      .catch(() => {
        if (!ignore) showToast("주제를 불러오지 못했어요.");
      });

    return () => {
      ignore = true;
    };
  }, [category, proposedTopic, showToast]);

  const handleConfirm = async () => {
    if (!topic || selectedIndex === null) return;

    setIsSubmitting(true);
    try {
      const { sessionId } = await createSession({
        roomType: "RANDOM",
        topicId: topic.id,
        stance: STANCES[selectedIndex],
      });
      // 매칭이 안 되면 이 카테고리의 방 찾기로 돌아가도록 같이 넘김
      navigate(`/game/waiting/${sessionId}`, { state: { category } });
    } catch (error) {
      showToast(
        getApiErrorCode(error) === "ALREADY_IN_SESSION"
          ? "이미 참여 중인 게임이 있어요."
          : "방을 만들지 못했어요.",
      );
      setIsSubmitting(false);
    }
  };

  const canConfirm =
    topic !== null &&
    selectedIndex !== null &&
    !isSubmitting &&
    !isChangingTopic;

  return (
    <main className="mx-auto flex h-dvh w-full max-w-100.5 flex-col bg-secondary">
      <TopBar title="랜덤 주제로 야차 뜨기" onBack={() => navigate(-1)} />

      {/* 주제가 길어 화면이 모자라면 겹치지 않고 스크롤 */}
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <section className="shrink-0 px-6 pt-20">
          <ChoiceQuestion
            question={topic?.statement ?? "주제를 불러오는 중이에요"}
          />
        </section>

        <section className="flex flex-1 items-center px-6 pt-8 pb-15">
          <ChoiceOptions
            options={[
              topic?.agreeText ?? "예",
              topic?.disagreeText ?? "아니오",
            ]}
            selectedIndex={selectedIndex}
            onSelect={setSelectedIndex}
            label="입장 선택"
          />
        </section>
      </div>

      <button
        type="button"
        onClick={changeTopic}
        disabled={!topic || isChangingTopic}
        className="shrink-0 cursor-pointer py-3 text-center text-subhead-r8 text-neutral-006 transition-colors hover:text-neutral-004 disabled:cursor-not-allowed disabled:hover:text-neutral-006"
      >
        주제 바꾸기
      </button>

      <div className="shrink-0 px-6 pt-2.5 pb-12.5">
        <LongButton
          disabled={!canConfirm}
          onClick={handleConfirm}
          className={
            canConfirm
              ? "!bg-main !text-white hover:!bg-main-006"
              : "!bg-main-009 !text-neutral-004"
          }
        >
          확인
        </LongButton>
      </div>

      <aside aria-label="광고 영역" className="h-17.5 shrink-0 bg-green" />

      <Toast message={toastMessage} />
    </main>
  );
};

export default StanceSelectPage;
