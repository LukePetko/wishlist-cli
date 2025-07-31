import {db} from '../drizzle/index.js';

const getAllStores = async () => {
	return await db.query.stores.findMany({
		columns: {
			name: true,
			id: true,
		},
	});
};

export default getAllStores;
