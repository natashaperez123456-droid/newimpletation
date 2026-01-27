import { type ReactNode } from "react";
import { Header } from "@/ui/components/Header";
import { Footer } from "@/ui/components/Footer";

export default async function Layout({
	children,
	params,
}: {
	children: ReactNode;
	params: Promise<{ channel: string }>;
}) {
	const { channel } = await params;
	return (
		<>
			<Header channel={channel} />
			<div className="flex min-h-[calc(100dvh-64px)] flex-col">
				<main className="flex-1">{children}</main>
				<Footer channel={channel} />
			</div>
		</>
	);
}
