import ProfilePlaceholder from "./ProfilePlaceholder";
import type { Stance } from "../types/session";
import { STANCE_LABEL } from "../utils/stance";

interface RoomCardProps {
  statement: string;
  // 들어가면 내가 맡게 되는 입장
  wantedStance: Stance;
  onClick: () => void;
  disabled?: boolean;
}

// 대기 중인 방 카드 (방 찾기 목록)
const RoomCard = ({
  statement,
  wantedStance,
  onClick,
  disabled = false,
}: RoomCardProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex w-full shrink-0 cursor-pointer items-center gap-5 rounded-[10px] border border-neutral-008 bg-neutral-008 px-3 py-3.5 text-left transition-colors hover:border-neutral-007 disabled:cursor-not-allowed"
    >
      <ProfilePlaceholder size="md" />
      <span className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="text-subhead-m7 break-keep text-neutral-003">
          “{statement}”
        </span>
        <span
          className={`text-body-r6 ${wantedStance === "AGREE" ? "text-green" : "text-main"}`}
        >
          {STANCE_LABEL[wantedStance]}입장인 사람을 찾아요!
        </span>
      </span>
    </button>
  );
};

export default RoomCard;
