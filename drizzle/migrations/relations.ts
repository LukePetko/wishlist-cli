import { relations } from "drizzle-orm/relations";
import { wishlistItems, wishlistLinks, stores, wishlistItemsCategories, categories } from "./schema";

export const wishlistLinksRelations = relations(wishlistLinks, ({one}) => ({
	wishlistItem: one(wishlistItems, {
		fields: [wishlistLinks.itemId],
		references: [wishlistItems.id]
	}),
	store: one(stores, {
		fields: [wishlistLinks.storeId],
		references: [stores.id]
	}),
}));

export const wishlistItemsRelations = relations(wishlistItems, ({many}) => ({
	wishlistLinks: many(wishlistLinks),
	wishlistItemsCategories: many(wishlistItemsCategories),
}));

export const storesRelations = relations(stores, ({many}) => ({
	wishlistLinks: many(wishlistLinks),
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