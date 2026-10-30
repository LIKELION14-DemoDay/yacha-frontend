import { useState } from "react";
import humanIcon from "../assets/home/temporary-human-home.svg";

type PhilosopherImageProps = {
  imageUrl?: string | null;
  alt?: string;
  size?: "sm" | "lg";
};

const SIZE_CLASS_NAMES = {
  sm: "size-8 rounded-[2px]",
  lg: "size-20 rounded-[8px]",
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
      role="img"
      aria-label={alt}
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
