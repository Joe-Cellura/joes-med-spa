import fs from "fs";
import path from "path";

function readFileSafe(filePath: string): string | null {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return null;
  }
}

function readDirectoryFilesSafe(dirPath: string): { name: string; content: string }[] {
  const results: { name: string; content: string }[] = [];
  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isFile()) continue;
      if (!entry.name.endsWith(".txt")) continue;
      const fullPath = path.join(dirPath, entry.name);
      const content = readFileSafe(fullPath);
      if (!content) continue;
      results.push({ name: entry.name, content });
    }
  } catch {
    // silently ignore directory errors
  }
  return results;
}

export function getKnowledgeBase(): string {
  const baseDir = path.join(process.cwd(), "src", "data", "clients", "aura-skin-laser", "knowledge");
  const sections: string[] = [];

  const topLevelFiles = [
    "clinic-overview.txt",
    "consultation-process.txt",
    "booking-guidance.txt",
    "faq.txt",
    "team.txt",
  ];

  for (const fileName of topLevelFiles) {
    const filePath = path.join(baseDir, fileName);
    const content = readFileSafe(filePath);
    if (!content) continue;
    sections.push(`=== ${fileName.replace(".txt", "")} ===\n${content.trim()}`);
  }

  // Services
  const servicesDir = path.join(baseDir, "services");
  const serviceFiles = readDirectoryFilesSafe(servicesDir);
  for (const file of serviceFiles) {
    const label = `services/${file.name.replace(".txt", "")}`;
    sections.push(`=== ${label} ===\n${file.content.trim()}`);
  }

  // Blog
  const blogDir = path.join(baseDir, "blog");
  const blogFiles = readDirectoryFilesSafe(blogDir);
  for (const file of blogFiles) {
    const label = `blog/${file.name.replace(".txt", "")}`;
    sections.push(`=== ${label} ===\n${file.content.trim()}`);
  }

  return sections.join("\n\n");
}

