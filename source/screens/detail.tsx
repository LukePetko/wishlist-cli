import {Box, Text, useApp, useInput} from 'ink';
import useStepStore from '../stores/useStepStore.js';
import {useShallow} from 'zustand/shallow';
import {db} from '../drizzle/index.js';
import {wishlistItems} from '../drizzle/schema.js';
import {eq} from 'drizzle-orm';
import {useEffect, useState} from 'react';
import {WishlistItem} from '../types.js';
import Spinner from 'ink-spinner';
import deleteItem from '../utils/delete-item.js';

const Detail = () => {
	const [selectedId, setSelectedId, setStep] = useStepStore(
		useShallow(state => [state.selectedId, state.setSelectedId, state.setStep]),
	);

	const [itemDetail, setItemDetail] = useState<WishlistItem | undefined>();

	const {exit} = useApp();

	const fetchItem = async () => {
		if (!selectedId) return;

		const result = await db.query.wishlistItems.findFirst({
			with: {
				wishlistLinks: {
					with: {
						store: true,
					},
				},
			},
			where: eq(wishlistItems.id, selectedId),
		});

		if (!result) return;

		setItemDetail(result);
	};

	useEffect(() => {
		fetchItem();
	}, [selectedId]);

	useInput(async input => {
		switch (input) {
			case 'q':
				exit();
				break;
			case 'b':
				setStep('home');
				setSelectedId(undefined);
				break;
			case 'd':
				const result = await deleteItem(selectedId);
				if (result) {
					setStep('home');
					setSelectedId(undefined);
				}
				break;
			default:
				break;
		}
	});

	if (!itemDetail)
		return (
			<Box gap={1}>
				<Spinner />
				<Text color="cyan">Loading...</Text>
			</Box>
		);

	return (
		<Box flexDirection="column" gap={2} marginLeft={1}>
			<Box flexDirection="column" borderStyle="round">
				<Text bold color="cyan">
					Selected item
				</Text>
				<Text>
					Press <Text color="cyan">d</Text> to delete the item
				</Text>
				<Text>
					Press <Text color="cyan">q</Text> to quit
				</Text>
			</Box>
			<Box flexDirection="column" gap={1}>
				<Text bold color="cyan">
					{itemDetail.name}
				</Text>
				<Text>
					<Text color="cyan" bold>
						Description:{' '}
					</Text>
					{itemDetail.description}
				</Text>
				<Text>
					<Text color="cyan" bold>
						Image:{' '}
					</Text>
					{itemDetail.image}
				</Text>
				<Box flexDirection="column">
					<Text color="cyan" bold>
						Stores:
					</Text>
					{itemDetail.wishlistLinks.map(link => (
						<Text key={link.store.id}>
							{' '}
							- {link.store.name}: {link.price}€
						</Text>
					))}
				</Box>
				<Text>
					<Text color="cyan" bold>
						Is bought:{' '}
					</Text>
					{itemDetail.isBought ? 'Yes 😎' : 'No 😞'}
				</Text>
				<Box flexDirection="column">
					<Text>
						<Text color="cyan" bold>
							Created at:{' '}
						</Text>
						{new Date(itemDetail.createdAt).toLocaleString('sk-SK')}
					</Text>
					<Text>
						<Text color="cyan" bold>
							Updated at:{' '}
						</Text>
						{new Date(itemDetail.updatedAt).toLocaleString('sk-SK')}
					</Text>
				</Box>
			</Box>
		</Box>
	);
};

export default Detail;
