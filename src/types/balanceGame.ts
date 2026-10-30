export const PHILOSOPHER_TYPES = [
  "KANT",
  "HOBBES",
  "SARTRE",
  "ROUSSEAU",
  "MILL",
  "EPICTETUS",
  "NIETZSCHE",
  "EPICURUS",
] as const;

export type PhilosopherType = (typeof PHILOSOPHER_TYPES)[number];
export type BalanceAnswer = "A" | "B";

export type BalanceQuestion = {
  number: number;
  question: string;
  optionA: string;
  optionB: string;
};

export type BalanceGameResult = {
  type: PhilosopherType;
  name: string;
  alias: string;
  imageUrl: string;
  sections: { title: string; content: string }[];
};

export const BALANCE_QUESTION_COUNT = 12;

export const isPhilosopherType = (value: unknown): value is PhilosopherType =>
  PHILOSOPHER_TYPES.some((type) => type === value);
