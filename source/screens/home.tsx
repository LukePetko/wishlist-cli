import {Box, Text} from 'ink';
import SelectInput from 'ink-select-input';
import type {CurrentStep} from '../stores/useStepStore.js';
import useStepStore from '../stores/useStepStore.js';

const Home = () => {
	const setStep = useStepStore(state => state.setStep);

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

	return (
		<Box flexDirection="column" gap={1}>
			<Text>
				Welcome to the <Text color="cyanBright">Wishlist CLI</Text> add, remove,
				and view your wishlist items.
			</Text>
			<Text>Please select an option, you can naviate with the arrow keys:</Text>
			<SelectInput items={items} onSelect={handleSelect} />
		</Box>
	);
};

export default Home;
