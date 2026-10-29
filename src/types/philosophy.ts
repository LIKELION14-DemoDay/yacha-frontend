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
