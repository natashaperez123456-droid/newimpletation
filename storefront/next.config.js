/** @type {import('next').NextConfig} */

// Detectamos si estamos en desarrollo
const isDev = process.env.NODE_ENV !== "production";

const config = {
	images: {
		unoptimized: isDev,

		remotePatterns: [
			{
				protocol: "https",
				hostname: "coloring-images.tinyandbrightcolor.site",
				port: "",
				pathname: "/**",
			},
		],
	},
	typescript: {
		ignoreBuildErrors: true,
	},
	// eslint: {
	// 	ignoreDuringBuilds: true,
	// },
	// ... el resto de tu configuración
	async headers() {
		return [
			{
				source: "/(.*)",
				headers: [
					{
						key: "X-DNS-Prefetch-Control",
						value: "on",
					},
					{
						key: "Strict-Transport-Security",
						value: "max-age=63072000; includeSubDomains; preload",
					},
					{
						key: "X-XSS-Protection",
						value: "1; mode=block",
					},
					{
						key: "X-Frame-Options",
						value: "SAMEORIGIN",
					},
					{
						key: "X-Content-Type-Options",
						value: "nosniff",
					},
					{
						key: "Referrer-Policy",
						value: "origin-when-cross-origin",
					},
				],
			},
		];
	},
	typedRoutes: false,
	output:
		process.env.NEXT_OUTPUT === "standalone"
			? "standalone"
			: process.env.NEXT_OUTPUT === "export"
				? "export"
				: undefined,
};

export default config;
