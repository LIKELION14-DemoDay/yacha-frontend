import type { TopicCategory } from "./topic";

export type PhilosophyArticle = {
  id: number;
  weekStart: string;
  topic: {
    topicId: number;
    category: TopicCategory;
    categoryName: string;
    subcategory: string;
    subcategoryName: string;
    statement: string;
  };
  philosophers: string[];
  bookmarked: boolean;
};

export type ThisWeekPhilosophyResponse = {
  weekStart: string | null;
  articles: PhilosophyArticle[];
};

export type PastPhilosophyResponse = {
  articles: PhilosophyArticle[];
  hasNext: boolean;
};

export type PhilosophyBookmarksResponse = {
  articles: PhilosophyArticle[];
  hasNext: boolean;
};

export type PhilosophyArticleDetail = Omit<PhilosophyArticle, "philosophers"> & {
  philosophers: {
    type: string | null;
    name: string;
    alias: string | null;
    sections: {
      title: string;
      content: string;
    }[];
  }[];
  memo: string | null;
};

// 명세의 title/content와 배포 서버의 subtitle/body 응답을 모두 받습니다.
export type PhilosophyArticleDetailResponse = Omit<
  PhilosophyArticleDetail,
  "philosophers"
> & {
  philosophers: {
    type?: string | null;
    name: string;
    alias?: string | null;
    sections: (
      | { title: string; content: string; subtitle?: string; body?: string }
      | { subtitle: string; body: string; title?: string; content?: string }
    )[];
  }[];
};

export type PhilosophyBookmarkResponse = {
  bookmarked: boolean;
};

export type PhilosophyMemoResponse = {
  memo: string | null;
};

// 1분 철학은 회원 전용 (게스트가 열면 GUEST_NOT_ALLOWED)
export const GUEST_ONLY_MESSAGE = "1분 철학은 회원만 볼 수 있어요.";
