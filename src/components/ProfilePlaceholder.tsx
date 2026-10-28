// 철학자 프로필 이미지가 정해지기 전까지 쓰는 24px 자리 표시 (채팅 · 입장 말풍선)
const ProfilePlaceholder = () => {
  return (
    <span
      aria-hidden="true"
      className="flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-[4px] border-[0.4px] border-neutral-003 bg-neutral-001 text-[7px] text-neutral-006"
    >
      profile
    </span>
  );
};

export default ProfilePlaceholder;
