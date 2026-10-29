import { useEffect, useId, useRef } from "react";

import ModalButtons from "./ModalButtons";
import { useEscapeKey } from "../hooks/useEscapeKey";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description?: string;
  cancelLabel: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
  // 기본적으로 Esc는 취소 동작. 종료 팝업처럼 왼쪽이 파괴적 동작이면 별도 닫기를 지정합니다.
  onDismiss?: () => void;
}

// 화면 가운데 뜨는 확인 팝업 (예: 나가기 확인)
const ConfirmModal = ({
  open,
  title,
  description,
  cancelLabel,
  confirmLabel,
  onCancel,
  onConfirm,
  onDismiss,
}: ConfirmModalProps) => {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement;
    dialogRef.current?.focus();
    return () => {
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, [open]);

  useEscapeKey(open, onDismiss ?? onCancel);

  if (!open) return null;

  return (
    // 어두운 배경은 앱 화면 폭 안에만
    <div className="fixed inset-y-0 left-1/2 z-50 flex w-full max-w-100.5 -translate-x-1/2 items-center justify-center bg-black/70 px-6">
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          const buttons = event.currentTarget.querySelectorAll<HTMLButtonElement>(
            "button:not(:disabled)",
          );
          const first = buttons[0];
          const last = buttons[buttons.length - 1];
          if (
            event.shiftKey &&
            (document.activeElement === first ||
              document.activeElement === event.currentTarget)
          ) {
            event.preventDefault();
            last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
          }
        }}
        className="flex h-50 w-full max-w-88.5 flex-col items-center justify-center gap-9 overflow-hidden rounded-[20px] border-t border-l border-neutral-007 bg-linear-to-b from-neutral-008 from-[11.5%] to-neutral-008/50 px-6.5 py-5"
      >
        <div className="flex flex-col items-center gap-1 text-center">
          <h2 id={titleId} className="text-subhead-m5 text-neutral-001">
            {title}
          </h2>
          {description ? (
            <p id={descriptionId} className="text-subhead-r8 text-neutral-005">
              {description}
            </p>
          ) : null}
        </div>

        <ModalButtons
          cancelLabel={cancelLabel}
          confirmLabel={confirmLabel}
          onCancel={onCancel}
          onConfirm={onConfirm}
        />
      </div>
    </div>
  );
};

export default ConfirmModal;
