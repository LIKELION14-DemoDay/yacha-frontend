import { Link, useLocation } from "react-router-dom";

import bookmarkIcon from "../assets/bookmark-solid.svg";
import type { PhilosophyArticle } from "../types/philosophy";

export interface OneminuteCardProps {
  article: PhilosophyArticle;
  className?: string;
}

function OneminuteCard({ article, className = "" }: OneminuteCardProps) {
  const location = useLocation();
  const category = article.topic.subcategoryName || article.topic.categoryName;

  return (
    <Link
      to={`/oneminute/${article.id}`}
      state={{ from: `${location.pathname}${location.search}` }}
      className={`flex w-full max-w-88.5 shrink-0 flex-col items-start justify-center gap-5 rounded-[10px] border border-neutral-008 bg-neutral-009 px-3 py-3.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main ${className}`}
    >
      <div className="flex w-full items-start gap-5">
        <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
          <p className="wrap-break-words text-body-r6 text-main">
            {category.startsWith("#") ? category : `#${category}`}
          </p>
          <h2 className="w-full wrap-break-words text-subhead-m7 text-neutral-003">
            {article.topic.statement}
          </h2>
        </div>

        {article.bookmarked && (
          <img src={bookmarkIcon} alt="북마크됨" className="size-6 shrink-0" />
        )}
      </div>

      <ul className="flex flex-wrap items-start gap-1">
        {article.philosophers.map((philosopher) => (
          <li
            key={philosopher}
            className="rounded-full bg-neutral-008 px-2.5 py-1 text-caption-r2 text-neutral-004"
          >
            {philosopher}
          </li>
        ))}
      </ul>
    </Link>
  );
}

export default OneminuteCard;
