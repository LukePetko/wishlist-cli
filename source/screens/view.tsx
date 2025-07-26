import {Box, Text, useApp, useInput} from 'ink';
import Spinner from 'ink-spinner';
import {useEffect, useState} from 'react';
import {db} from '../drizzle/index.js';
import SelectInput from 'ink-select-input';

const View = () => {
	const [items, setItems] = useState<
		{
			label: string;
			value: string;
		}[]
	>();

	const {exit} = useApp();

	useInput((input, _) => {
		if (input === 'q') {
			exit();
		}
	});

	const fetchItems = async () => {
		const result = await db.query.wishlistItems.findMany({
			columns: {
				id: true,
				name: true,
			},
		});

		const mappedResult = result.map(item => ({
			value: item.id,
			label: item.name,
		}));

		setItems(mappedResult);
	};

	useEffect(() => {
		fetchItems();
	}, []);

	if (!items) {
		return (
			<Box gap={1}>
				<Spinner />
				<Text color="cyan">Loading...</Text>
			</Box>
		);
	}

	return (
		<Box>
			{!items.length ? (
				<Box gap={1}>
					<Text color="red">No items found</Text>
				</Box>
			) : (
				<Box flexDirection="column">
					<SelectInput items={items} onSelect={console.log} />
				</Box>
			)}
		</Box>
	);
};

export default View;
