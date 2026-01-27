"use client";

import clsx from "clsx";
import { type ReactElement } from "react";
import { LinkWithChannel } from "@/ui/atoms/LinkWithChannel";
import useSelectedPathname from "@/hooks/useSelectedPathname";

export function NavLink({ href, children }: { href: string; children: ReactElement | string }) {
	const pathname = useSelectedPathname();
	const isActive = pathname === href;

	return (
		<li className="inline-flex">
			<LinkWithChannel
				href={href}
				className={clsx(
					isActive
						? "border-[#d30f7a] text-[#d30f7a]"
						: "border-transparent text-[color:var(--moss)]",
					"inline-flex items-center border-b-2 pt-px text-[12px] font-bold uppercase tracking-[0.22em] transition-colors hover:text-[#d30f7a]",
				)}
			>
				{children}
			</LinkWithChannel>
		</li>
	);
}
