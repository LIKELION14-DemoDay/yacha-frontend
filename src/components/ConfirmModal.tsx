import { useEffect, useId } from "react";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description?: string;
  cancelLabel: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
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
}: ConfirmModalProps) => {
  const titleId = useId();
  const descriptionId = useId();

  // Esc 를 누르면 취소
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
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

        <div className="flex w-full gap-5">
          <button
            type="button"
            autoFocus
            onClick={onCancel}
            className="flex flex-1 cursor-pointer items-center justify-center rounded-[10px] bg-neutral-007 px-5 py-4 text-subhead-b6 text-white"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex flex-1 cursor-pointer items-center justify-center rounded-[10px] bg-main px-5 py-4 text-subhead-b6 text-white"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
