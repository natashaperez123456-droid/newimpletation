import { Suspense } from "react";
import { UserMenuContainer } from "./components/UserMenu/UserMenuContainer";
import { CartNavItem } from "./components/CartNavItem";
import { NavLinks } from "./components/NavLinks";
import { MobileMenu } from "./components/MobileMenu";
import { SearchBar } from "./components/SearchBar";

export const Nav = ({ channel }: { channel: string }) => {
	return (
		<nav className="flex w-full items-center gap-4 lg:gap-6" aria-label="Main navigation">
			<ul className="hidden flex-1 justify-center gap-8 overflow-x-auto whitespace-nowrap md:flex lg:px-0">
				<NavLinks channel={channel} />
			</ul>
			<div className="ml-auto flex items-center justify-center gap-4 whitespace-nowrap lg:gap-6">
				<div className="hidden w-64 lg:block xl:w-96">
					<SearchBar channel={channel} />
				</div>
				<Suspense fallback={<div className="w-8" />}>
					<UserMenuContainer />
				</Suspense>
				{/* <Suspense fallback={<div className="w-6" />}>
					<CartNavItem channel={channel} />
				</Suspense> */}
			</div>
			<Suspense>
				<MobileMenu>
					<SearchBar channel={channel} />
					<NavLinks channel={channel} />
				</MobileMenu>
			</Suspense>
		</nav>
	);
};
