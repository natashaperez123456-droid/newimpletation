import Link from "next/link";
import { NavLink } from "./NavLink";

export const NavLinks = ({ channel }: { channel: string }) => {
	const manuItems = [
		{ id: "coloring-pages", name: "Coloring Pages", href: "/products" },
		{ id: "about-us", name: "About Us", href: "/pages/about-us" },
		{ id: "kids", name: "Kids", href: "/categories/kids" },
		{ id: "adults", name: "Adults", href: "/categories/adults" },
	];

	return (
		<>
			{manuItems.map((item) => (
				<NavLink key={item.id} href={item.href}>
					<span className="uppercase tracking-widest">{item.name}</span>
				</NavLink>
			))}
		</>
	);
};
