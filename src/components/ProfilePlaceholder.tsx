interface ProfilePlaceholderProps {
  // sm: 24px (채팅 · 입장 말풍선), md: 32px (방 카드)
  size?: "sm" | "md";
}

const SIZE_CLASS_NAMES = {
  sm: "size-6 text-[7px]",
  md: "size-8 text-[7.2px]",
};

// 철학자 프로필 이미지가 정해지기 전까지 쓰는 자리 표시
const ProfilePlaceholder = ({ size = "sm" }: ProfilePlaceholderProps) => {
  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-[4px] border-[0.4px] border-neutral-003 bg-neutral-001 text-neutral-006 ${SIZE_CLASS_NAMES[size]}`}
    >
      profile
    </span>
  );
};

export default ProfilePlaceholder;
