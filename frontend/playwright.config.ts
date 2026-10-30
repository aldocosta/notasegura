import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./e2e",
  use: { baseURL: "http://localhost:3005" },
  webServer: {
    command: "npx next dev -p 3005",
    url: "http://localhost:3005",
    reuseExistingServer: true,
    env: {
      NEXT_PUBLIC_SITE_URL: "https://notasegura.example",
      NEXT_PUBLIC_ADSENSE_CLIENT: "ca-pub-1234567890123456",
      NEXT_PUBLIC_CONTACT_EMAIL: "contato@example.com",
    },
  },
});
