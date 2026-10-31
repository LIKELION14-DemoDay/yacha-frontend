import { useId, type ChangeEvent } from "react";

interface CountedTextAreaProps {
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
  // 화면에 보이는 제목이 없을 때 읽어 줄 이름
  label: string;
  placeholder?: string;
  // 글자 수 오른쪽 안내
  notice?: string;
  disabled?: boolean;
  // 글쓰기 칸과 글자 수 줄 사이를 8px 띄움 (반론 작성)
  spaced?: boolean;
}

// 글자 수가 표시되는 글쓰기 칸 (주장 · 반론 작성)
// 부모 높이를 채우므로 부모에 flex · 높이를 지정해서 사용
const CountedTextArea = ({
  value,
  onChange,
  maxLength,
  label,
  placeholder,
  notice,
  disabled = false,
  spaced = false,
}: CountedTextAreaProps) => {
  const countId = useId();

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value.slice(0, maxLength));
  };

  return (
    // 키보드로 공간이 줄어도 글 칸이 찌그러져 아래 글자 수와 겹치지 않게 최소 높이를 지킴
    <div className="flex min-h-fit w-full flex-1 flex-col">
      <textarea
        value={value}
        onChange={handleChange}
        maxLength={maxLength}
        placeholder={placeholder}
        disabled={disabled}
        aria-label={label}
        aria-describedby={countId}
        className={`min-h-24 w-full flex-1 resize-none rounded-[10px] ${spaced ? "mb-2" : ""} bg-neutral-009 p-4 text-body-r4 text-neutral-004 outline-none placeholder:text-neutral-007 disabled:cursor-not-allowed`}
      />

      <div className="flex items-start justify-between gap-2 py-2 text-body-r4">
        <p id={countId} className="shrink-0 text-neutral-004">
          <span className="text-main">{value.length}</span>/{maxLength}자
        </p>
        {notice ? <p className="truncate text-neutral-006">{notice}</p> : null}
      </div>
    </div>
  );
};

export default CountedTextArea;
