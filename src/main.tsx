import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@fontsource-variable/noto-sans-kr'
import './index.css'
import App from './App.tsx'
import { restoreLogin } from './apis/auth'

// iOS 는 확대 금지 설정을 무시하므로 두 손가락 확대 동작을 직접 막습니다.
document.addEventListener('gesturestart', (event) => event.preventDefault())

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
