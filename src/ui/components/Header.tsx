import { Logo } from "./Logo";
import { Nav } from "./nav/Nav";

export function Header({ channel }: { channel: string }) {
	return (
		<header className="sticky top-0 z-20 border-b border-black/5 bg-[rgba(251,247,240,0.88)] backdrop-blur-xl">
			<div className="border-b border-black/10 bg-[#1a1712] text-[#f4efe6]">
				<div className="mx-auto flex max-w-7xl overflow-hidden px-4 py-2 text-[10px] uppercase tracking-[0.3em] sm:px-8">
					<div className="promo-track">
						<span>Tiny Tales & Bright Color</span>
						<span>Pages Made for Kids</span>
						<span>Pages Made for Adults</span>
						<span>Tiny Tales & Bright Color</span>
						<span>Pages Made for Kids</span>
						<span>Pages Made for Adults</span>
					</div>
				</div>
			</div>
			<div className="mx-auto max-w-7xl px-4 sm:px-8">
				<div className="flex h-16 items-center justify-between gap-4 md:h-20 md:gap-8">
					<Logo />
					<Nav channel={channel} />
				</div>
			</div>
		</header>
	);
}
