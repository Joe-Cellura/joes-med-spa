#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const client = process.argv[2];

if (!client) {
  console.error("Usage: node scripts/switch-client.js <client-name>");
  console.error("Example: node scripts/switch-client.js lumina");
  process.exit(1);
}

const root = path.join(__dirname, "..");

function updateFile(relPath, transform) {
  const filePath = path.join(root, relPath);
  const original = fs.readFileSync(filePath, "utf8");
  const updated = transform(original);
  if (updated === original) {
    console.log(`  No change: ${relPath}`);
    return;
  }
  fs.writeFileSync(filePath, updated, "utf8");
  console.log(`  Updated: ${relPath}`);
}

console.log(`Switching to client: ${client}`);

// src/lib/client.ts — update ACTIVE_CLIENT value
updateFile("src/lib/client.ts", (src) =>
  src.replace(
    /^(export const ACTIVE_CLIENT\s*=\s*)"[^"]+"/m,
    `$1"${client}"`
  )
);

// src/lib/knowledge.ts — update the "clients", "<name>", "knowledge" path.join segment
updateFile("src/lib/knowledge.ts", (src) =>
  src.replace(/"clients",\s*"[^"]+",\s*"knowledge"/g, `"clients", "${client}", "knowledge"`)
);

console.log(`Done. Active client is now "${client}".`);
