import fs from 'node:fs';
import path from 'node:path';
import { parseFrontmatter } from '../lib/blog';

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts');

function readFileContent(filePath: string) {
  return fs.readFileSync(filePath, 'utf-8');
}

function ensureDirectoryExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function organisePost(filePath: string) {
  try {
    const content = readFileContent(filePath);
    const { metadata } = parseFrontmatter(content);

    if (!metadata.date) {
      console.warn(`No date found for ${filePath}`);
      return;
    }

    const date = new Date(metadata.date);
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');

    const targetDir = path.join(POSTS_DIR, year, month);
    ensureDirectoryExists(targetDir);

    const fileName = path.basename(filePath);
    const targetPath = path.join(targetDir, fileName);

    if (filePath !== targetPath) {
      fs.renameSync(filePath, targetPath);
      console.log(`Moved ${fileName} to ${path.join(year, month, fileName)}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

function organisePosts() {
  const files = fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith('.md') || file.endsWith('.mdx'))
    .map((file) => path.join(POSTS_DIR, file));

  files.forEach(organisePost);
}

organisePosts();
