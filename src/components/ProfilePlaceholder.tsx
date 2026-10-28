interface ProfilePlaceholderProps {
  // sm: 24px (채팅 · 입장 말풍선), md: 32px (방 카드), lg: 29px (결과 대진), xl: 100px (결과 주인공)
  size?: "sm" | "md" | "lg" | "xl";
}

const SIZE_CLASS_NAMES = {
  sm: "size-6 rounded-[4px] border-[0.4px] text-[7px]",
  md: "size-8 rounded-[4px] border-[0.4px] text-[7.2px]",
  lg: "size-[29px] rounded-[5px] border-[0.5px] text-[9px]",
  xl: "size-25 rounded-[3.759px] border-[0.376px] text-[6.767px]",
};

// 철학자 프로필 이미지가 정해지기 전까지 쓰는 자리 표시
const ProfilePlaceholder = ({ size = "sm" }: ProfilePlaceholderProps) => {
  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center overflow-hidden border-neutral-003 bg-neutral-001 text-neutral-006 ${SIZE_CLASS_NAMES[size]}`}
    >
      profile
    </span>
  );
};

export default ProfilePlaceholder;
