import { Routes, Route } from "react-router-dom";
import OnboardingPage from "./pages/OnboardingPage";
import BalanceGamePage from "./pages/BalanceGamePage";
import LoginPage from "./pages/LoginPage";
import SignInPage from "./pages/SignInPage";
import CompleteSignInPage from "./pages/CompleteSigninPage";
import KakaoCallbackPage from "./pages/KakaoCallbackPage";
import GoogleCallbackPage from "./pages/GoogleCallbackPage";
import HomePage from "./pages/HomePage";

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
    </Routes>
  );
}

export default App;
