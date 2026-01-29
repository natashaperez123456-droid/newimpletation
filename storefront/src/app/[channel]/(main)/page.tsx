import Link from "next/link";
import { getLocalProducts } from "@/lib/products";
import { getProductCoverUrl } from "@/lib/productCoverMap";
import { ProductList } from "@/ui/components/ProductList";

export const metadata = {
	title: "Tiny and Bright Color",
	description: "Free printable coloring pages for kids and adults. Download high-quality PDFs and PNGs for home printing.",
};

export default async function Page(props: { params: Promise<{ channel: string }> }) {
	const params = await props.params;

	// Obtener productos desde el archivo local en lugar de Saleor
	const products = getLocalProducts();

	// Simular "Featured Products" (por ejemplo, los primeros 3)
	const heroProducts = products.slice(0, 3);

	// Menú estático simple
	// const themeLinks = [
	// 	{ id: "1", label: "For Kids", href: `/${params.channel}/categories/kids` },
	// 	{ id: "2", label: "For Adults", href: `/${params.channel}/categories/adults` },
	// ];

	return (
		<section className="mx-auto max-w-7xl px-6 pb-20 pt-10 lg:px-8">
			<div className="relative overflow-hidden rounded-[36px] border border-black/5 bg-[color:var(--chalk)] p-8 shadow-[0_30px_70px_rgba(15,12,8,0.12)] md:p-12">
				<div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#f6d7b3] opacity-70 blur-3xl" />
				<div className="absolute -left-20 bottom-[-120px] h-80 w-80 rounded-full bg-[#b7d8c8] opacity-60 blur-3xl" />
				<div className="relative grid gap-10 md:grid-cols-[1.15fr_0.85fr] md:items-center">
					<div>
						<p className="text-xs font-semibold uppercase tracking-[0.35em] text-[color:var(--moss)]">
							Coloring books
						</p>
						<h1 className="font-display mt-4 text-4xl font-semibold leading-tight text-[color:var(--ink)] md:text-5xl">
							Color, print, and replay the joy. Every PDF is ready for kids to get stared coloring pages.
						</h1>
						<p className="mt-4 text-sm text-[color:var(--moss)] md:text-base">
							Instant download for coloring at home. High-quality PDFs ready for your printer, 100% free.
						</p>
						<div className="mt-8 flex flex-wrap gap-3">
							<Link
								href={`/${params.channel}/products`}
								className="rounded-full bg-[color:var(--ink)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--sand)] transition-transform hover:-translate-y-0.5"
							>
								Browse PDFs
							</Link>
						</div>
						<div className="mt-6 flex flex-wrap gap-4 text-xs uppercase tracking-[0.22em] text-[color:var(--moss)]">
							<span>PDF instant</span>
							<span>Kid safe</span>
						</div>
					</div>
					<div className="relative grid grid-cols-3 gap-4">
						{heroProducts.map((product, index) => (
							<div
								key={product.id}
								className={`rounded-3xl border border-black/10 bg-white p-2 shadow-[0_18px_35px_rgba(15,12,8,0.14)] ${
									index === 1 ? "float-fast -translate-y-4" : "float-slow"
								}`}
							>
								<img
									src={getProductCoverUrl(product.id)}
									alt={product.name}
									className="h-full w-full rounded-2xl object-contain"
								/>
							</div>
						))}
					</div>
				</div>
			</div>

			<div className="mt-10 grid gap-6 md:grid-cols-3">
				<div className="rounded-3xl border border-black/5 bg-white p-6 shadow-[0_18px_40px_rgba(15,12,8,0.08)]">
					<p className="text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--moss)]">
						Instant
					</p>
					<p className="font-display mt-3 text-2xl text-[color:var(--ink)]">Download in minutes</p>
					<p className="mt-2 text-sm text-[color:var(--moss)]">
						Get access to high-res PDFs that you can print cleanly at home instantly.
					</p>
				</div>
				<div className="rounded-3xl border border-black/5 bg-white p-6 shadow-[0_18px_40px_rgba(15,12,8,0.08)]">
					<p className="text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--moss)]">Free</p>
					<p className="font-display mt-3 text-2xl text-[color:var(--ink)]">No cost, no fees</p>
					<p className="mt-2 text-sm text-[color:var(--moss)]">
						Every coloring page is 100% free to download and print for personal use.
					</p>
				</div>
				<div className="rounded-3xl border border-black/5 bg-white p-6 shadow-[0_18px_40px_rgba(15,12,8,0.08)]">
					<p className="text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--moss)]">Play</p>
					<p className="font-display mt-3 text-2xl text-[color:var(--ink)]">Made for kids</p>
					<p className="mt-2 text-sm text-[color:var(--moss)]">
						Clean outlines, bold shapes, and plenty of space for coloring fun.
					</p>
				</div>
			</div>

			{/* {themeLinks.length > 0 && (
				<div className="mt-12">
					<div className="flex flex-wrap gap-3">
						{themeLinks.slice(0, 8).map((item) => (
							<Link
								key={item.id}
								href={item.href}
								className="rounded-full border border-black/10 bg-white px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-[color:var(--ink)]"
							>
								{item.label}
							</Link>
						))}
					</div>
				</div>
			)} */}
			<h2 className="sr-only">Product list</h2>
			<div className="mt-16">
				{/* Pasamos los productos locales al componente de lista */}
				{/* NOTA: ProductList espera un fragmento de Saleor, pero como nuestro JSON tiene la misma estructura, funcionará */}
				<ProductList products={products as any} />
			</div>
		</section>
	);
}
