import { LinkWithChannel } from "../atoms/LinkWithChannel";
import { ProductImageWrapper } from "@/ui/atoms/ProductImageWrapper";

import type { ProductListItemFragment } from "@/gql/graphql";
import { getProductCoverUrl } from "@/lib/productCoverMap";
import { formatMoneyRange } from "@/lib/utils";

export function ProductElement({
	product,
	loading,
	priority,
}: { product: ProductListItemFragment } & { loading: "eager" | "lazy"; priority?: boolean }) {
	return (
		<li data-testid="ProductElement">
			<LinkWithChannel
				href={`/products/${product.slug}`}
				key={product.id}
				className="group block rounded-3xl border border-black/5 bg-[color:var(--chalk)] p-4 shadow-[0_18px_40px_rgba(15,12,8,0.08)] transition-transform duration-300 hover:-translate-y-1"
			>
				<div className="space-y-4">
					{product?.id && (
						<ProductImageWrapper
							loading={loading}
							src={getProductCoverUrl(product.id)}
							alt={product.name ?? ""}
							width={512}
							height={512}
							sizes={"512px"}
							priority={priority}
						/>
					)}
					<div className="flex items-start justify-between gap-6">
						<div>
							<h3 className="font-display text-lg font-semibold text-[color:var(--ink)]">{product.name}</h3>
							{/* <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[color:var(--moss)]" data-testid="ProductElement_Category">
								{product.category?.name}
							</p> */}
							<div className="mt-3 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.2em] text-[color:var(--ink)]">
								<span className="rounded-full border border-black/10 bg-white px-3 py-1">PDF</span>
								<span className="rounded-full border border-black/10 bg-white px-3 py-1">High Quality</span>
							</div>
						</div>
					</div>
				</div>
			</LinkWithChannel>
		</li>
	);
}
