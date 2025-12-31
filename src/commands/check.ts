import { defineCommand, option } from "@bunli/core";
import { existsSync, statSync } from "fs";
import { resolve } from "path";
import { z } from "zod";

export default defineCommand({
  name: "check",
  description: "Check system files",
  options: {
    path: option(z.string().optional(), {
      description: "Directory path to check",
      short: "p",
    }),
    verbose: option(z.coerce.boolean().default(false), {
      description: "Show detailed information",
      short: "v",
    }),
    json: option(z.coerce.boolean().default(false), {
      description: "Output as JSON",
    }),
  },
  handler: async ({ flags }) => {
    const targetPath = flags.path ? resolve(flags.path) : process.cwd();

    const commonPaths = [
      ".gitignore",
      "package.json",
      "tsconfig.json",
      "README.md",
      "src",
      "dist",
      "node_modules",
      ".env",
      ".env.local",
    ];

    const pathsToCheck = flags.path
      ? [targetPath]
      : commonPaths.map((p) => resolve(targetPath, p));

    const results = [];

    for (const checkPath of pathsToCheck) {
      const exists = existsSync(checkPath);
      const info: Record<string, unknown> = {
        path: checkPath,
        exists,
      };

      if (exists) {
        const stat = statSync(checkPath);
        info.type = stat.isDirectory()
          ? "directory"
          : stat.isSymbolicLink()
            ? "symlink"
            : "file";
        info.size = stat.size;
        info.permissions = `0${(stat.mode & parseInt("777", 8)).toString(8)}`;
      }

      results.push(info);
    }

    if (flags.json) {
      console.log(JSON.stringify(results, null, 2));
    } else {
      console.log("\nSystem File Check Results:");
      console.log("-".repeat(60));

      for (const file of results) {
        const status = file.exists ? "OK" : "MISSING";
        console.log(`[${status}] ${file.path}`);

        if (file.exists && flags.verbose) {
          console.log(`      Type: ${file.type}`);
          if (file.size !== undefined) {
            console.log(`      Size: ${formatBytes(file.size as number)}`);
          }
          if (file.permissions) {
            console.log(`      Permissions: ${file.permissions}`);
          }
        }
      }

      console.log("-".repeat(60));
      const existCount = results.filter((f) => f.exists).length;
      console.log(`\nSummary: ${existCount}/${results.length} files exist\n`);
    }
  },
});

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  );
}
