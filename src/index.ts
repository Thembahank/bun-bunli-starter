#!/usr/bin/env bun

import { createCLI } from "@bunli/core";

const cli = createCLI({
  name: "syschk",
  version: "1.0.0",
  description: "System file checker CLI",
});

cli.run();
