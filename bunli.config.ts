import { defineConfig } from "@bunli/core";

export default defineConfig({
  name: "syschk",
  version: "1.0.0",
  description: "System file checker CLI",
  commands: {
    directory: "./src/commands",
  },
});
