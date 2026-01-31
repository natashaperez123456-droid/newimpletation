// Mapeo de Product ID (número) a nombre de archivo de portada en Cloudflare R2
export const PRODUCT_COVER_MAP: Record<number, string> = {
	164: "a_day_with_my_meow.png",
	163: "adventure_cozy_bear_colorin.png",
	137: "mandalas_animals.png",
	161: "cozy_animal_coloring_book.png",
	156: "dogs_cat_pages_coloring.png",
	157: "flowers_coloring_pages.png",
	162: "kawai_home_coloring.png",
	// Nuevos productos
	165: "adult-comic-coloring-pages.png",
	166: "baby-pony.png",
	167: "happy-animal-colouring-book-free-colouring-pages-4.png",
	168: "space.png",
};

// Función helper para decodificar Product ID de GraphQL
export function extractProductDbId(graphqlId: string): number | null {
	try {
		const decoded = Buffer.from(graphqlId, "base64").toString("utf-8");
		const match = decoded.match(/Product:(\d+)/);
		return match ? parseInt(match[1], 10) : null;
	} catch {
		return null;
	}
}

// Función para obtener URL de portada desde Cloudflare R2
export function getProductCoverUrl(graphqlId: string): string {
	const dbId = extractProductDbId(graphqlId);
	if (!dbId || !PRODUCT_COVER_MAP[dbId]) {
		return "/placeholder.png";
	}

	const fileName = PRODUCT_COVER_MAP[dbId];
	return `https://coloring-images.tinyandbrightcolor.site/${fileName}`;
}
