import { defineCommand, option } from "@bunli/core";
import { readdirSync, statSync } from "fs";
import { resolve } from "path";
import { z } from "zod";

interface DirNode {
  name: string;
  type: "file" | "directory";
  children?: DirNode[];
}

export default defineCommand({
  name: "structure",
  description: "Show directory structure",
  options: {
    path: option(z.string().optional(), {
      description: "Directory path to analyze",
      short: "p",
    }),
    depth: option(z.coerce.number().default(3), {
      description: "Maximum traversal depth",
      short: "d",
    }),
    json: option(z.coerce.boolean().default(false), {
      description: "Output as JSON",
    }),
  },
  handler: async ({ flags }) => {
    const targetPath = flags.path ? resolve(flags.path) : process.cwd();
    const maxDepth = flags.depth;

    try {
      const structure = buildStructure(targetPath, 0, maxDepth);

      if (flags.json) {
        console.log(JSON.stringify(structure, null, 2));
      } else {
        console.log(`\nDirectory Structure: ${targetPath}\n`);
        printTree(structure, "");
        console.log();
      }
    } catch (error) {
      console.error("Error reading directory:", error);
      process.exit(1);
    }
  },
});

function buildStructure(
  path: string,
  currentDepth: number,
  maxDepth: number
): DirNode {
  const stat = statSync(path);
  const name = path.split("/").pop() || path;
  const node: DirNode = {
    name,
    type: stat.isDirectory() ? "directory" : "file",
  };

  if (stat.isDirectory() && currentDepth < maxDepth) {
    try {
      const entries = readdirSync(path)
        .filter((entry) => !entry.startsWith("."))
        .slice(0, 20);

      node.children = entries.map((entry) =>
        buildStructure(resolve(path, entry), currentDepth + 1, maxDepth)
      );
    } catch {
      // Permission denied or other read errors
    }
  }

  return node;
}

function printTree(node: DirNode, prefix: string, isLast = true): void {
  const connector = isLast ? "└── " : "├── ";
  const type = node.type === "directory" ? "[DIR] " : "[FILE]";
  console.log(`${prefix}${connector}${type}${node.name}`);

  if (node.children && node.children.length > 0) {
    const newPrefix = prefix + (isLast ? "    " : "│   ");
    node.children.forEach((child, index) => {
      printTree(child, newPrefix, index === node.children!.length - 1);
    });
  }
}
