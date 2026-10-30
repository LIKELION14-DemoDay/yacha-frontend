/**
 * 내 정보(프로필)를 기기에 저장해 두고, 화면에 들어오자마자 바로 보여 주기 위한 파일
 * 서버에서 새로 받으면 덮어쓰고, 로그아웃 · 로그인이 풀리면 지움
 */
import type { UserProfile } from "../types/user";

const PROFILE_CACHE_KEY = "yacha-my-profile";

export const readProfileCache = (): UserProfile | null => {
  try {
    const saved = localStorage.getItem(PROFILE_CACHE_KEY);
    return saved ? (JSON.parse(saved) as UserProfile) : null;
  } catch {
    return null;
  }
};

export const writeProfileCache = (profile: UserProfile) => {
  try {
    localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(profile));
  } catch {
    // 저장소가 막힌 환경에서도 화면은 서버에서 받은 정보로 동작
  }
};

export const clearProfileCache = () => {
  try {
    localStorage.removeItem(PROFILE_CACHE_KEY);
  } catch {
    // 저장소가 막힌 환경이면 지울 것도 없음
  }
};
