interface ToastProps {
  message: string | null;
}

// 화면 아래쪽에 잠깐 떴다 사라지는 알림 (보이는 시간은 useToast 가 관리)
const Toast = ({ message }: ToastProps) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-25 z-50 flex justify-center px-6"
    >
      {message ? (
        <p className="overflow-hidden rounded-[74px] bg-black/70 px-8 py-4 text-center text-subhead-m7 whitespace-pre-line text-white shadow-[0_14px_33.4px_0_rgba(0,0,0,0.25)] backdrop-blur-[3.5px]">
          {message}
        </p>
      ) : null}
    </div>
  );
};

export default Toast;
