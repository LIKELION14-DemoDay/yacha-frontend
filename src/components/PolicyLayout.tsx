import type { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import angleLeft from "../assets/angle-left.svg";

type PolicyLang = "ko" | "en";

type PolicyLayoutProps = {
  title: string;
  lang: PolicyLang;
  // 다른 언어로 된 같은 페이지 주소
  alternatePath: string;
  children: ReactNode;
};

const TEXT: Record<PolicyLang, { back: string; switchLabel: string }> = {
  ko: { back: "이전 화면으로 돌아가기", switchLabel: "English" },
  en: { back: "Go back", switchLabel: "한국어" },
};

// 약관 · 정책 · 가격 안내처럼 로그인 없이 보는 글 페이지 틀
const PolicyLayout = ({
  title,
  lang,
  alternatePath,
  children,
}: PolicyLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const text = TEXT[lang];

  // 주소로 바로 들어와 앱 안의 이전 화면이 없으면 로그인 화면으로
  const goBack = () => {
    if (location.key === "default") {
      navigate("/login");
      return;
    }
    navigate(-1);
  };

  return (
    <main
      lang={lang}
      className="mx-auto flex min-h-full w-full max-w-100.5 flex-col bg-secondary text-white"
    >
      <header className="flex h-12 shrink-0 items-center gap-2.5 px-6 py-2">
        <button
          type="button"
          onClick={goBack}
          aria-label={text.back}
          className="flex h-8 w-6 shrink-0 cursor-pointer items-center justify-center"
        >
          <img src={angleLeft} alt="" className="size-6" />
        </button>
        <h1 className="min-w-0 flex-1 truncate text-subhead-m5">{title}</h1>
        {/* 언어만 바꾸는 이동이라 뒤로가기 기록은 남기지 않음 */}
        <Link
          to={alternatePath}
          replace
          lang={lang === "ko" ? "en" : "ko"}
          className="shrink-0 text-body-r6 text-neutral-005 underline underline-offset-2 hover:text-white"
        >
          {text.switchLabel}
        </Link>
      </header>

      <article className="flex flex-col gap-8 px-6 pt-6 pb-10 text-body-r6 text-neutral-003">
        {children}
      </article>
    </main>
  );
};

export default PolicyLayout;
