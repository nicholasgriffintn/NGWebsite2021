import fs from 'node:fs';
import path from 'node:path';

import type { Metadata } from '@/types/blog';

function parseFrontmatter(fileContent: string) {
  const frontmatterRegex = /---\s*([\s\S]*?)\s*---/;
  const match = frontmatterRegex.exec(fileContent);
  if (!match) {
    throw new Error('No frontmatter block found');
  }

  const frontMatterBlock = match[1];
  const content = fileContent.replace(frontmatterRegex, '').trim();
  const metadata = frontMatterBlock?.split('\n').reduce((acc, line) => {
    const [key, ...valueArr] = line.split(': ');
    if (key) {
      let value: string[] | string = valueArr.join(': ').trim();
      value = value.replace(/^['"](.*)['"]$/, '$1'); // Remove quotes
      if (value.startsWith('[') && value.endsWith(']')) {
        // Parse array values
        value = value
          .slice(1, -1)
          .split(',')
          .map((tag) => tag.trim());
      }
      acc[key.trim()] = value;
    }
    return acc;
  }, {} as Partial<Metadata>);

  return { metadata: metadata as Metadata, content };
}

function getFilesByExtension(dir: string, extensions: string[]) {
  return fs
    .readdirSync(dir)
    .filter((file) => extensions.includes(path.extname(file)));
}

function readFileContent(filePath: string) {
  return fs.readFileSync(filePath, 'utf-8');
}

function getMDXData(dir: string) {
  const mdxFiles = getFilesByExtension(dir, ['.mdx', '.md']);
  return mdxFiles.map((file) => {
    const { metadata, content } = parseFrontmatter(
      readFileContent(path.join(dir, file))
    );
    const slug = path.basename(file, path.extname(file));
    return { metadata, slug, content };
  });
}

export function getBlogPosts() {
  const posts = getMDXData(path.join(process.cwd(), 'content', 'posts')).filter(
    (post) => {
      if (process.env.NEXT_PUBLIC_ENVIROMENT !== 'development') {
        return !post.metadata.draft;
      }
      return true;
    }
  );
  return posts.sort(
    (a, b) =>
      new Date(b.metadata.date).getTime() - new Date(a.metadata.date).getTime()
  );
}

export function getAllTags() {
  const posts = getBlogPosts();
  const tagCounts = posts.reduce((acc, post) => {
    if (Array.isArray(post.metadata.tags)) {
      post.metadata.tags.forEach((tag) => {
        if (acc[tag]) {
          acc[tag]++;
        } else {
          acc[tag] = 1;
        }
      });
    }
    return acc;
  }, {} as Record<string, number>);

  return tagCounts;
}

export function getBlogPostsByTag(tag: string) {
  const posts = getBlogPosts();
  return posts.filter((post) => post.metadata.tags?.includes(tag));
}

export function formatDate(date: string, includeRelative = false) {
  const currentDate = new Date();
  const targetDate = new Date(date.includes('T') ? date : `${date}T00:00:00`);
  const diffTime = currentDate.getTime() - targetDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffMonths =
    currentDate.getMonth() -
    targetDate.getMonth() +
    12 * (currentDate.getFullYear() - targetDate.getFullYear());
  const diffYears = currentDate.getFullYear() - targetDate.getFullYear();

  let formattedDate = '';
  if (diffYears > 0) {
    formattedDate = `${diffYears}y ago`;
  } else if (diffMonths > 0) {
    formattedDate = `${diffMonths}mo ago`;
  } else if (diffDays > 0) {
    formattedDate = `${diffDays}d ago`;
  } else {
    formattedDate = 'Today';
  }

  const fullDate = targetDate.toLocaleString('en-gb', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return includeRelative ? `${fullDate} (${formattedDate})` : fullDate;
}
