import { defineConfig } from "cypress";
import viteConfig from "./vite.config";

export default defineConfig({
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
      viteConfig: viteConfig,
    },
    specPattern: "src/test/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/component.ts",
    viewportWidth: 1280,
    viewportHeight: 720,
    setupNodeEvents(on, config) {
      on("task", {
        log(message) {
          console.log(message);
          return null;
        },
      });
      return config;
    },
  },
  e2e: {
    baseUrl: "http://localhost:5173",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.ts",
    viewportWidth: 1280,
    viewportHeight: 720,
    setupNodeEvents(on, config) {
      on("task", {
        log(message) {
          console.log(message);
          return null;
        },
      });
      return config;
    },
  },
  video: false,
  screenshotOnRunFailure: true,
});
