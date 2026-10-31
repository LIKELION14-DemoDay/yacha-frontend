/**
 * 매칭 완료 화면 (주장 작성 구간 처음 몇 초)
 * 서로의 입장을 말풍선으로 보여주고 곧 대결이 시작된다고 알림
 * 잠시 뒤 내 말풍선은 오른쪽, 상대 말풍선은 왼쪽 화면 밖에서 날아와 부딪히듯 멈춤
 */
import { useEffect, useState } from "react";

import matchedLogo from "../../assets/matched-logo.svg";
import StanceBubble from "../../components/StanceBubble";
import type { Stance } from "../../types/session";

// 화면이 뜨고 말풍선이 날아오기까지
const BUBBLES_DELAY_MS = 100;

type BubbleInfo = {
  name: string;
  stance: Stance;
  imageUrl: string;
  content: string;
};

interface MatchedIntroProps {
  mine: BubbleInfo;
  opponent: BubbleInfo;
}

const MatchedIntro = ({ mine, opponent }: MatchedIntroProps) => {
  const [showBubbles, setShowBubbles] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => setShowBubbles(true), BUBBLES_DELAY_MS);
    return () => clearTimeout(timeoutId);
  }, []);

  const motionClassName =
    "transition-transform duration-900 ease-spring motion-reduce:transition-none";

  return (
    <section className="flex min-h-0 flex-1 flex-col justify-center gap-8 overflow-x-hidden overflow-y-auto">
      <div className="flex flex-col items-center">
        <div className="pb-6">
          <img src={matchedLogo} alt="" />
        </div>
        <div className="flex flex-col items-center gap-2 px-6 py-2.5 text-center">
          <h1 className="text-headline-sb3 text-white">
            대결 상대가
            <br />
            매칭되었습니다!
          </h1>
          <p className="text-body-r2 text-neutral-006">곧 대결이 시작됩니다.</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div
          className={`${motionClassName} ${showBubbles ? "translate-x-0" : "translate-x-[462.5px]"}`}
        >
          <StanceBubble isMine {...mine} />
        </div>
        <p className="text-center text-body-r2 text-neutral-008">VS</p>
        <div
          className={`${motionClassName} ${showBubbles ? "translate-x-0" : "-translate-x-[462.5px]"}`}
        >
          <StanceBubble isMine={false} {...opponent} />
        </div>
      </div>
    </section>
  );
};

export default MatchedIntro;
