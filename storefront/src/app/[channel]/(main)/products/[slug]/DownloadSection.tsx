"use client";

import { useRouter } from "next/navigation";
import { useTransition, useState } from "react";
import clsx from "clsx";
import { Turnstile } from "@/ui/components/Turnstile";

type DownloadSectionProps = {
	variantId?: string;
	productSlug: string;
	disabled?: boolean;
};

type Format = "PNG" | "PDF";

export const DownloadSection = ({ variantId, productSlug, disabled }: DownloadSectionProps) => {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [selectedFormat, setSelectedFormat] = useState<Format>("PNG");
	const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

	const handleDownload = () => {
		if (disabled || !turnstileToken) {
			// Opcional: mostrar un mensaje al usuario para que complete el captcha
			if (!turnstileToken) alert("Please verify you are not a robot.");
			return;
		}

		startTransition(() => {
			// Redirigir a API de descarga local con el token
			window.location.href = `/api/download?slug=${encodeURIComponent(
				productSlug,
			)}&format=${selectedFormat}&cf-turnstile-response=${encodeURIComponent(turnstileToken)}`;
		});
	};

	const formatPrice = "$0";

	return (
		<div className="flex flex-col gap-4">
			{/* Botón Principal Dinámico */}
			<button
				onClick={handleDownload}
				className={clsx(
					"flex w-full items-center justify-center rounded-lg px-8 py-3 text-base font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-md",
					disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
					selectedFormat === "PNG" ? "bg-[#d41c6d]" : "bg-[#009b6e]",
				)}
				disabled={disabled || isPending}
			>
				{isPending ? "Processing..." : `Download Free ${selectedFormat}`}
			</button>

			{/* Info Email (Mocked por ahora) */}
			<div className="flex items-center gap-2 text-xs text-neutral-600">
				<div className="flex h-4 w-4 items-center justify-center rounded bg-indigo-100 text-[10px]">📧</div>
				<span>
					{/* Using: <span className="text-neutral-800">jeremias@gmail.com</span> */}
				</span>
				<button className="text-[#d41c6d] underline hover:text-[#b0165a]">change</button>
			</div>

			<p className="text-xs font-bold text-[#009b6e]">* Clean, high-res files without watermarks.</p>

			{/* Widget de Turnstile */}
			<div className="flex justify-center">
				<Turnstile onVerify={setTurnstileToken} />
			</div>

			{/* Selector de Formatos */}
			<div className="mt-2 rounded-xl border border-neutral-100 bg-neutral-50/50 p-4">
				<p className="mb-3 text-xs font-bold uppercase tracking-widest text-neutral-500">FORMATS</p>
				<div className="flex gap-3">
					{/* Opción PNG */}
					<button
						onClick={() => setSelectedFormat("PNG")}
						className={clsx(
							"flex flex-1 items-center justify-between rounded-md border px-4 py-2 text-sm font-bold transition-all",
							selectedFormat === "PNG"
								? "border-[#d41c6d] bg-[#d41c6d] text-white shadow-md"
								: "border-gray-200 bg-white text-gray-700 hover:border-gray-300",
						)}
					>
						<span>PNG</span>
						<span>{formatPrice}</span>
					</button>

					{/* Opción PDF */}
					<button
						onClick={() => setSelectedFormat("PDF")}
						className={clsx(
							"flex flex-1 items-center justify-between rounded-md border px-4 py-2 text-sm font-bold transition-all",
							selectedFormat === "PDF"
								? "border-[#009b6e] bg-[#009b6e] text-white shadow-md"
								: "border-gray-200 bg-white text-gray-700 hover:border-gray-300",
						)}
					>
						<span>PDF</span>
						<span>{formatPrice}</span>
					</button>
				</div>
			</div>
		</div>
	);
};
