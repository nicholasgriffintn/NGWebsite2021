import { defineConfig } from "drizzle-kit";
import type { Config } from "drizzle-kit";

const localDatabase = {
	schema: "./lib/db/schema.ts",
	out: "./migrations",
	dialect: "sqlite",
	dbCredentials: {
		url: process.env.DB_LOCAL_PATH || "",
	},
} satisfies Config;

const prodDatabase = {
	schema: "./lib/db/schema.ts",
	out: "./migrations",
	dialect: "sqlite",
	driver: "d1-http",
	dbCredentials: {
		accountId: process.env.CLOUDFLARE_ACCOUNT_ID || "",
		databaseId: process.env.CLOUDFLARE_DATABASE_ID || "",
		token: process.env.CLOUDFLARE_D1_TOKEN || "",
	},
} satisfies Config;

export default defineConfig(
	process.env.NODE_ENV === "production" ? prodDatabase : localDatabase,
);
