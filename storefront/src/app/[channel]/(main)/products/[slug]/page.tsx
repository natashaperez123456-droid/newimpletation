import edjsHTML from "editorjs-html";
import { notFound } from "next/navigation";
import { type ResolvingMetadata, type Metadata } from "next";
import xss from "xss";
import { type WithContext, type Product } from "schema-dts";
import { DownloadSection } from "./DownloadSection";
import { ProductImageWrapper } from "@/ui/atoms/ProductImageWrapper";
import { ProductPreviewGallery } from "@/ui/components/ProductPreviewGallery";
import { formatMoney } from "@/lib/utils";
import { getLocalProductBySlug, getLocalProducts } from "@/lib/products";
import { getProductCoverUrl } from "@/lib/productCoverMap";
import { getPreviewCount } from "@/lib/productPreviewMap";

export const dynamic = "force-dynamic";

export async function generateMetadata(
	props: {
		params: Promise<{ slug: string; channel: string }>;
		searchParams: Promise<{ variant?: string }>;
	},
	parent: ResolvingMetadata,
): Promise<Metadata> {
	const params = await props.params;
	const product = getLocalProductBySlug(decodeURIComponent(params.slug));

	if (!product) {
		notFound();
	}

	const productName = product.seoTitle || product.name;

	return {
		title: `${product.name} | ${product.seoTitle || (await parent).title?.absolute}`,
		description: product.seoDescription || productName,
		alternates: {
			canonical: process.env.NEXT_PUBLIC_STOREFRONT_URL
				? process.env.NEXT_PUBLIC_STOREFRONT_URL + `/products/${encodeURIComponent(params.slug)}`
				: undefined,
		},
		openGraph: {
			images: [
				{
					url: getProductCoverUrl(product.id),
					alt: product.name,
				},
			],
		},
	};
}

export async function generateStaticParams() {
	const products = getLocalProducts();
	return products.map((product) => ({ slug: product.slug }));
}

const parser = edjsHTML();

export default async function Page(props: {
	params: Promise<{ slug: string; channel: string }>;
	searchParams: Promise<{ variant?: string }>;
}) {
	const [searchParams, params] = await Promise.all([props.searchParams, props.params]);
	const product = getLocalProductBySlug(decodeURIComponent(params.slug));

	if (!product) {
		notFound();
	}

	const description = product?.description ? parser.parse(product.description) : null;

	const variants = product.variants;
	const selectedVariantID = searchParams.variant || variants?.[0]?.id;

	// En el JSON no guardamos quantityAvailable por ahora, asumimos true para digital
	const isAvailable = true;

	const price = "$0.00"; // Todo es gratis

	const productJsonLd: WithContext<Product> = {
		"@context": "https://schema.org",
		"@type": "Product",
		image: getProductCoverUrl(product.id),
		name: product.name,
		description: product.seoDescription || product.name,
	};

	return (
		<section className="mx-auto grid max-w-7xl px-6 pb-16 pt-10 lg:px-8">
			<script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(productJsonLd),
				}}
			/>
			<div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
				<div className="space-y-5">
					<div className="mx-auto max-w-[55%] rounded-[32px] border border-black/5 bg-white p-0 shadow-[0_24px_60px_rgba(15,12,8,0.12)] lg:max-w-full">
						<div className="w-full">
							<ProductImageWrapper
								priority={true}
								alt={product.name ?? ""}
								width={720}
								height={720}
								src={getProductCoverUrl(product.id)}
							/>
						</div>
					</div>
					<ProductPreviewGallery slug={product.slug} count={getPreviewCount(product.slug)} />
					<div className="flex flex-wrap justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-white lg:justify-start">
						<span className="rounded-full border border-transparent bg-[#d93025] px-3 py-1">PDF</span>
						<span className="rounded-full border border-transparent bg-[#f59e0b] px-3 py-1">
							High Quality
						</span>
						<span className="rounded-full border border-transparent bg-emerald-700 px-3 py-1">Kid safe</span>
					</div>
				</div>
				<div className="flex flex-col gap-6">
					<div>
						<p className="text-xs font-semibold uppercase tracking-[0.35em] text-[color:var(--moss)]">
							Featured coloring book
						</p>
						<h1 className="font-display mt-4 text-4xl font-semibold tracking-tight text-[color:var(--ink)]">
							{product?.name}
						</h1>
						<p className="mt-3 text-xs uppercase tracking-[0.25em] text-[color:var(--moss)]">
							Instant download
						</p>
					</div>
					<div className="rounded-3xl border border-black/10 bg-white p-6 shadow-[0_24px_50px_rgba(15,12,8,0.12)]">
						<p
							className="font-display mt-3 text-4xl text-[color:var(--ink)]"
							data-testid="ProductElement_Price"
						>
							{price}
						</p>
						<div className="mt-6">
							<DownloadSection
								variantId={selectedVariantID}
								productSlug={product.slug}
								disabled={!selectedVariantID}
							/>
						</div>
					</div>
					{description && (
						<div className="space-y-6 text-sm text-[color:var(--moss)]">
							{description.map((content, index) => (
								<div key={index} dangerouslySetInnerHTML={{ __html: xss(content) }} />
							))}
						</div>
					)}
				</div>
			</div>
		</section>
	);
}
