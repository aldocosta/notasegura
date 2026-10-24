import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./e2e",
  use: { baseURL: "http://localhost:3005" },
  webServer: {
    command: "npx next dev -p 3005",
    url: "http://localhost:3005",
    reuseExistingServer: true,
  },
});
