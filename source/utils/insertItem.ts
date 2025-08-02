import {db} from '../drizzle/index.js';
import {wishlistItems, wishlistLinks} from '../drizzle/schema.js';
import type {NewItem} from '../types.js';
import {v4 as uuidv4} from 'uuid';
import insertIntoStorage from './insert-into-storage.js';

const insertItem = async (item: NewItem) => {
	if (!item.name) return 'Missing name.';

	let image = null;
	if (item.image !== '') {
		const result = await insertIntoStorage('items', item.image);

		if (!result) return 'Error saving image. Please check the path.';

		image = result;
	}

	const newItem = {
		name: item.name,
		description: item.description,
		image,
		isBought: item.is_bought === 'y',
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
	};

	const newItemId = await db
		.insert(wishlistItems)
		.values(newItem)
		.returning({id: wishlistItems.id});

	if (!newItemId || !newItemId[0]?.id) return 'Error saving item.';

	const links: (typeof wishlistLinks.$inferSelect)[] = item.links.map(
		(link: NewItem['links'][0]) => ({
			id: uuidv4(),
			itemId: newItemId[0]!.id,
			url: link.url,
			price: String(link.price),
			storeId: link.shop.id,
			currency: 'EUR',
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		}),
	);

	const newLinks = await db
		.insert(wishlistLinks)
		.values(links)
		.returning({id: wishlistLinks.id});

	if (!newLinks) return 'Error saving links.';

	return true;
};

export default insertItem;
