/**
 * 카테고리 화면 표시 문구 · 주소(?category=) 값 확인
 */
import type { TopicCategory } from "../types/topic";

export const CATEGORY_LABEL: Record<TopicCategory, string> = {
  HUMAN: "인간",
  RELATIONSHIP: "관계",
  ETHICS: "윤리",
  SOCIETY: "사회",
  LIFE_AND_DEATH: "삶과 죽음",
  TECH_AND_FUTURE: "미래 기술",
  MONEY_AND_SUCCESS: "돈과 성공",
  TRUTH_AND_BELIEF: "진실과 거짓",
};

// 홈 화면 버튼 순서와 같음
export const CATEGORIES = Object.keys(CATEGORY_LABEL) as TopicCategory[];

// 주소의 category 값이 잘못되었으면 인간으로
export const toCategory = (value: string | null): TopicCategory =>
  CATEGORIES.find((item) => item === value) ?? "HUMAN";
