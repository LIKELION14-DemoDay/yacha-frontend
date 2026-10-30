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

// 첫 화면에서 기본 글꼴 → 앱 글꼴로 바뀌며 글자가 움찔하지 않게 글꼴을 먼저 받습니다.
// (느린 네트워크에서도 화면이 너무 늦게 뜨지 않게 1.5초까지만 기다림)
const fontReady = Promise.race([
  document.fonts.load('400 16px "Noto Sans KR Variable"', '야차철학'),
  new Promise((resolve) => setTimeout(resolve, 1500)),
]).catch(() => undefined)

// 일반 페이지는 로그인 복구와 글꼴 준비가 끝난 뒤 표시합니다.
Promise.allSettled([authReady, fontReady]).then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>,
  )
})
