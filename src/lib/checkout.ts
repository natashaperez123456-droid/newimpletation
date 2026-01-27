import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { nanoid } from "nanoid";

export async function getIdFromCookies(channel: string) {
	const cookieName = `checkoutId-${channel}`;
	const checkoutId = (await cookies()).get(cookieName)?.value || "";
	return checkoutId;
}

export async function saveIdToCookie(channel: string, checkoutId: string) {
	const shouldUseHttps =
		process.env.NEXT_PUBLIC_STOREFRONT_URL?.startsWith("https") || !!process.env.NEXT_PUBLIC_VERCEL_URL;
	const cookieName = `checkoutId-${channel}`;
	(await cookies()).set(cookieName, checkoutId, {
		sameSite: "lax",
		secure: shouldUseHttps,
	});
}

export async function find(checkoutId: string) {
	if (!checkoutId) return null;
	const stmt = db.prepare("SELECT * FROM checkout WHERE id = ?");
	const checkout = stmt.get(checkoutId) as any;

	if (!checkout) return null;

	// Fetch lines
	const linesStmt = db.prepare(`
		SELECT cl.*, v.name as variantName, p.name as productName, p.slug as productSlug, p.priceAmount as price
		FROM checkout_lines cl
		JOIN variants v ON cl.variant_id = v.id
		JOIN products p ON v.product_id = p.id
		WHERE cl.checkout_id = ?
	`);
	const lines = linesStmt.all(checkoutId);

	// Format to match previous GraphQL shape roughly
	return {
		...checkout,
		lines: lines.map((line: any) => ({
			id: line.id,
			quantity: line.quantity,
			variant: {
				id: line.variant_id,
				name: line.variantName,
				product: {
					name: line.productName,
					slug: line.productSlug,
				},
			},
			totalPrice: {
				gross: {
					amount: line.price * line.quantity,
					currency: "USD",
				},
			},
		})),
		totalPrice: {
			gross: {
				amount: checkout.total_amount,
				currency: "USD",
			},
		},
	};
}

export async function findOrCreate({ channel, checkoutId }: { checkoutId?: string; channel: string }) {
	if (checkoutId) {
		const checkout = await find(checkoutId);
		if (checkout) return checkout;
	}
	return await create({ channel });
}

export const create = async ({ channel }: { channel: string }) => {
	const newId = nanoid();
	const stmt = db.prepare("INSERT INTO checkout (id, created_at) VALUES (?, CURRENT_TIMESTAMP)");
	stmt.run(newId);
	return find(newId);
};
