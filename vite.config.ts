import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, loadEnv } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  const { VITE_API_BASE_URL: apiTarget } = loadEnv(
    mode,
    process.cwd(),
    "VITE_API_BASE_URL",
  );

  return {
    server: {
      proxy: apiTarget
        ? {
            "/api": {
              target: apiTarget,
              changeOrigin: true,
              cookieDomainRewrite: "",
              configure(proxy) {
                proxy.on("proxyRes", (response) => {
                  const cookies = response.headers["set-cookie"];
                  if (!cookies) return;

                  // HTTP 개발 서버용 쿠키 속성만 조정합니다. 운영 API 쿠키는 그대로 둡니다.
                  response.headers["set-cookie"] = cookies.map((cookie) =>
                    cookie
                      .replace(/;\s*Secure\b/gi, "")
                      .replace(/;\s*SameSite=None\b/gi, "; SameSite=Lax"),
                  );
                });
              },
            },
            "/ws": {
              target: apiTarget,
              changeOrigin: true,
              ws: true,
            },
          }
        : undefined,
    },
    plugins: [
      react(),
      tailwindcss(),

      VitePWA({
        // 새 버전이 배포되면 안내 없이 바로 적용 (예전 버전이 남아 있지 않게)
        registerType: "autoUpdate",

        // PWA 앱 정보 설정
        manifest: {
          name: "야차철학",
          short_name: "야차철학",
          description: "철학을 게임처럼 즐기는 실시간 토론 서비스",

          start_url: "/",
          scope: "/",
          display: "standalone",

          theme_color: "#0c0c0c",
          background_color: "#0c0c0c",

          // 배경색이 모서리까지 꽉 찬 정사각형 아이콘 (투명한 모서리가 있으면 흰 여백이 생김)
          // maskable: 안드로이드가 원 · 둥근 사각형으로 잘라도 로고가 안 잘리게 로고를 작게 둔 아이콘
          icons: [
            {
              src: "/icons/icon-192.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "/icons/icon-512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "/icons/maskable-512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "maskable",
            },
          ],
        },
      }),
    ],
  };
});
