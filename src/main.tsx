import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@fontsource-variable/noto-sans-kr'
import './index.css'
import App from './App.tsx'
import { restoreLogin } from './apis/auth'

// OAuth 콜백은 새 로그인으로 토큰을 발급하므로 기존 쿠키를 재발급하지 않습니다.
const isOAuthCallback = ["/oauth/google", "/oauth/kakao"].includes(
  window.location.pathname,
)
const authReady = isOAuthCallback ? Promise.resolve() : restoreLogin()

// 일반 페이지는 로그인 복구가 끝난 뒤 표시합니다.
authReady.finally(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>,
  )
})
