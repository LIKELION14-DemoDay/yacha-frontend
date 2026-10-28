import balanceScaleFirst from "../assets/balance-scale-first.svg";
import balanceScaleSecond from "../assets/balance-scale-second.svg";

interface ChoiceOptionsProps {
  // 왼쪽 · 오른쪽 선택지 문구
  options: [string, string];
  // 고른 선택지 (0: 왼쪽, 1: 오른쪽, 안 골랐으면 null)
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  label?: string;
}

const OPTION_ICONS = [balanceScaleFirst, balanceScaleSecond];

// 저울 아이콘이 있는 두 선택지 카드 (입장 선택 · 밸런스 게임)
const ChoiceOptions = ({
  options,
  selectedIndex,
  onSelect,
  label = "선택지",
}: ChoiceOptionsProps) => {
  return (
    <div role="radiogroup" aria-label={label} className="flex w-full gap-4">
      {options.map((option, index) => {
        const isSelected = selectedIndex === index;
        // 하나를 고르면 고른 쪽은 커지고 다른 쪽은 작아짐 (169px → 178px / 160px)
        const isOtherSelected = selectedIndex !== null && !isSelected;

        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onSelect(index)}
            className={`flex aspect-square min-w-0 flex-1 cursor-pointer flex-col items-center justify-center gap-4 overflow-hidden rounded-[20px] border px-2.5 py-5 transition ${
              isSelected
                ? "z-10 scale-[1.053] border-white/50 bg-main shadow-[0_0_10.2px_0_var(--color-main)]"
                : `border-transparent bg-neutral-009 ${isOtherSelected ? "scale-[0.947]" : ""}`
            }`}
          >
            <img src={OPTION_ICONS[index]} alt="" className="size-11.5" />
            <span className="w-full text-center text-subhead-m5 break-keep text-white">
              {option}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default ChoiceOptions;
