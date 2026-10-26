import {
  forwardRef,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import cancelIcon from "../assets/cancel.svg";
import eyeIcon from "../assets/eye.svg";
import eyeSlashIcon from "../assets/eyes-slash.svg";

export type InputContainerState =
  | "unselected"
  | "inputted"
  | "selected"
  | "error";

interface InputContainerProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "defaultValue" | "size"
> {
  label: ReactNode;
  errorMessage?: ReactNode;
  containerClassName?: string;
  clearable?: boolean;
  onClear?: () => void;
}

const stateClassNames: Record<
  InputContainerState,
  { field: string; input: string; icon: string }
> = {
  unselected: {
    field: "border-neutral-008",
    input: "text-neutral-008 placeholder:text-neutral-008",
    icon: "text-neutral-008",
  },
  inputted: {
    field: "border-neutral-006",
    input: "text-neutral-006 placeholder:text-neutral-006",
    icon: "text-neutral-006",
  },
  selected: {
    field: "border-neutral-004",
    input: "text-neutral-002 placeholder:text-neutral-002",
    icon: "text-neutral-004",
  },
  error: {
    field: "border-main",
    input: "text-neutral-006 placeholder:text-neutral-006",
    icon: "text-main",
  },
};

function StateIcon({ source }: { source: string }) {
  return (
    <span
      aria-hidden="true"
      className="block size-6 bg-current"
      style={{
        WebkitMask: `url("${source}") center / contain no-repeat`,
        mask: `url("${source}") center / contain no-repeat`,
      }}
    />
  );
}

const InputContainer = forwardRef<HTMLInputElement, InputContainerProps>(
  function InputContainer(
    {
      label,
      errorMessage,
      containerClassName = "",
      clearable = false,
      onClear,
      className = "",
      id,
      type = "text",
      value,
      disabled = false,
      onBlur,
      onChange,
      onFocus,
      "aria-describedby": ariaDescribedBy,
      ...props
    },
    ref,
  ) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;
    const inputRef = useRef<HTMLInputElement>(null);
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [hasUncontrolledValue, setHasUncontrolledValue] = useState(false);

    const hasValue =
      value === undefined ? hasUncontrolledValue : String(value).length > 0;

    const currentState: InputContainerState = errorMessage
      ? "error"
      : isFocused
        ? "selected"
        : hasValue
          ? "inputted"
          : "unselected";

    const describedBy =
      currentState === "error" && errorMessage
        ? [ariaDescribedBy, errorId].filter(Boolean).join(" ")
        : ariaDescribedBy;

    const isPassword = type === "password";
    const inputType = isPassword && isPasswordVisible ? "text" : type;

    const setInputRef = (node: HTMLInputElement | null) => {
      inputRef.current = node;

      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      if (value === undefined) {
        setHasUncontrolledValue(event.currentTarget.value.length > 0);
      }

      onChange?.(event);
    };

    const handleClear = () => {
      if (value === undefined && inputRef.current) {
        inputRef.current.value = "";
        setHasUncontrolledValue(false);
      }

      onClear?.();
      inputRef.current?.focus();
    };

    const keepInputFocused = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
    };

    return (
      <div
        className={`flex w-full max-w-[402px] flex-col items-start gap-2 px-6 ${containerClassName}`}
        data-state={currentState}
      >
        <div className="flex items-center gap-2">
          <label htmlFor={inputId} className="text-white text-subhead-m7">
            {label}
          </label>

          {currentState === "error" && errorMessage ? (
            <span id={errorId} className="text-main text-caption-r1">
              *{errorMessage}
            </span>
          ) : null}
        </div>

        <div
          className={`flex w-full items-center gap-2 rounded-[10px] border px-4 py-4 transition-colors ${stateClassNames[currentState].field} ${disabled ? "opacity-50" : ""}`}
        >
          <input
            {...props}
            ref={setInputRef}
            id={inputId}
            type={inputType}
            value={value}
            disabled={disabled}
            aria-describedby={describedBy || undefined}
            aria-invalid={currentState === "error" || undefined}
            onBlur={(event) => {
              setIsFocused(false);
              onBlur?.(event);
            }}
            onChange={handleChange}
            onFocus={(event) => {
              setIsFocused(true);
              onFocus?.(event);
            }}
            className={`min-w-0 flex-1 bg-transparent text-subhead-r8 outline-none disabled:cursor-not-allowed ${stateClassNames[currentState].input} ${className}`}
          />

          {clearable && hasValue ? (
            <button
              type="button"
              disabled={disabled}
              aria-label="입력 내용 지우기"
              onMouseDown={keepInputFocused}
              onClick={handleClear}
              className={`shrink-0 cursor-pointer disabled:cursor-not-allowed ${stateClassNames[currentState].icon}`}
            >
              <StateIcon source={cancelIcon} />
            </button>
          ) : null}

          {isPassword ? (
            <button
              type="button"
              disabled={disabled}
              aria-label={
                isPasswordVisible ? "비밀번호 숨기기" : "비밀번호 보기"
              }
              aria-pressed={isPasswordVisible}
              onMouseDown={keepInputFocused}
              onClick={() => {
                setIsPasswordVisible((isVisible) => !isVisible);
                inputRef.current?.focus();
              }}
              className={`shrink-0 cursor-pointer disabled:cursor-not-allowed ${stateClassNames[currentState].icon}`}
            >
              <StateIcon source={isPasswordVisible ? eyeIcon : eyeSlashIcon} />
            </button>
          ) : null}
        </div>
      </div>
    );
  },
);

export default InputContainer;
