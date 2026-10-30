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

  return (
    <span
      role="img"
      aria-label={alt}
      className={`flex shrink-0 items-center justify-center overflow-hidden ${SIZE_CLASS_NAMES[size]}`}
    >
      {imageUrl && failedUrl !== imageUrl ? (
        <img
          key={imageUrl}
          src={imageUrl}
          alt=""
          className="size-full rounded-[inherit] object-contain"
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
