import { PlaywrightTestConfig, devices } from "@playwright/test";

const config: PlaywrightTestConfig = {
  webServer: {
    command: "npm run build && npm run preview",
    port: 4173,
  },
  // reporter: "html",
  testDir: "tests",
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    {
      name: "iphone",
      use: {
        ...devices["iPhone 12"],
      },
    },
  ],
};

export default config;
