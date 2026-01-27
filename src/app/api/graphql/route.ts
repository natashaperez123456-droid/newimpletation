import { NextResponse } from "next/server";
import * as CheckoutLib from "@/lib/checkout";

export async function POST(req: Request) {
	const body = await req.json();
	const { operationName, variables } = body;

	console.log("GraphQL Proxy:", operationName, variables);

	if (operationName === "checkout") {
		const checkout = await CheckoutLib.find(variables.id);
		return NextResponse.json({
			data: {
				checkout: checkout,
			},
		});
	}

	if (operationName === "checkoutCreate") {
		const checkout = await CheckoutLib.create({ channel: variables.channel });
		return NextResponse.json({
			data: {
				checkoutCreate: {
					checkout,
					errors: [],
				},
			},
		});
	}

	// Default fallback
	return NextResponse.json({ data: {} });
}
