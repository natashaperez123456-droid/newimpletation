// Mapeo de slug a número de imágenes de preview disponibles
export const PRODUCT_PREVIEW_COUNT: Record<string, number> = {
	// Productos originales (con 4 previews)
	"a-day-with-my-meow": 4,
	"adventure-cozy": 4,
	"animals-mandala-coloring": 4,
	"COZY-ANIMALS": 4, // carpeta es cozy-animals
	"dog-and-cats-coloring-pages": 4,
	"floral-potraits": 4,
	"kawaii-coloring": 4,
	// Nuevos productos (con 2 previews)
	"adult-comic-coloring-pages": 2,
	"baby-ponies": 2,
	"happy-animal-colouring-pages": 2,
	"space": 2,
};

export function getPreviewCount(slug: string): number {
	return PRODUCT_PREVIEW_COUNT[slug] ?? 4;
}
