import {
  forwardRef,
  useId,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";

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
}

const inputStateClassNames: Record<InputContainerState, string> = {
  unselected:
    "border-neutral-008 text-neutral-008 placeholder:text-neutral-008",
  inputted: "border-neutral-006 text-neutral-006 placeholder:text-neutral-006",
  selected: "border-neutral-004 text-neutral-002 placeholder:text-neutral-002",
  error: "border-main text-neutral-006 placeholder:text-neutral-006",
};

const InputContainer = forwardRef<HTMLInputElement, InputContainerProps>(
  function InputContainer(
    {
      label,
      errorMessage,
      containerClassName = "",
      className = "",
      id,
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
    const [isFocused, setIsFocused] = useState(false);
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

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      if (value === undefined) {
        setHasUncontrolledValue(event.currentTarget.value.length > 0);
      }

      onChange?.(event);
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

        <input
          {...props}
          ref={ref}
          id={inputId}
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
          className={`w-full rounded-[10px] border bg-transparent px-4 py-4 text-subhead-r8 outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${inputStateClassNames[currentState]} ${className}`}
        />
      </div>
    );
  },
);

export default InputContainer;
