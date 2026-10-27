import type { ReactNode } from "react";

interface ChoiceQuestionProps {
  question: ReactNode;
  prompt?: string;
  // 질문 위 작은 표시
  label?: ReactNode;
}

// 둘 중 하나를 고르는 화면의 질문 영역 (입장 선택 · 밸런스 게임)
const ChoiceQuestion = ({
  question,
  prompt = "당신의 선택은?",
  label,
}: ChoiceQuestionProps) => {
  return (
    <div className="flex w-full flex-col items-start gap-3">
      {label}
      <h1 className="w-full text-headline-sb4 break-keep text-white">
        {question}
      </h1>
      <p className="w-full text-subhead-m5 text-neutral-006">{prompt}</p>
    </div>
  );
};

export default ChoiceQuestion;
