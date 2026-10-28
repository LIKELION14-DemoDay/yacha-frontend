interface ModalButtonsProps {
  cancelLabel: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: () => void;
}

// 팝업 · 바텀시트 아래의 두 버튼 (왼쪽 회색 취소, 오른쪽 빨강 확인)
const ModalButtons = ({
  cancelLabel,
  confirmLabel,
  onCancel,
  onConfirm,
}: ModalButtonsProps) => {
  return (
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
  );
};

export default ModalButtons;
