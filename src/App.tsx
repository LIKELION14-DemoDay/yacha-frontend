import { useSyncExternalStore } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { getAccessToken, subscribeAccessToken } from "./apis/tokenStore";
import OnboardingPage from "./pages/OnboardingPage";
import BalanceGamePage from "./pages/BalanceGamePage";
import LoginPage from "./pages/LoginPage/LoginPage";
import SignInPage from "./pages/LoginPage/SignInPage";
import ResetPwPage from "./pages/LoginPage/ResetPwPage";
import CompleteSignInPage from "./pages/LoginPage/CompleteSigninPage";
import KakaoCallbackPage from "./pages/LoginPage/KakaoCallbackPage";
import GoogleCallbackPage from "./pages/LoginPage/GoogleCallbackPage";
import HomePage from "./pages/HomePage";
import OneminutePage from "./pages/OneminutePage";
import MyPage from "./pages/MyPage/MyPage";
import MySettingPage from "./pages/MyPage/MySettingPage";
import GamePage from "./pages/GamePage/GamePage";
import ResultPage from "./pages/GamePage/ResultPage";
import RoomListPage from "./pages/GamePage/RoomListPage";
import StanceSelectPage from "./pages/GamePage/StanceSelectPage";
import WaitingPage from "./pages/GamePage/WaitingPage";

function RequireAuth() {
  const token = useSyncExternalStore(subscribeAccessToken, getAccessToken);
  return token ? <Outlet /> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<OnboardingPage />} />
      <Route path="/balance" element={<BalanceGamePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/resetpw" element={<ResetPwPage />} />
      <Route path="/complete" element={<CompleteSignInPage />} />
      <Route path="/oauth/kakao" element={<KakaoCallbackPage />} />
      <Route path="/oauth/google" element={<GoogleCallbackPage />} />
      <Route element={<RequireAuth />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/oneminute" element={<OneminutePage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/my/setting" element={<MySettingPage />} />
        <Route path="/game/rooms" element={<RoomListPage />} />
        <Route path="/game/select" element={<StanceSelectPage />} />
        <Route path="/game/waiting/:sessionId" element={<WaitingPage />} />
        <Route path="/game/:sessionId" element={<GamePage />} />
        <Route path="/game/:sessionId/result" element={<ResultPage />} />
      </Route>
    </Routes>
  );
}

export default App;
