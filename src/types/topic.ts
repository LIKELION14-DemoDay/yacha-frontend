/**
 * 주제 · 카테고리 관련 타입을 정의하는 파일
 */

export type TopicCategory =
  | "HUMAN"
  | "RELATIONSHIP"
  | "ETHICS"
  | "SOCIETY"
  | "LIFE_AND_DEATH"
  | "TECH_AND_FUTURE"
  | "MONEY_AND_SUCCESS"
  | "TRUTH_AND_BELIEF";

export type Subcategory = {
  code: string;
  name: string;
};

// GET /categories 응답 항목
export type Category = {
  code: TopicCategory;
  name: string;
  subcategories: Subcategory[];
};

// GET /topics/random 응답, GET /sessions/{id}/state 의 topic
export type Topic = {
  id: number;
  category: TopicCategory;
  subcategory: string;
  statement: string;
  agreeText: string;
  disagreeText: string;
};
