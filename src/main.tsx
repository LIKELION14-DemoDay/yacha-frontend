import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import '@fontsource-variable/noto-sans-kr'
import './index.css'
import App from './App.tsx'
import { restoreLogin } from './apis/auth'

// 새로고침해도 로그인이 유지되도록, 화면을 그리기 전에 토큰 복구를 먼저 시도
restoreLogin().finally(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>,
  )
})
