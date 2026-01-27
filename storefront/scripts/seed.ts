import { db } from "../src/lib/db.js";
import productsData from "../src/lib/products_data.json" assert { type: "json" };

console.log("Seeding database...");

// Clear existing products
db.prepare("DELETE FROM products").run();
db.prepare("DELETE FROM variants").run();

const insertProduct = db.prepare(`
  INSERT INTO products (id, name, slug, description, seoTitle, seoDescription, priceAmount, priceCurrency, categoryName)
  VALUES (@id, @name, @slug, @description, @seoTitle, @seoDescription, @priceAmount, @priceCurrency, @categoryName)
`);

const insertVariant = db.prepare(`
  INSERT INTO variants (id, product_id, name)
  VALUES (@id, @product_id, @name)
`);

const runSeed = () => {
	for (const product of productsData) {
		const price = product.pricing.priceRange?.start.gross || { amount: 0, currency: "USD" };

		insertProduct.run({
			id: product.id,
			name: product.name,
			slug: product.slug,
			description: product.description,
			seoTitle: product.seoTitle || "",
			seoDescription: product.seoDescription || "",
			priceAmount: price.amount,
			priceCurrency: price.currency,
			categoryName: product.category?.name || "Uncategorized",
		});

		for (const variant of product.variants) {
			insertVariant.run({
				id: variant.id,
				product_id: product.id,
				name: variant.name,
			});
		}
	}
	console.log("Seeding completed!");
};

runSeed();
