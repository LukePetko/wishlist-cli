import {useEffect, useState} from 'react';
import {Box, Text} from 'ink';
import {db} from './drizzle/index.js';
import useStepStore from './stores/useStepStore.js';
import type {CurrentStep} from './stores/useStepStore.js';
import BigText from 'ink-big-text';
import Gradient from 'ink-gradient';
import SelectInput from 'ink-select-input';
import {useShallow} from 'zustand/shallow';

type Props = {
	name: string | undefined;
};

export default function App({name = 'Stranger'}: Props) {
	// const {exit} = useApp();
	// const [x, setX] = useState(1);
	// const [y, setY] = useState(1);

	const [data, setData] = useState('');

	const [currentStep, setStep] = useStepStore(
		useShallow(state => [state.currentStep, state.setStep]),
	);

	const fetchData = async () => {
		setData('Loading...');
		const data = await db.query.wishlistItems.findMany();
		setData(data.map(item => item.name).join(', '));
	};

	useEffect(() => {
		fetchData();
	}, []);

	useEffect(() => {
		console.log('currentStep', currentStep);
	}, [currentStep]);

	const handleSelect = ({value}: {label: string; value: string}) => {
		setStep(value as CurrentStep);
	};

	const items = [
		{
			label: 'View existing items',
			value: 'view',
		},
		{
			label: 'Edit existing items',
			value: 'edit',
		},
		{
			label: 'Add new item',
			value: 'add',
		},
		{
			label: 'Mark item as bought',
			value: 'mark-bought',
		},
	];

	if (currentStep === 'home') {
		return (
			<Box flexDirection="column" gap={1}>
				<Gradient name="vice">
					<BigText text="Wishlist CLI" />
				</Gradient>
				<Text>
					Welcome to the <Text color="cyanBright">Wishlist CLI</Text> add,
					remove, and view your wishlist items.
				</Text>
				<Text>
					Please select an option, you can naviate with the arrow keys:
				</Text>
				<SelectInput items={items} onSelect={handleSelect} />
			</Box>
		);
	}

	return (
		<Box flexDirection="column">
			<Text>
				Hello, <Text color="green">{name}</Text>
			</Text>
			<Text>{data}</Text>
		</Box>
	);
}
