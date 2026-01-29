import { notFound } from "next/navigation";
import { ProductList } from "@/ui/components/ProductList";
import { getLocalProducts } from "@/lib/products";
import { type Metadata } from "next";

export async function generateMetadata({
	params,
}: {
	params: { slug: string };
}): Promise<Metadata> {
	const categoryName =
		typeof params?.slug === "string" ? params.slug.charAt(0).toUpperCase() + params.slug.slice(1) : "";

	return {
		title: `Coloring Pages for ${categoryName}`,
	};
}

export default async function Page(props: { params: Promise<{ slug: string; channel: string }> }) {
	const params = await props.params;
	const slug = typeof params?.slug === "string" ? params.slug : "";

	// Filtrar productos locales por slug de categoría (kids o adults)
	const allProducts = getLocalProducts();
	const products = allProducts.filter((p) => p.category?.name.toLowerCase() === slug.toLowerCase());

	if (products.length === 0 && slug !== "kids" && slug !== "adults") {
		notFound();
	}

	const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);

	return (
		<div className="mx-auto max-w-7xl px-8 pb-16">
			<div className="flex flex-col py-10">
				<h1 className="font-display text-4xl font-bold tracking-tight text-[color:var(--ink)]">
					Coloring Pages for {categoryName}
				</h1>
			</div>
			<ProductList products={products as any} />
		</div>
	);
}
