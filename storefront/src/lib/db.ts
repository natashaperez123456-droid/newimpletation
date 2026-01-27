import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "store.db");
export const db = new Database(dbPath);

// Initialize tables if they don't exist
const initDb = () => {
	db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT,
      seoTitle TEXT,
      seoDescription TEXT,
      priceAmount REAL,
      priceCurrency TEXT,
      categoryName TEXT
    );

    CREATE TABLE IF NOT EXISTS variants (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      name TEXT NOT NULL,
      FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS checkout (
      id TEXT PRIMARY KEY,
      email TEXT,
      currency TEXT DEFAULT 'USD',
      total_amount REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS checkout_lines (
      id TEXT PRIMARY KEY,
      checkout_id TEXT NOT NULL,
      variant_id TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      FOREIGN KEY(checkout_id) REFERENCES checkout(id) ON DELETE CASCADE
    );
  `);
};

initDb();
