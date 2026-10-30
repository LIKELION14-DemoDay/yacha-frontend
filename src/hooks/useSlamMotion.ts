/**
 * 두 말풍선이 양옆에서 날아와 부딪히는 모션 (주장 공개 · 채팅 첫 반론)
 * 내용이 도착하면 다음 프레임에 날아오기 시작하고, 자리를 잡으면 isSettled 가 켜짐
 */
import { useEffect, useState } from "react";

// 말풍선이 날아와 자리를 잡는 시간 (SLAM_MOTION_CLASS_NAME 의 duration-900 과 같게)
const SLAM_MOTION_MS = 900;

export const SLAM_MOTION_CLASS_NAME =
  "transition-transform duration-900 ease-spring motion-reduce:transition-none";

// 화면 밖 시작 위치 (내 말풍선은 오른쪽, 상대 말풍선은 왼쪽)
export const SLAM_FROM_RIGHT_CLASS_NAME = "translate-x-[462.5px]";
export const SLAM_FROM_LEFT_CLASS_NAME = "-translate-x-[462.5px]";

export const useSlamMotion = (isArrived: boolean) => {
  // 날아오기 시작했는지 · 자리를 잡았는지
  const [isEntered, setIsEntered] = useState(false);
  const [isSettled, setIsSettled] = useState(false);

  // 화면에 들어올 때 이미 와 있어도 모션이 보이게 한 프레임 쉬고 시작
  useEffect(() => {
    if (!isArrived) return;

    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => setIsEntered(true));
    });

    return () => cancelAnimationFrame(frame);
  }, [isArrived]);

  // 모션 줄이기 설정이면 바로 자리 잡은 것으로
  useEffect(() => {
    if (!isEntered) return;

    const isReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const timeoutId = setTimeout(
      () => setIsSettled(true),
      isReducedMotion ? 0 : SLAM_MOTION_MS,
    );

    return () => clearTimeout(timeoutId);
  }, [isEntered]);

  return { isEntered, isSettled };
};
