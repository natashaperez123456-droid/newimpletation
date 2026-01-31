import { type MetadataRoute } from "next";
import { getLocalProducts } from "@/lib/products";

export default function sitemap(): MetadataRoute.Sitemap {
	const baseUrl = process.env.NEXT_PUBLIC_STOREFRONT_URL || "https://tinyandbrightcolor.site";

	const products = getLocalProducts();

	// Páginas de productos
	const productPages = products.map((product) => ({
		url: `${baseUrl}/default-channel/products/${encodeURIComponent(product.slug)}`,
		lastModified: new Date(),
		changeFrequency: "weekly" as const,
		priority: 0.8,
	}));

	// Páginas estáticas
	const staticPages = [
		{
			url: baseUrl,
			lastModified: new Date(),
			changeFrequency: "daily" as const,
			priority: 1.0,
		},
		{
			url: `${baseUrl}/default-channel/products`,
			lastModified: new Date(),
			changeFrequency: "daily" as const,
			priority: 0.9,
		},
		{
			url: `${baseUrl}/default-channel/categories/kids`,
			lastModified: new Date(),
			changeFrequency: "weekly" as const,
			priority: 0.8,
		},
		{
			url: `${baseUrl}/default-channel/categories/adults`,
			lastModified: new Date(),
			changeFrequency: "weekly" as const,
			priority: 0.8,
		},
	];

	return [...staticPages, ...productPages];
}
