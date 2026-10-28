import { Routes, Route } from "react-router-dom";
import OnboardingPage from "./pages/OnboardingPage";
import BalanceGamePage from "./pages/BalanceGamePage";
import LoginPage from "./pages/LoginPage/LoginPage";
import SignInPage from "./pages/LoginPage/SignInPage";
import CompleteSignInPage from "./pages/LoginPage/CompleteSigninPage";
import KakaoCallbackPage from "./pages/LoginPage/KakaoCallbackPage";
import GoogleCallbackPage from "./pages/LoginPage/GoogleCallbackPage";
import HomePage from "./pages/HomePage";
import OneminutePage from "./pages/OneminutePage";
import MyPage from "./pages/MyPage/MyPage";
import MySettingPage from "./pages/MyPage/MySettingPage";
import GamePage from "./pages/GamePage/GamePage";
import RoomListPage from "./pages/GamePage/RoomListPage";
import StanceSelectPage from "./pages/GamePage/StanceSelectPage";
import WaitingPage from "./pages/GamePage/WaitingPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<OnboardingPage />} />
      <Route path="/balance" element={<BalanceGamePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/complete" element={<CompleteSignInPage />} />
      <Route path="/oauth/kakao" element={<KakaoCallbackPage />} />
      <Route path="/oauth/google" element={<GoogleCallbackPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/oneminute" element={<OneminutePage />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/my/setting" element={<MySettingPage />} />
      <Route path="/game/rooms" element={<RoomListPage />} />
      <Route path="/game/select" element={<StanceSelectPage />} />
      <Route path="/game/waiting/:sessionId" element={<WaitingPage />} />
      <Route path="/game/:sessionId" element={<GamePage />} />
    </Routes>
  );
}

export default App;
