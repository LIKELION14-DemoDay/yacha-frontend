import { useState } from "react";

interface ProfileImageProps {
  // 철학자 유형 이미지 주소 (없으면 회색 자리 표시)
  src?: string | null;
  // sm: 28px (채팅 · 입장 말풍선 · 결과 대진), md: 40px (방 카드), xl: 100px (결과 주인공)
  size?: "sm" | "md" | "xl";
}

const SIZE_CLASS_NAMES = {
  sm: "size-7",
  md: "size-10",
  xl: "size-25",
};

// 프로필 이미지 (옆에 닉네임이 함께 나와서 대체 텍스트는 비워 둠)
const ProfileImage = ({ src, size = "sm" }: ProfileImageProps) => {
  // 불러오지 못한 주소 (같은 주소면 다시 시도하지 않고 자리 표시로)
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const className = `block shrink-0 overflow-hidden rounded-[4px] bg-neutral-004 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] ${SIZE_CLASS_NAMES[size]}`;

  if (!src || failedSrc === src) {
    return <span aria-hidden="true" className={className} />;
  }

  return (
    <img
      src={src}
      alt=""
      onError={() => setFailedSrc(src)}
      className={`${className} object-cover`}
    />
  );
};

export default ProfileImage;
