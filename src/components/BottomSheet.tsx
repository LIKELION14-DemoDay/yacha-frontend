import { useId } from "react";

import ModalButtons from "./ModalButtons";
import { useEscapeKey } from "../hooks/useEscapeKey";

interface BottomSheetProps {
  open: boolean;
  // 닫혀 있을 때 손잡이를 누르면 열기
  onOpen: () => void;
  title: string;
  description?: string;
  cancelLabel: string;
  confirmLabel: string;
  // 취소 버튼 · 바깥 영역 · Esc
  onCancel: () => void;
  onConfirm: () => void;
}

// 화면 아래에 손잡이만 보이다가 위로 펼쳐지는 선택 창 (예: 봇으로 시작할지 묻기)
// 부모가 relative 이고 높이 40px(h-10) 자리를 잡아 두면, 그 자리에서 위로 펼쳐짐
const BottomSheet = ({
  open,
  onOpen,
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

  return (
    <>
      <button
        type="button"
        aria-label="닫기"
        tabIndex={-1}
        onClick={onCancel}
        className={`fixed inset-0 z-40 cursor-default bg-black/60 transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div
        role={open ? "dialog" : undefined}
        aria-modal={open || undefined}
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className={`absolute inset-x-0 bottom-0 z-50 overflow-hidden rounded-t-[20px] border-t border-l border-neutral-007 bg-linear-to-b from-neutral-008 from-[59.348%] to-neutral-008/50 shadow-[0_-23px_17.8px_0_rgba(0,0,0,0.25)] transition-[max-height] duration-300 ease-out motion-reduce:transition-none ${
          open ? "max-h-100" : "max-h-10"
        }`}
      >
        {/* 여백은 안쪽에 둬야 닫혔을 때 40px 로 잘림 */}
        <div className="flex flex-col items-center gap-9 px-6.5 pt-5 pb-18.75">
          <button
            type="button"
            aria-label={open ? "창 닫기" : "창 열기"}
            aria-expanded={open}
            onClick={open ? onCancel : onOpen}
            className="flex h-1 w-20 shrink-0 cursor-pointer items-center justify-center rounded-[15px] bg-neutral-007 before:absolute before:inset-x-0 before:top-0 before:h-10"
          />

          <div
            inert={!open}
            className="flex w-full flex-col items-center gap-4"
          >
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
    </>
  );
};

export default BottomSheet;
