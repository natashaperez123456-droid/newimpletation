"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

// Componente Watermark movido fuera del render principal
const Watermark = () => (
	<div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-20">
		<span className="rotate-[-45deg] whitespace-nowrap text-xl font-bold uppercase tracking-widest text-[color:var(--ink)] sm:text-3xl">
			Tiny Tales & Bright Color
		</span>
	</div>
);

const buildPreviewImages = (slug: string, count: number) =>
	Array.from({ length: count }, (_, index) => `/preview/${slug}/page-${index + 1}.jpg`);

export function ProductPreviewGallery({ slug, count = 4 }: { slug: string; count?: number }) {
	const images = useMemo(() => buildPreviewImages(slug, count), [slug, count]);
	const [activeIndex, setActiveIndex] = useState(0);
	const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
	const [isOpen, setIsOpen] = useState(false);

	const activeImage = images[activeIndex];

	return (
		<div className="space-y-4">
			<div className="flex flex-col gap-4 rounded-3xl border border-black/10 bg-[#FDF1E5] p-6 shadow-[0_24px_50px_rgba(15,12,8,0.12)]">
				<div className="flex flex-col gap-1">
					<p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--moss)]">
						Click to preview pages
					</p>
					<p className="text-xs font-bold text-emerald-700">
						* Previews include watermarks. Your downloads will be clean and high-quality.
					</p>
				</div>

				<div
					className="group relative cursor-zoom-in overflow-hidden rounded-2xl border border-black/5 bg-white transition-transform hover:scale-[1.02]"
					onClick={() => setIsOpen(true)}
				>
					<Image
						src={activeImage}
						alt="Preview page"
						width={500}
						height={700}
						className="aspect-[1/1.4] h-full w-full object-contain"
						onError={() => setLoadedImages((prev) => ({ ...prev, [activeImage]: false }))}
					/>
					<Watermark />
					<div className="absolute inset-0 flex items-end justify-center bg-black/5 opacity-0 transition-opacity group-hover:opacity-100">
						<span className="mb-4 rounded-full bg-white/90 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[color:var(--ink)] shadow-sm">
							Click to zoom
						</span>
					</div>
				</div>

				<div className="grid grid-cols-5 gap-3">
					{images.map((src, index) => (
						<button
							key={src}
							type="button"
							onClick={() => setActiveIndex(index)}
							className={`relative aspect-[1/1.4] overflow-hidden rounded-lg border-2 transition-all ${
								index === activeIndex
									? "scale-105 border-[color:var(--ink)] shadow-md"
									: "border-transparent opacity-60 hover:opacity-100"
							} bg-white`}
						>
							<Image
								src={src}
								alt={`Thumbnail ${index + 1}`}
								width={100}
								height={140}
								className="h-full w-full object-cover"
								onError={() => setLoadedImages((prev) => ({ ...prev, [src]: false }))}
							/>
							<div className="bg-[color:var(--ink)]/5 absolute inset-0" />
						</button>
					))}
				</div>
			</div>

			{isOpen && (
				<div
					className="animate-in fade-in fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm transition-all duration-300"
					onClick={() => setIsOpen(false)}
				>
					<div
						className="scale-in relative flex h-full max-h-[90vh] w-full max-w-4xl flex-col gap-4 rounded-3xl bg-[color:var(--chalk)] p-6 shadow-2xl transition-all duration-300"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="flex items-center justify-between gap-4">
							<div className="flex flex-col gap-1">
								<p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--moss)]">
									Preview: Page {activeIndex + 1} of {images.length}
								</p>
								<p className="text-xs font-bold text-emerald-700">
									Watermarks are only for preview. Your download will be clean.
								</p>
							</div>
							<button
								type="button"
								onClick={() => setIsOpen(false)}
								className="rounded-full bg-white/80 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[color:var(--ink)] hover:bg-white"
							>
								Close
							</button>
						</div>

						<div className="relative flex-1 overflow-hidden rounded-2xl border border-black/10 bg-white">
							<Image
								src={activeImage}
								alt="Preview page zoom"
								width={1200}
								height={1680}
								className="h-full w-full object-contain"
							/>
							<Watermark />
						</div>

						<div className="grid grid-cols-5 gap-4">
							{images.map((src, index) => (
								<button
									key={`${src}-modal`}
									type="button"
									onClick={() => setActiveIndex(index)}
									className={`relative aspect-[1/1.4] overflow-hidden rounded-lg border-2 transition-all ${
										index === activeIndex
											? "scale-105 border-[color:var(--ink)]"
											: "border-transparent opacity-50 hover:opacity-100"
									} bg-white`}
								>
									<Image
										src={src}
										alt={`Thumbnail modal ${index + 1}`}
										width={100}
										height={140}
										className="h-full w-full object-cover"
									/>
								</button>
							))}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
