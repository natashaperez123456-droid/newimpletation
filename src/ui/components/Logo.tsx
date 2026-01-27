"use client";

import { usePathname } from "next/navigation";
import { LinkWithChannel } from "../atoms/LinkWithChannel";

const companyName = "Tiny Tales & Bright Color";

export const Logo = () => {
	const pathname = usePathname();

	if (pathname === "/") {
		return (
			<h1 className="font-display flex items-center text-lg font-semibold tracking-[0.4em] text-[color:var(--ink)]">
				{companyName}
			</h1>
		);
	}
	return (
		<div className="font-display flex items-center text-lg font-semibold tracking-[0.4em] text-[color:var(--ink)]">
			<LinkWithChannel aria-label="homepage" href="/">
				{companyName}
			</LinkWithChannel>
		</div>
	);
};
