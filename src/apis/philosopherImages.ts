import api from "./client";

// 파일명으로 이미지 자체가 필요한 경우에만 사용합니다.
// 프로필·밸런스 게임 응답의 imageUrl은 변환 없이 이미지 src로 사용합니다.
export const getPhilosopherImage = async (
  filename: string,
  signal?: AbortSignal,
) => {
  const response = await api.get<Blob>(
    `/api/v1/philosopher-images/${encodeURIComponent(filename)}`,
    { responseType: "blob", signal },
  );
  return response.data;
};
