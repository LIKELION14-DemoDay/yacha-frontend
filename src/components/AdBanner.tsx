/**
 * 화면 맨 아래 광고 칸 (카카오 애드핏 320×50 배너)
 * 화면이 바뀌어도 페이지를 새로 불러오지 않는 앱이라, 광고 칸이 생길 때마다 태그와 스크립트를 새로 넣어 광고를 다시 호출함
 * 광고 단위 ID 가 없으면 (로컬 개발 등) 자리만 보여 줌
 */
import { useEffect, useRef } from "react";

const ADFIT_SCRIPT_URL = "https://t1.daumcdn.net/kas/static/ba.min.js";
const AD_UNIT_ID = import.meta.env.VITE_ADFIT_UNIT_ID as string | undefined;
const AD_WIDTH = 320;
const AD_HEIGHT = 50;

declare global {
  interface Window {
    adfit?: { destroy?: (unitId: string) => void };
  }
}

const AdBanner = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !AD_UNIT_ID) return;

    const ad = document.createElement("ins");
    ad.className = "kakao_ad_area";
    ad.style.display = "none";
    ad.dataset.adUnit = AD_UNIT_ID;
    ad.dataset.adWidth = String(AD_WIDTH);
    ad.dataset.adHeight = String(AD_HEIGHT);

    // 스크립트가 붙는 순간 위의 광고 칸을 찾아 광고를 불러옴
    const script = document.createElement("script");
    script.async = true;
    script.src = ADFIT_SCRIPT_URL;

    container.append(ad, script);

    return () => {
      window.adfit?.destroy?.(AD_UNIT_ID);
      container.replaceChildren();
    };
  }, []);

  return (
    // data-ad: 홈 바 영역까지 배경을 늘리고 키보드가 올라오면 숨기는 공통 스타일 대상 (index.css)
    <aside
      aria-label="광고 영역"
      data-ad
      className={`flex h-17.5 shrink-0 items-center justify-center ${AD_UNIT_ID ? "bg-secondary" : "bg-green"}`}
    >
      <div ref={containerRef} />
    </aside>
  );
};

export default AdBanner;
