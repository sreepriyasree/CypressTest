const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || "https://middleware.demo.dhiway.net/v1/", // ✅ Updated URL
    setupNodeEvents(on, config) {
      // Implement node event listeners here
    },
  },
});
