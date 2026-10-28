import loadingLogo from "../assets/loading-logo.svg";
import loadingRingSmall from "../assets/loading-ring-small.png";
import loadingRing from "../assets/loading-ring.png";

interface LogoLoadingProps {
  message?: string;
  // 문구가 어두워졌다 밝아지기를 반복 (매칭 대기)
  pulse?: boolean;
  // sm: 링 100px (매칭 대기), md: 링 120px (판정 대기 · 토론방 입장)
  size?: "sm" | "md";
}

const SIZES = {
  sm: {
    ring: loadingRingSmall,
    ringPx: 100,
    box: "size-25",
    gap: "gap-5",
    logo: "top-[35px] left-[31.67px] h-[29.17px] w-[35.83px]",
  },
  md: {
    ring: loadingRing,
    ringPx: 120,
    box: "size-30",
    gap: "gap-10",
    logo: "top-10.5 left-9.5 h-8.75 w-10.75",
  },
};

// 로고 주위로 링이 도는 로딩 표시 (예: 대결 상대 찾는 중)
const LogoLoading = ({
  message,
  pulse = false,
  size = "md",
}: LogoLoadingProps) => {
  const { ring, ringPx, box, gap, logo } = SIZES[size];

  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex w-full flex-col items-center justify-center px-6 ${gap}`}
    >
      <div className={`relative shrink-0 ${box}`}>
        <img
          src={ring}
          alt=""
          width={ringPx}
          height={ringPx}
          className={`absolute inset-0 animate-spin [animation-duration:1.2s] motion-reduce:animate-none ${box}`}
        />
        <img src={loadingLogo} alt="" className={`absolute ${logo}`} />
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
