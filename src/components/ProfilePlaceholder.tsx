interface ProfilePlaceholderProps {
  // sm: 28px (채팅 · 입장 말풍선 · 결과 대진), md: 40px (방 카드), xl: 100px (결과 주인공)
  size?: "sm" | "md" | "xl";
}

const SIZE_CLASS_NAMES = {
  sm: "size-7",
  md: "size-10",
  xl: "size-25",
};

// 철학자 프로필 이미지가 정해지기 전까지 쓰는 자리 표시
const ProfilePlaceholder = ({ size = "sm" }: ProfilePlaceholderProps) => {
  return (
    <span
      aria-hidden="true"
      className={`block shrink-0 overflow-hidden rounded-[4px] bg-neutral-004 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] ${SIZE_CLASS_NAMES[size]}`}
    />
  );
};

export default ProfilePlaceholder;
