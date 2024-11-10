import { sql } from 'drizzle-orm';
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

const timestamps = {
  updated_at: integer({ mode: 'timestamp_ms' }),
  created_at: integer({ mode: 'timestamp_ms' }).default(
    sql`(CURRENT_TIMESTAMP)`
  ),
  deleted_at: integer({ mode: 'timestamp_ms' }),
};

function generateUniqueString(length = 12): string {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let uniqueString = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    uniqueString += characters[randomIndex];
  }
  return uniqueString;
}

export const bookmarks = sqliteTable('bookmarks', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
  slug: text().$default(() => generateUniqueString(16)),
  title: text({ mode: 'text' }),
  description: text({ mode: 'text' }),
  url: text({ mode: 'text' }),
  metadata: text({ mode: 'json' }),
  ...timestamps,
});
