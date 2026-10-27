import loadingLogo from "../assets/loading-logo.svg";
import loadingRing from "../assets/loading-ring.png";

interface LogoLoadingProps {
  message?: string;
  // 문구가 어두워졌다 밝아지기를 반복 (매칭 대기)
  pulse?: boolean;
}

// 로고 주위로 링이 도는 로딩 표시 (예: 대결 상대 찾는 중)
const LogoLoading = ({ message, pulse = false }: LogoLoadingProps) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex w-full flex-col items-center justify-center gap-10 px-6"
    >
      <div className="relative size-30 shrink-0">
        <img
          src={loadingRing}
          alt=""
          width={120}
          height={120}
          className="absolute inset-0 size-30 animate-spin [animation-duration:1.2s] motion-reduce:animate-none"
        />
        <img
          src={loadingLogo}
          alt=""
          className="absolute top-10.5 left-9.5 h-8.75 w-10.75"
        />
      </div>

      {message ? (
        <p
          className={`w-full text-center text-subhead-m5 text-neutral-008 ${pulse ? "animate-text-pulse motion-reduce:animate-none" : ""}`}
        >
          {message}
        </p>
      ) : (
        <span className="sr-only">불러오는 중</span>
      )}
    </div>
  );
};

export default LogoLoading;
