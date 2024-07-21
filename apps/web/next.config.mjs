import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";

if (process.env.NODE_ENV === "development") {
	await setupDevPlatform();
}

/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		deviceSizes: [640, 828, 1200, 1920],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
		formats: ["image/webp"],
	},
};

export default nextConfig;
