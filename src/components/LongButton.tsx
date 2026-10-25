import type { ButtonHTMLAttributes, ReactNode } from "react";

export type LongButtonVariant = "default" | "active" | "inactive";

// 기본 button 속성을 그대로 사용
interface LongButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  // 문자열뿐 아니라 아이콘과 같은 JSX도 버튼 내용으로 받습니다.
  children: ReactNode;
  variant?: LongButtonVariant;
}

// 각 variant의 디자인 시스템 색상 토큰 연결
const variantClassNames: Record<LongButtonVariant, string> = {
  default: "bg-main-009 text-neutral-004 hover:bg-main hover:text-white",
  active: "bg-secondary text-white",
  inactive: "bg-neutral-005 text-white",
};

function LongButton({
  children,
  variant = "default",
  className = "",
  disabled = false,
  type = "button",
  ...props
}: LongButtonProps) {
  // inactive variant는 disabled 속성을 직접 넘긴 것과 동일하게 처리
  const isDisabled = disabled || variant === "inactive";

  // disabled가 우선, 해당할 때는 variant와 관계없이 비활성화 색상을 사용
  const colorClassName = isDisabled
    ? variantClassNames.inactive
    : variantClassNames[variant];

  return (
    <button
      {...props}
      type={type}
      disabled={isDisabled}
      className={`flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-[10px] px-5 py-4 text-subhead-b6 disabled:cursor-not-allowed ${colorClassName} ${className}`}
    >
      {children}
    </button>
  );
}

export default LongButton;
