"use client";

import { useRef, useEffect } from "react";

declare global {
	interface Window {
		onloadTurnstileCallback: () => void;
		turnstile: {
			render: (selector: string | HTMLElement, options: TurnstileOptions) => string | undefined;
			reset: (widgetId: string) => void;
		};
	}
}

interface TurnstileOptions {
	sitekey: string;
	callback: (token: string) => void;
	"error-callback"?: () => void;
	"expired-callback"?: () => void;
}

interface TurnstileProps {
	onVerify: (token: string) => void;
}

export function Turnstile({ onVerify }: TurnstileProps) {
	const ref = useRef<HTMLDivElement>(null);
	const widgetIdRef = useRef<string | null>(null);

	useEffect(() => {
		const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
		if (!siteKey) {
			console.error("NEXT_PUBLIC_TURNSTILE_SITE_KEY is not set.");
			return;
		}

		const loadAndRenderTurnstile = () => {
			if (ref.current && !ref.current.hasChildNodes()) {
				const widgetId = window.turnstile.render(ref.current, {
					sitekey: siteKey,
					callback: (token) => onVerify(token),
				});
				if (widgetId) {
					widgetIdRef.current = widgetId;
				}
			}
		};

		window.onloadTurnstileCallback = loadAndRenderTurnstile;
		if (window.turnstile) loadAndRenderTurnstile();

		return () => {
			// Cleanup logic if needed, though Turnstile doesn't have a direct unmount method.
			// Resetting might be an option if the component re-renders frequently.
		};
	}, [onVerify]);

	return <div ref={ref} />;
}
