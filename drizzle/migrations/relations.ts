import { relations } from "drizzle-orm/relations";
import { stores, wishlistLinks, wishlistItems, wishlistItemsCategories, categories } from "./schema";

export const wishlistLinksRelations = relations(wishlistLinks, ({one}) => ({
	store: one(stores, {
		fields: [wishlistLinks.storeId],
		references: [stores.id]
	}),
	wishlistItem: one(wishlistItems, {
		fields: [wishlistLinks.itemId],
		references: [wishlistItems.id]
	}),
}));

export const storesRelations = relations(stores, ({many}) => ({
	wishlistLinks: many(wishlistLinks),
}));

export const wishlistItemsRelations = relations(wishlistItems, ({many}) => ({
	wishlistLinks: many(wishlistLinks),
	wishlistItemsCategories: many(wishlistItemsCategories),
}));

export const wishlistItemsCategoriesRelations = relations(wishlistItemsCategories, ({one}) => ({
	wishlistItem: one(wishlistItems, {
		fields: [wishlistItemsCategories.itemId],
		references: [wishlistItems.id]
	}),
	category: one(categories, {
		fields: [wishlistItemsCategories.categoryId],
		references: [categories.id]
	}),
}));

export const categoriesRelations = relations(categories, ({many}) => ({
	wishlistItemsCategories: many(wishlistItemsCategories),
}));