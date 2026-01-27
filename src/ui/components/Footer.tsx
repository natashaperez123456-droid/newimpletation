import Link from "next/link";
import { LinkWithChannel } from "../atoms/LinkWithChannel";

export async function Footer({ channel }: { channel: string }) {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="border-t border-black/10 bg-[color:var(--chalk)]">
			<div className="mx-auto max-w-7xl px-6 lg:px-8">
				<div className="grid grid-cols-1 gap-10 py-16 md:grid-cols-4">
					{/* Column 1: Identity */}
					<div className="flex flex-col gap-4">
						<LinkWithChannel href="/">
							<span className="font-display text-xl font-bold text-[color:var(--ink)]">
								Tiny Tales & Bright Color
							</span>
						</LinkWithChannel>
						<p className="text-sm text-[color:var(--moss)]">
							Free printable coloring pages for creative minds.
						</p>
					</div>

					{/* Column 2: Explore */}
					<div>
						<h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--ink)]">
							Explore
						</h3>
						<ul className="mt-4 space-y-3 text-sm text-[color:var(--moss)]">
							<li>
								<LinkWithChannel href="/products">Coloring Pages</LinkWithChannel>
							</li>
							<li>
								<LinkWithChannel href="/categories/kids">For Kids</LinkWithChannel>
							</li>
							<li>
								<LinkWithChannel href="/categories/adults">For Adults</LinkWithChannel>
							</li>
							<li>
								<LinkWithChannel href="/collections/featured-products">Featured</LinkWithChannel>
							</li>
						</ul>
					</div>

					{/* Column 3: Help */}
					<div>
						<h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--ink)]">Help</h3>
						<ul className="mt-4 space-y-3 text-sm text-[color:var(--moss)]">
							<li>
								<LinkWithChannel href="/pages/about-us">About Us</LinkWithChannel>
							</li>
							<li>
								<LinkWithChannel href="/pages/about-us#faq">FAQ</LinkWithChannel>
							</li>
						</ul>
					</div>

					{/* Column 4: Legal */}
					<div>
						<h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--ink)]">
							Legal
						</h3>
						<ul className="mt-4 space-y-3 text-sm text-[color:var(--moss)]">
							<li>
								<LinkWithChannel href="/pages/terms-of-use">Terms of Use</LinkWithChannel>
							</li>
							<li>
								<LinkWithChannel href="/pages/privacy-policy">Privacy Policy</LinkWithChannel>
							</li>
						</ul>
					</div>
				</div>

				<div className="flex flex-col justify-between border-t border-black/10 py-10 text-sm text-[color:var(--moss)] sm:flex-row">
					<p>© {currentYear} Tiny Tales & Bright Color. All rights reserved.</p>
				</div>
			</div>
		</footer>
	);
}
