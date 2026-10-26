/**
 * 주제 · 카테고리 관련 백엔드 API 요청을 관리하는 파일
 */
import api from "./client";
import type { ApiResponse } from "./types";
import type { Category, Topic, TopicCategory } from "../types/topic";

// 카테고리 8개와 하위 카테고리 목록
export const getCategories = async () => {
  const response =
    await api.get<ApiResponse<Category[]>>("/api/v1/categories");

  return response.data.data;
};

// 고른 카테고리 안에서 주제 1개를 랜덤으로 받음
// "주제 바꾸기"는 방금 본 주제 id를 exclude 로 넘김
// 뽑을 주제가 없으면 TOPIC_NOT_FOUND (404)
export const getRandomTopic = async (
  category: TopicCategory,
  exclude?: number,
) => {
  const response = await api.get<ApiResponse<Topic>>(
    "/api/v1/topics/random",
    { params: { category, exclude } },
  );

  return response.data.data;
};
