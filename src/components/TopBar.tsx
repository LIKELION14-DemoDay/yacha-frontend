import angleLeft from "../assets/angle-left.svg";

interface TopBarProps {
  onBack?: () => void;
  backLabel?: string;
  // 오른쪽 텍스트 버튼 (예: 나가기)
  actionLabel?: string;
  onAction?: () => void;
}

const TopBar = ({
  onBack,
  backLabel = "뒤로 가기",
  actionLabel,
  onAction,
}: TopBarProps) => {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between px-6 py-2">
      <button
        type="button"
        aria-label={backLabel}
        onClick={onBack}
        className="flex size-6 shrink-0 cursor-pointer items-center justify-center"
      >
        <img src={angleLeft} alt="" className="size-6" />
      </button>

      {actionLabel ? (
        <button
          type="button"
          onClick={onAction}
          className="shrink-0 cursor-pointer text-body-r4 text-neutral-005 transition-colors hover:text-white"
        >
          {actionLabel}
        </button>
      ) : null}
    </header>
  );
};

export default TopBar;
