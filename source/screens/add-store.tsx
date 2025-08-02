import {Box, Text, useInput} from 'ink';
import {useState} from 'react';
import {NewStore} from '../types.js';
import TextInput from '../components/text-input.js';
import useStepStore from '../stores/useStepStore.js';
import insertStore from '../utils/insert-store.js';

type Field = 'unselected' | 'name' | 'icon';
type SelectableField = Exclude<Field, 'unselected'> | 'save';

const AddStore = () => {
	const setStep = useStepStore(state => state.setStep);

	const [newStore, setNewStore] = useState<NewStore>({
		name: '',
		icon: '',
	});

	const [selectedField, setSelectedField] = useState<Field>('unselected');
	const [hoveredField, setHoveredField] = useState<SelectableField>('name');
	const [tempValue, setTempValue] = useState<string>('');

	const allFields = ['name', 'icon', 'save'] as const;

	useInput(async (input, key) => {
		if (selectedField !== 'unselected') return;
		const hoveredIndex = allFields.indexOf(hoveredField);

		if (input === 'j') {
			setHoveredField(
				allFields[Math.min(hoveredIndex + 1, allFields.length - 1)] ?? 'name',
			);
		} else if (input === 'k') {
			setHoveredField(allFields[Math.max(hoveredIndex - 1, 0)] ?? 'name');
		}

		if (key.return && hoveredField !== 'save') {
			setSelectedField(hoveredField);
			setTempValue(newStore[hoveredField]);
		} else if (key.return && hoveredField === 'save') {
			const result = await insertStore(newStore);
			if (typeof result === 'string') {
				console.log(result);
			} else {
				setStep('home');
			}
		}
	});

	const handleSubmit = () => {
		setSelectedField('unselected');
		setNewStore(prev => ({
			...prev,
			[selectedField]: tempValue,
		}));
		setTempValue('');
	};

	return (
		<Box flexDirection="column">
			<Text color="cyan" bold>
				STORE INFO
			</Text>
			<TextInput
				onChange={setTempValue}
				onSubmit={handleSubmit}
				hoveredField={hoveredField}
				selectedField={selectedField}
				fieldName="name"
				fieldTitle="Name"
			/>
			<TextInput
				onChange={setTempValue}
				onSubmit={handleSubmit}
				hoveredField={hoveredField}
				selectedField={selectedField}
				fieldName="icon"
				fieldTitle="Icon"
			/>
			<Box flexDirection="row" gap={1} marginY={1}>
				{hoveredField === 'save' ? (
					<Text color="cyan">❯</Text>
				) : (
					<Text color="cyan"> </Text>
				)}
				<Text color="cyan" bold={hoveredField === 'save'}>
					Save
				</Text>
			</Box>
		</Box>
	);
};

export default AddStore;
