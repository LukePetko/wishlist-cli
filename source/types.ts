import {stores, wishlistItems, wishlistLinks} from './drizzle/schema.js';

export type WishlistLink = typeof wishlistLinks.$inferSelect & {
	store: typeof stores.$inferSelect;
};

export type WishlistItem = typeof wishlistItems.$inferSelect & {
	wishlistLinks: WishlistLink[];
};

export type NewItem = {
	name: string;
	description: string;
	image: string;
	is_bought: 'y' | 'n';

	links: {
		uuid: string;
		url: string;
		price: number;
		shop: {
			name: string;
			id: string;
		};
	}[];
};

export type NewStore = {
	name: string;
	icon: string;
};
