import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import KakaoCallbackPage from "./pages/KakaoCallbackPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/oauth/kakao" element={<KakaoCallbackPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
