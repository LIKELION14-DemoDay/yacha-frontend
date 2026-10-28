import { useId, useState } from "react";

import angleLeftDisabled from "../assets/angle-left-disabled.svg";
import angleLeft from "../assets/angle-left.svg";
import angleRightDisabled from "../assets/angle-right-disabled.svg";
import angleRight from "../assets/angle-right.svg";
import timesIcon from "../assets/times.svg";
import LongButton from "./Button";
import { useEscapeKey } from "../hooks/useEscapeKey";

interface HintModalProps {
  open: boolean;
  hints: string[];
  onClose: () => void;
  // 지금 보고 있는 근거를 작성 칸에 붙여 넣기
  onPaste: (hint: string) => void;
}

// 근거 힌트를 하나씩 넘겨 보는 팝업 (주장 작성)
const HintModal = ({ open, hints, onClose, onPaste }: HintModalProps) => {
  const titleId = useId();
  const [index, setIndex] = useState(0);

  useEscapeKey(open, onClose);

  if (!open || hints.length === 0) return null;

  const isFirst = index === 0;
  const isLast = index === hints.length - 1;

  return (
    // 어두운 배경은 앱 화면 폭 안에만
    <div className="fixed inset-y-0 left-1/2 z-50 flex w-full max-w-100.5 -translate-x-1/2 items-center justify-center bg-black/70 px-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex w-full flex-col items-center gap-5 overflow-hidden rounded-[20px] border-t border-l border-neutral-007 bg-linear-to-b from-neutral-008 from-[11.5%] to-neutral-008/50 px-6.5 pt-5 pb-6 shadow-[0_-23px_17.8px_0_rgba(0,0,0,0.25)]"
      >
        <div className="flex w-full flex-col">
          <div className="flex w-full justify-end px-2.5">
            <button
              type="button"
              aria-label="힌트 닫기"
              onClick={onClose}
              className="flex size-6 cursor-pointer items-center justify-center"
            >
              <img src={timesIcon} alt="" className="size-6" />
            </button>
          </div>

          <div className="flex h-55 w-full flex-col justify-between">
            <div className="flex w-full flex-col gap-4 px-1">
              <div className="flex w-full flex-col items-center gap-1">
                <div className="flex items-end gap-4">
                  <button
                    type="button"
                    aria-label="이전 근거"
                    onClick={() => setIndex((current) => current - 1)}
                    disabled={isFirst}
                    className="flex size-6 cursor-pointer items-center justify-center disabled:cursor-not-allowed"
                  >
                    <img
                      src={isFirst ? angleLeftDisabled : angleLeft}
                      alt=""
                      className="size-6"
                    />
                  </button>
                  <h2 id={titleId} className="text-subhead-b4 text-neutral-001">
                    {index + 1}번 근거
                  </h2>
                  <button
                    type="button"
                    aria-label="다음 근거"
                    onClick={() => setIndex((current) => current + 1)}
                    disabled={isLast}
                    className="flex size-6 cursor-pointer items-center justify-center disabled:cursor-not-allowed"
                  >
                    <img
                      src={isLast ? angleRightDisabled : angleRight}
                      alt=""
                      className="size-6"
                    />
                  </button>
                </div>
                <p className="text-body-r6 text-neutral-006">
                  {index + 1}/{hints.length}
                </p>
              </div>

              <p
                aria-live="polite"
                className="w-full text-subhead-r8 break-keep text-neutral-005"
              >
                {hints[index]}
              </p>
            </div>

            <p className="w-full text-body-r6 text-neutral-007">
              AI로 제작된 내용입니다.
            </p>
          </div>
        </div>

        <LongButton
          onClick={() => onPaste(hints[index])}
          className="!bg-main !text-white hover:!bg-main-006"
        >
          붙여넣기
        </LongButton>
      </div>
    </div>
  );
};

export default HintModal;
