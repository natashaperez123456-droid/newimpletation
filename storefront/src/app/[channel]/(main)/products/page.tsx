import { getLocalProducts } from "@/lib/products";
import { ProductList } from "@/ui/components/ProductList";

export const metadata = {
	title: "All Products · Tiny Tales & Bright Color",
	description: "Browse our collection of free printable coloring pages.",
};

export default function Page() {
	const products = getLocalProducts();

	return (
		<section className="mx-auto max-w-7xl px-8 py-12">
			<h1 className="font-display mb-12 text-3xl font-semibold tracking-tight text-[color:var(--ink)] md:text-5xl">
				All Coloring Pages
			</h1>
			<ProductList products={products as any} />
		</section>
	);
}
