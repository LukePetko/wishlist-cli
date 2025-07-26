import { pgTable, uuid, varchar, text, boolean, timestamp, foreignKey, numeric } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const wishlistItems = pgTable("wishlist_items", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	image: varchar({ length: 2083 }),
	description: text(),
	isBought: boolean("is_bought").default(false).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const wishlistLinks = pgTable("wishlist_links", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	itemId: uuid("item_id").notNull(),
	url: varchar({ length: 2083 }).notNull(),
	price: numeric({ precision: 10, scale:  2 }).notNull(),
	currency: varchar({ length: 3 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	storeId: uuid("store_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.itemId],
			foreignColumns: [wishlistItems.id],
			name: "fk_wishlist_links_item_id"
		}),
	foreignKey({
			columns: [table.storeId],
			foreignColumns: [stores.id],
			name: "fk_wishlist_links_store_id"
		}),
]);

export const wishlistItemsCategories = pgTable("wishlist_items_categories", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	itemId: uuid("item_id").notNull(),
	categoryId: uuid("category_id").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.itemId],
			foreignColumns: [wishlistItems.id],
			name: "fk_wishlist_items_categories_item_id"
		}),
	foreignKey({
			columns: [table.categoryId],
			foreignColumns: [categories.id],
			name: "fk_wishlist_items_categories_category_id"
		}),
]);

export const categories = pgTable("categories", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
});

export const stores = pgTable("stores", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	icon: varchar({ length: 2083 }),
	iconType: varchar("icon_type", { length: 255 }).default('local'),
});
