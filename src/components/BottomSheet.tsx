import { useId } from "react";

import ModalButtons from "./ModalButtons";
import { useEscapeKey } from "../hooks/useEscapeKey";

interface BottomSheetProps {
  open: boolean;
  title: string;
  description?: string;
  cancelLabel: string;
  confirmLabel: string;
  // 취소 버튼 · 바깥 영역 · Esc
  onCancel: () => void;
  onConfirm: () => void;
}

// 화면 아래에서 올라오는 선택 창 (예: 봇으로 시작할지 묻기)
const BottomSheet = ({
  open,
  title,
  description,
  cancelLabel,
  confirmLabel,
  onCancel,
  onConfirm,
}: BottomSheetProps) => {
  const titleId = useId();
  const descriptionId = useId();

  useEscapeKey(open, onCancel);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70">
      <button
        type="button"
        aria-label="닫기"
        tabIndex={-1}
        onClick={onCancel}
        className="absolute inset-0 cursor-default"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className="relative flex h-60.5 w-full max-w-100.5 flex-col items-center gap-9 overflow-hidden rounded-t-[20px] border-t border-l border-neutral-007 bg-linear-to-b from-neutral-008 from-[59.348%] to-neutral-008/50 px-6.5 py-5 shadow-[0_-23px_17.8px_0_rgba(0,0,0,0.25)]"
      >
        <span
          aria-hidden="true"
          className="h-1 w-20 shrink-0 rounded-[15px] bg-neutral-007"
        />

        <div className="flex w-full flex-col items-center gap-4">
          <div className="flex flex-col items-center gap-1 text-center">
            <h2 id={titleId} className="text-subhead-m5 text-neutral-001">
              {title}
            </h2>
            {description ? (
              <p
                id={descriptionId}
                className="text-subhead-r8 text-neutral-004"
              >
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
    </div>
  );
};

export default BottomSheet;
