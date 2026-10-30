import { useLayoutEffect, useSyncExternalStore } from "react";
import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { getAccessToken, subscribeAccessToken } from "./apis/tokenStore";
import OnboardingPage from "./pages/OnboardingPage";
import BalanceGamePage from "./pages/BalanceGamePage/BalanceGamePage";
import BalanceGamePlayPage from "./pages/BalanceGamePage/BalanceGamePlayPage";
import BalanceGameResultPage from "./pages/BalanceGamePage/BalanceGameResultPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import SignInPage from "./pages/LoginPage/SignInPage";
import ResetPwPage from "./pages/LoginPage/ResetPwPage";
import CompleteSignInPage from "./pages/LoginPage/CompleteSigninPage";
import KakaoCallbackPage from "./pages/LoginPage/KakaoCallbackPage";
import GoogleCallbackPage from "./pages/LoginPage/GoogleCallbackPage";
import HomePage from "./pages/HomePage";
import OneminutePage from "./pages/OneminutePage/OneminutePage";
import OneminuteDetailPage from "./pages/OneminutePage/OneminuteDetailPage";
import MyPage from "./pages/MyPage/MyPage";
import MyBookmarkPage from "./pages/MyPage/MyBookmarkPage";
import MySettingPage from "./pages/MyPage/MySettingPage";
import GamePage from "./pages/GamePage/GamePage";
import ResultPage from "./pages/GamePage/ResultPage";
import QuickMatchPage from "./pages/GamePage/QuickMatchPage";
import RoomListPage from "./pages/GamePage/RoomListPage";
import StanceSelectPage from "./pages/GamePage/StanceSelectPage";
import WaitingPage from "./pages/GamePage/WaitingPage";

function RequireAuth() {
  const token = useSyncExternalStore(subscribeAccessToken, getAccessToken);
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}

function App() {
  const { pathname } = useLocation();

  // 화면을 옮기면 앞 화면의 스크롤 위치가 남지 않게 맨 위로
  useLayoutEffect(() => {
    document.getElementById("root")?.scrollTo(0, 0);
  }, [pathname]);

  return (
    <Routes>
      <Route path="/" element={<OnboardingPage />} />
      <Route path="/balance" element={<BalanceGamePage />} />
      <Route path="/balance/game" element={<BalanceGamePlayPage />} />
      <Route path="/balance/result/:type" element={<BalanceGameResultPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/resetpw" element={<ResetPwPage />} />
      <Route path="/complete" element={<CompleteSignInPage />} />
      <Route path="/oauth/kakao" element={<KakaoCallbackPage />} />
      <Route path="/oauth/google" element={<GoogleCallbackPage />} />
      <Route element={<RequireAuth />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/oneminute" element={<OneminutePage />} />
        <Route path="/oneminute/:id" element={<OneminuteDetailPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/my/bookmarks" element={<MyBookmarkPage />} />
        <Route path="/my/setting" element={<MySettingPage />} />
        <Route path="/game/rooms" element={<RoomListPage />} />
        <Route path="/game/quick" element={<QuickMatchPage />} />
        <Route path="/game/select" element={<StanceSelectPage />} />
        <Route path="/game/waiting/:sessionId" element={<WaitingPage />} />
        <Route path="/game/:sessionId" element={<GamePage />} />
        <Route path="/game/:sessionId/result" element={<ResultPage />} />
      </Route>
    </Routes>
  );
}

export default App;
