/**
 * 입장(찬성 · 반대) 화면 표시 문구
 */
import type { Stance } from "../types/session";

export const STANCE_LABEL: Record<Stance, string> = {
  AGREE: "찬성",
  DISAGREE: "반대",
};
