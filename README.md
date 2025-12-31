# Bun Bunli Starter

A minimal Bunli CLI starter for checking system files and exploring directory structures.

## Features

- Built with Bunli (minimal CLI framework for Bun)
- Type-safe command definitions with Zod validation
- Two built-in commands: `check` and `structure`
- Fast TypeScript compilation with Bun
- Zero configuration needed

## Installation

```bash
bun install
```

## Usage

### Check Command

Check system files for existence and details:

```bash
bunli dev check
bunli dev check --verbose
bunli dev check --json
bunli dev check --path /some/path
```

Options:
- `--path, -p` - Directory path to check
- `--verbose, -v` - Show detailed information
- `--json` - Output as JSON

### Structure Command

Display directory structure as a tree:

```bash
bunli dev structure
bunli dev structure --depth 2
bunli dev structure --json
bunli dev structure --path /some/path
```

Options:
- `--path, -p` - Directory path to analyze
- `--depth, -d` - Maximum traversal depth (default: 3)
- `--json` - Output as JSON

## Project Structure

```
.
├── src/
│   ├── index.ts              # CLI entry point
│   └── commands/
│       ├── check.ts          # File checking command
│       └── structure.ts      # Directory structure command
├── bunli.config.ts           # Bunli configuration
├── package.json
├── tsconfig.json
└── README.md
```

## Development

```bash
# Run CLI in development mode with hot reload
bun run dev check

# Run tests
bun test

# Build for production
bunli build

# Build for all platforms
bunli build --all
```

## How Commands Work

Commands are defined in `src/commands/` using `defineCommand`:

```typescript
import { defineCommand, option } from "@bunli/core";
import { z } from "zod";

export default defineCommand({
  name: "mycommand",
  description: "Do something",
  options: {
    flag: option(z.string(), {
      description: "A flag",
      short: "f",
    }),
  },
  handler: async ({ flags }) => {
    console.log(flags.flag);
  },
});
```

Bunli automatically discovers and registers all commands in the configured directory.

## Requirements

- Bun 1.0 or later
- Node.js 18+ (optional, for compatibility)

## License

MIT
