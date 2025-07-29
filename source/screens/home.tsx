import {Box, Text, useApp, useInput} from 'ink';
import Spinner from 'ink-spinner';
import {useEffect, useState} from 'react';
import {db} from '../drizzle/index.js';
import SelectInput from 'ink-select-input';
import HomeHeader from '../components/home-header.js';
import {count, eq} from 'drizzle-orm';
import {wishlistItems} from '../drizzle/schema.js';
import useStepStore from '../stores/useStepStore.js';
import {useShallow} from 'zustand/shallow';

const Home = () => {
	const [items, setItems] = useState<
		{
			label: string;
			value: string;
		}[]
	>();

	const [numberOfItems, setNumberOfItems] = useState<number | null>(null);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const pageSize = 10;
	const [showIsBought, setShowIsBought] = useState<boolean>(false);

	const {exit} = useApp();

	const [setSelectedId, setStep] = useStepStore(
		useShallow(state => [state.setSelectedId, state.setStep]),
	);

	useInput((input, key) => {
		switch (input) {
			case 'q':
				exit();
				break;
			case 'n':
				setCurrentPage(prevPage =>
					Math.min(prevPage + 1, Math.ceil(numberOfItems! / pageSize)),
				);
				break;
			case 'p':
				setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
				break;
			case 'b':
				setShowIsBought(prevShowIsBought => !prevShowIsBought);
				break;
			case 'a':
				break;
			case 'enter':
				break;
			default:
				break;
		}

		if (key.leftArrow) {
			setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
		}
		if (key.rightArrow) {
			setCurrentPage(prevPage =>
				Math.min(prevPage + 1, Math.ceil(numberOfItems! / pageSize)),
			);
		}
	});

	const fetchItems = async () => {
		const result = await db
			.select({value: wishlistItems.id, label: wishlistItems.name})
			.from(wishlistItems)
			.where(eq(wishlistItems.isBought, showIsBought))
			.offset((currentPage - 1) * pageSize)
			.limit(pageSize)
			.orderBy(wishlistItems.name);

		setItems(result);
	};

	const fetchNumberOfItems = async () => {
		const result = await db
			.select({count: count()})
			.from(wishlistItems)
			.where(eq(wishlistItems.isBought, showIsBought));
		if (!result[0] || !result[0].count) {
			return;
		}
		setNumberOfItems(result[0].count);
		setCurrentPage(1);
	};

	const handleSelect = ({value}: {value: string}) => {
		setSelectedId(value);
		setStep('detail');
	};

	useEffect(() => {
		fetchItems();
	}, [currentPage, showIsBought]);

	useEffect(() => {
		fetchNumberOfItems();
	}, [showIsBought]);

	if (!items) {
		return (
			<Box gap={1}>
				<Spinner />
				<Text color="cyan">Loading...</Text>
			</Box>
		);
	}

	return (
		<Box flexDirection="column" gap={1}>
			<HomeHeader />
			{!items.length ? (
				<Box gap={1}>
					<Text color="red">No items found</Text>
				</Box>
			) : (
				<Box flexDirection="column" gap={1}>
					<Text>
						Showing only items that are{' '}
						<Text color="cyan" bold>
							{showIsBought ? 'bought' : 'not bought'}
						</Text>
					</Text>
					<SelectInput items={items} onSelect={handleSelect} />
				</Box>
			)}
			{numberOfItems && (
				<Box flexDirection="column">
					<Text>
						{numberOfItems} items found. Page {currentPage} of{' '}
						{Math.ceil(numberOfItems / pageSize)}
					</Text>
					<Text>
						Use{' '}
						<Text color="cyan" bold>
							n
						</Text>{' '}
						to navigate next and{' '}
						<Text color="cyan" bold>
							p
						</Text>{' '}
						to navigate to previous page.
					</Text>
				</Box>
			)}
		</Box>
	);
};

export default Home;
