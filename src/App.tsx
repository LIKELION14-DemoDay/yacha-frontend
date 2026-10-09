import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import KakaoCallbackPage from "./pages/KakaoCallbackPage";
import GoogleCallbackPage from "./pages/GoogleCallbackPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/oauth/kakao" element={<KakaoCallbackPage />} />
      <Route path="/oauth/google" element={<GoogleCallbackPage />} />
    </Routes>
  );
}

export default App;
