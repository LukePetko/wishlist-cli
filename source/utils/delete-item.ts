import {eq} from 'drizzle-orm';
import {db} from '../drizzle/index.js';
import {wishlistItems} from '../drizzle/schema.js';

const deleteItem = async (id: string | undefined) => {
	if (!id) return;
	const result = await db.delete(wishlistItems).where(eq(wishlistItems.id, id));
	if (result.rowCount === 0) return false;
	return true;
};

export default deleteItem;
