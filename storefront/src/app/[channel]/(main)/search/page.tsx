import { getLocalProducts } from "@/lib/products";
import { ProductList } from "@/ui/components/ProductList";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ query: string }> }) {
	const { query } = await searchParams;
	const allProducts = getLocalProducts();

	// Filtro simple insensible a mayúsculas
	const products = query ? allProducts.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())) : [];

	return (
		<div className="mx-auto max-w-7xl px-8 pb-16">
			<h1 className="font-display my-10 text-4xl font-bold text-[color:var(--ink)]">
				Search results for "{query}"
			</h1>
			{products.length > 0 ? (
				<ProductList products={products as any} />
			) : (
				<p className="text-lg text-neutral-500">No products found matching your search.</p>
			)}
		</div>
	);
}
