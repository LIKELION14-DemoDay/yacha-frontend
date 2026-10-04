/**
 * 백엔드 API 요청에 공통으로 사용하는 Axios 인스턴스를 설정하는 파일
 * API Base URL을 환경변수에서 가져오며,
 * HttpOnly 쿠키 기반 Refresh Token 사용을 위해 withCredentials를 활성화
 */
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

export default api;
