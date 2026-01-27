"use client";

import { useRouter } from "next/navigation";
import { SearchIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import productsData from "@/lib/products_data.json";
import { LinkWithChannel } from "@/ui/atoms/LinkWithChannel";

export const SearchBar = ({ channel }: { channel: string }) => {
	const router = useRouter();
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<any[]>([]);
	const [isOpen, setIsOpen] = useState(false);
	const wrapperRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		const term = e.target.value;
		setQuery(term);

		if (term.length > 1) {
			// Filtro simple local
			const filtered = productsData.filter((p) => p.name.toLowerCase().includes(term.toLowerCase()));
			setResults(filtered.slice(0, 5)); // Mostrar máximo 5 resultados
			setIsOpen(true);
		} else {
			setResults([]);
			setIsOpen(false);
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (query.trim().length > 0) {
			router.push(`/${encodeURIComponent(channel)}/search?query=${encodeURIComponent(query)}`);
			setIsOpen(false);
		}
	};

	return (
		<div ref={wrapperRef} className="relative w-full lg:w-[28rem]">
			<form onSubmit={handleSubmit} className="group relative flex w-full items-center">
				<label className="w-full">
					<span className="sr-only">search for products</span>
					<input
						type="text"
						name="search"
						value={query}
						onChange={handleSearch}
						onFocus={() => query.length > 1 && setIsOpen(true)}
						placeholder="Search for products..."
						autoComplete="off"
						className="h-10 w-full rounded-md border border-neutral-300 bg-white px-4 py-2 pr-10 text-sm text-black placeholder:text-neutral-500 focus:border-black focus:ring-black"
					/>
				</label>
				<button
					type="submit"
					className="absolute right-0 top-0 inline-flex h-10 w-10 items-center justify-center text-neutral-500 hover:text-neutral-700"
				>
					<span className="sr-only">search</span>
					<SearchIcon aria-hidden className="h-5 w-5" />
				</button>
			</form>

			{/* Dropdown de Resultados */}
			{isOpen && results.length > 0 && (
				<div className="absolute top-full z-50 mt-1 w-full overflow-hidden rounded-md border border-neutral-200 bg-white shadow-lg">
					<ul className="py-1">
						{results.map((product) => (
							<li key={product.id}>
								<LinkWithChannel
									href={`/products/${product.slug}`}
									className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
									onClick={() => setIsOpen(false)}
								>
									{product.name}
								</LinkWithChannel>
							</li>
						))}
					</ul>
				</div>
			)}

			{/* Mensaje de Sin Resultados */}
			{isOpen && query.length > 1 && results.length === 0 && (
				<div className="absolute top-full z-50 mt-1 w-full rounded-md border border-neutral-200 bg-white p-4 text-center text-sm text-neutral-500 shadow-lg">
					No matching products.
				</div>
			)}
		</div>
	);
};
