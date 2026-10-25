import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    VitePWA({
      // 새 버전이 배포되면 사용자에게 업데이트 안내
      registerType: "prompt",

      // PWA 앱 정보 설정
      manifest: {
        name: "야차판",
        short_name: "야차판",
        description: "철학을 게임처럼 즐기는 실시간 토론 서비스",

        start_url: "/",
        scope: "/",
        display: "standalone",

        theme_color: "#111111",
        background_color: "#111111",

        icons: [
          {
            src: "/applogo.png",
            sizes: "200x200",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/applogo.png",
            sizes: "200x200",
            type: "image/png",
            purpose: "any",
          },
        ],
      },
    }),
  ],
});
