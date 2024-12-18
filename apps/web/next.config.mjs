import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
	transpilePackages: ["next-mdx-remote"],
	pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
	images: {
		loader: "custom",
		loaderFile: "./lib/imageLoader.ts",
		deviceSizes: [640, 828, 1200, 1920],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
		formats: ["image/webp"],
		remotePatterns: [
			{
				protocol: "https",
				hostname: "lastfm.freetls.fastly.net",
			},
		],
	},
};

const withMDX = createMDX({
	options: {},
});

export default withMDX(nextConfig);
