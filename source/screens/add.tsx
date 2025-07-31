import {Box, Text, useInput} from 'ink';
import {useState} from 'react';
import TextInput from '../components/text-input.js';

type Field =
	| 'unselected'
	| 'name'
	| 'description'
	| 'image'
	| `link_url_${number}`
	| `link_price_${number}`
	| `link_shop_${number}`
	| `link_delete_${number}`;

type SelectableField = Exclude<Field, 'unselected'> | 'add_link';

type NewItem = {
	name: string;
	description: string;
	image: string;

	links: {
		url: string;
		price: number;
		shop: string;
	}[];
};

const Add = () => {
	const [selectedField, setSelectedField] = useState<Field>('unselected');
	const [hoveredField, setHoveredField] = useState<SelectableField>('name');
	const [tempValue, setTempValue] = useState<string>('');

	const [allFields, setAllFields] = useState<SelectableField[]>([
		'name',
		'description',
		'image',
		'add_link',
	]);

	const [newItem, setNewItem] = useState<NewItem>({
		name: '',
		description: '',
		image: '',
		links: [],
	});

	useInput((input, key) => {
		if (selectedField !== 'unselected') return;
		const hoveredIndex = allFields.indexOf(hoveredField);

		if (input === 'j') {
			setHoveredField(
				allFields[Math.min(hoveredIndex + 1, allFields.length - 1)] ?? 'name',
			);
		} else if (input === 'k') {
			setHoveredField(allFields[Math.max(hoveredIndex - 1, 0)] ?? 'name');
		}

		if (
			key.return &&
			hoveredField.startsWith('link') &&
			hoveredField !== 'add_link'
		) {
			setSelectedField(hoveredField);
			const [_, field, linkIndex] = hoveredField.split('_');

			if (field === undefined || linkIndex === undefined) return;

			const link = newItem.links[+linkIndex];

			if (!link) return;

			setTempValue(String(link[field as 'url' | 'price']));
		} else if (
			key.return &&
			(hoveredField === 'name' ||
				hoveredField === 'description' ||
				hoveredField === 'image')
		) {
			setSelectedField(hoveredField);
			setTempValue(newItem[hoveredField]);
		} else if (key.return && hoveredField === 'add_link') {
			const numberOfLinks = newItem.links.length;
			setNewItem(prev => ({
				...prev,
				links: [
					...prev.links,
					{
						url: '',
						price: 0,
						shop: '',
					},
				],
			}));

			setAllFields(prev => [
				...prev,
				`link_url_${numberOfLinks}`,
				`link_price_${numberOfLinks}`,
			]);
		}
	});

	const handleSubmit = () => {
		setSelectedField('unselected');

		if (selectedField.startsWith('link')) {
			const [_, fieldRaw, linkIndexRaw] = selectedField.split('_');
			const field = fieldRaw as 'url' | 'price' | undefined;
			const linkIndex = linkIndexRaw ? +linkIndexRaw : undefined;

			if (
				linkIndex === undefined ||
				field === undefined ||
				(field !== 'url' && field !== 'price')
			)
				return;

			const newLinks = [...newItem.links];

			if (!newLinks[linkIndex]) return;

			newLinks[linkIndex] = {
				...newLinks[linkIndex],
				[field]: field === 'price' ? +tempValue : tempValue,
			};

			setNewItem(prev => ({
				...prev,
				links: newLinks,
			}));
		} else {
			setNewItem(prev => ({
				...prev,
				[selectedField]: tempValue,
			}));
		}
		setTempValue('');
	};

	return (
		<Box flexDirection="column">
			<Text color="cyan" bold>
				ITEM INFO
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
				fieldName="description"
				fieldTitle="Description"
			/>
			<TextInput
				onChange={setTempValue}
				onSubmit={handleSubmit}
				hoveredField={hoveredField}
				selectedField={selectedField}
				fieldName="image"
				fieldTitle="Image"
			/>
			<Box flexDirection="row" gap={1} marginY={1}>
				{hoveredField === 'add_link' ? (
					<Text color="cyan">❯</Text>
				) : (
					<Text color="cyan"> </Text>
				)}
				<Text color="cyan" bold={hoveredField === 'add_link'}>
					Add Link
				</Text>
			</Box>

			{newItem.links.length ? (
				<Text color="cyan" bold>
					STORES
				</Text>
			) : null}
			{newItem.links.map((_, index) => (
				<Box flexDirection="column" key={index}>
					<TextInput
						onChange={setTempValue}
						onSubmit={handleSubmit}
						hoveredField={hoveredField}
						selectedField={selectedField}
						fieldName={`link_url_${index}`}
						fieldTitle="Link Url"
						fieldPlaceholder="test"
					/>
					<TextInput
						onChange={setTempValue}
						onSubmit={handleSubmit}
						hoveredField={hoveredField}
						selectedField={selectedField}
						fieldName={`link_price_${index}`}
						fieldTitle="Price"
						fieldPlaceholder="test"
					/>
				</Box>
			))}
			<Text>{JSON.stringify(newItem, null, 2)}</Text>
		</Box>
	);
};

export default Add;
