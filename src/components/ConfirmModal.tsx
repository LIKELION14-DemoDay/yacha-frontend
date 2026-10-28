import { useId } from "react";

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

  useEscapeKey(open, onCancel);

  if (!open) return null;

  return (
    // 어두운 배경은 앱 화면 폭 안에만
    <div className="fixed inset-y-0 left-1/2 z-50 flex w-full max-w-100.5 -translate-x-1/2 items-center justify-center bg-black/70 px-6">
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
