import { notFound } from "next/navigation";
import { ProductList } from "@/ui/components/ProductList";
import { getLocalProducts } from "@/lib/products";

export default async function Page(props: { params: Promise<{ slug: string; channel: string }> }) {
	const params = await props.params;

	// Para colecciones, por ahora mostramos todos los productos
	// ya que el sitio es pequeño y "featured-products" es la colección principal
	const products = getLocalProducts();

	if (params.slug !== "featured-products") {
		notFound();
	}

	return (
		<div className="mx-auto max-w-7xl px-8 pb-16">
			<div className="flex flex-col py-10">
				<h1 className="font-display text-4xl font-bold tracking-tight text-[color:var(--ink)]">
					Featured Coloring Books
				</h1>
			</div>
			<ProductList products={products as any} />
		</div>
	);
}
