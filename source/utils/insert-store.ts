import {db} from '../drizzle/index.js';
import {stores} from '../drizzle/schema.js';
import {NewStore} from '../types.js';
import insertIntoStorage from './insert-into-storage.js';

const insertStore = async (store: NewStore) => {
	if (!store.name) return 'Missing name.';

	let image = null;

	if (store.icon !== '') {
		const result = await insertIntoStorage('icons', store.icon);

		if (!result) return 'Error saving image. Please check the path.';

		image = result;
	}

	const newStore = {
		name: store.name,
		icon: image,
	};

	const newStoreId = await db
		.insert(stores)
		.values(newStore)
		.returning({id: stores.id});

	if (!newStoreId || !newStoreId[0]?.id) return 'Error saving store.';

	return true;
};

export default insertStore;
