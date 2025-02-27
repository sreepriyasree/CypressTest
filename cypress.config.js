const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {

       baseUrl: process.env.CYPRESS_BASE_URL || "http://localhost:5001"
     
      // implement node event listeners here
    },
  },
});
