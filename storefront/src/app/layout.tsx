import { Fraunces, Manrope } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Suspense, type ReactNode } from "react";
import { type Metadata } from "next";
import { DraftModeNotification } from "@/ui/components/DraftModeNotification";

const display = Fraunces({
	subsets: ["latin"],
	variable: "--font-display",
	weight: ["400", "600", "700"],
});

const sans = Manrope({
	subsets: ["latin"],
	variable: "--font-sans",
	weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
	title: "Saleor Storefront example",
	description: "Starter pack for building performant e-commerce experiences with Saleor.",
	metadataBase: process.env.NEXT_PUBLIC_STOREFRONT_URL
		? new URL(process.env.NEXT_PUBLIC_STOREFRONT_URL)
		: undefined,
	other: {
		"p:domain_verify": "a51ced03c4ed5b76f221a3a3cffa8855",
	},
};

export default function RootLayout(props: { children: ReactNode }) {
	const { children } = props;

	return (
		<html lang="en" className={`${display.variable} ${sans.variable} min-h-dvh`}>
			<body>
				<Script async src="https://www.googletagmanager.com/gtag/js?id=G-G96QGR5HVH" />
				<Script id="google-analytics">
					{`
						window.dataLayer = window.dataLayer || [];
						function gtag(){dataLayer.push(arguments);}
						gtag('js', new Date());

						gtag('config', 'G-G96QGR5HVH');
					`}
				</Script>
				<Script
					src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback"
					async
					defer
				/>
				{children}
				<Suspense>
					<DraftModeNotification />
				</Suspense>
			</body>
		</html>
	);
}
