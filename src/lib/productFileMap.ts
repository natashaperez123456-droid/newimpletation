// Mapeo de Slug de Producto a nombre base de archivo en R2
// Basado en link_digital_content.py y upload_to_r2.py

const PRODUCT_FILE_BASE_NAMES: Record<string, string> = {
	"a-day-with-my-meow": "a-day-with-my-meow-coloring-book",
	"adventure-cozy": "adventure-cozy-bear-coloring-book",
	"animals-mandala-coloring": "animals-mandala-coloring-book",
	"COZY-ANIMALS": "COZY-ANIMALS-coloring-book",
	"dog-and-cats-coloring-pages": "dog-and-cats-coloring-pages-book",
	"floral-potraits": "floral-potraits-coloring-book",
	"kawaii-coloring": "kawaii-home-coloring-book",
};

export function getProductFileKey(slug: string, format: "PDF" | "PNG"): string | null {
	const baseName = PRODUCT_FILE_BASE_NAMES[slug];
	if (!baseName) return null;

	if (format === "PDF") {
		return `${baseName}.pdf`;
	} else {
		return `${baseName}.zip`; // PNGs vienen en un ZIP
	}
}
