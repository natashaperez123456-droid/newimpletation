import productsData from "./products_data.json";

export interface Product {
	id: string;
	name: string;
	slug: string;
	description: object | string | null;
	seoTitle: string | null;
	seoDescription: string | null;
	pricing: {
		priceRange: {
			start: {
				gross: {
					amount: number;
					currency: string;
				};
			};
		} | null;
	};
	category: {
		id: string;
		name: string;
	} | null;
	variants: {
		id: string;
		name: string;
	}[];
}

export const getLocalProducts = (): Product[] => {
	return productsData as Product[];
};

export const getLocalProductBySlug = (slug: string): Product | undefined => {
	return (productsData as Product[]).find((p) => p.slug === slug);
};
