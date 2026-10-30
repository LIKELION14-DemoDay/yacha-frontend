import { useState } from "react";
import humanIcon from "../assets/home/temporary-human-home.svg";

type PhilosopherImageProps = {
  imageUrl?: string | null;
  // 빈 문자열이면 꾸밈용으로 숨김 (옆에 닉네임이 함께 나오는 경우)
  alt?: string;
  // xs: 28px (채팅 · 입장 말풍선 · 결과 대진), sm: 32px (홈), md: 40px (방 카드),
  // lg: 80px (마이페이지), xl: 100px (결과 주인공)
  size?: "xs" | "sm" | "md" | "lg" | "xl";
};

const GAME_PROFILE_CLASS_NAME =
  "rounded-[4px] shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]";

const SIZE_CLASS_NAMES = {
  xs: `size-7 ${GAME_PROFILE_CLASS_NAME}`,
  sm: "size-8 rounded-[2px]",
  md: `size-10 ${GAME_PROFILE_CLASS_NAME}`,
  lg: "size-20 rounded-[8px]",
  xl: `size-25 ${GAME_PROFILE_CLASS_NAME}`,
};

function PhilosopherImage({
  imageUrl,
  alt = "프로필 이미지",
  size = "lg",
}: PhilosopherImageProps) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const [paddedUrl, setPaddedUrl] = useState<string | null>(null);

  return (
    <span
      {...(alt ? { role: "img", "aria-label": alt } : { "aria-hidden": true })}
      className={`relative flex shrink-0 items-center justify-center overflow-hidden ${SIZE_CLASS_NAMES[size]}`}
    >
      {imageUrl && failedUrl !== imageUrl ? (
        <img
          key={imageUrl}
          src={imageUrl}
          alt=""
          className={
            paddedUrl === imageUrl
              ? "absolute top-0 left-[-14.285714%] h-[128.571429%] w-[128.571429%] max-w-none"
              : "size-full rounded-[inherit] object-contain"
          }
          onLoad={({ currentTarget }) => {
            const isPaddedPortrait =
              /\/api\/v1\/philosopher-images\/[^/?#]+\.svg(?:[?#]|$)/.test(
                imageUrl,
              ) &&
              currentTarget.naturalWidth === 36 &&
              currentTarget.naturalHeight === 36;
            setPaddedUrl(isPaddedPortrait ? imageUrl : null);
          }}
          onError={() => setFailedUrl(imageUrl)}
        />
      ) : (
        <img
          src={humanIcon}
          alt=""
          aria-hidden="true"
          className="size-3/4 object-contain"
        />
      )}
    </span>
  );
}

export default PhilosopherImage;
