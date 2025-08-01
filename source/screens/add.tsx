import {Box, Text, useInput} from 'ink';
import {useEffect, useState} from 'react';
import TextInput from '../components/text-input.js';
import getAllStores from '../utils/getAllStores.js';
import {v4 as uuidv4} from 'uuid';
import ShopModal from '../components/shop-modal.js';
import {NewItem} from '../types.js';
import insertItem from '../utils/insertItem.js';
import useStepStore from '../stores/useStepStore.js';

type Field =
	| 'unselected'
	| 'name'
	| 'description'
	| 'image'
	| `link_url_${number}`
	| `link_price_${number}`
	| `link_shop_${number}`
	| `link_delete_${number}`;

type SelectableField =
	| Exclude<Field, 'unselected'>
	| 'add_link'
	| `link_delete_${number}`
	| 'save';

const Add = () => {
	const setStep = useStepStore(state => state.setStep);

	const [selectedField, setSelectedField] = useState<Field>('unselected');
	const [hoveredField, setHoveredField] = useState<SelectableField>('name');
	const [tempValue, setTempValue] = useState<string>('');

	const [allFields, setAllFields] = useState<SelectableField[]>([
		'name',
		'description',
		'image',
		'add_link',
		'save',
	]);

	const [newItem, setNewItem] = useState<NewItem>({
		name: '',
		description: '',
		image: '',
		links: [],
	});

	const [stores, setStores] = useState<{name: string; id: string}[]>([]);

	const [shopIdInternal, setShopIdInternal] = useState<string | null>(null);

	useInput(async (input, key) => {
		if (selectedField !== 'unselected' || shopIdInternal) return;
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
			hoveredField !== 'add_link' &&
			hoveredField !== 'save' &&
			!hoveredField.startsWith('link_delete') &&
			!hoveredField.startsWith('link_shop')
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
						uuid: uuidv4(),
						url: '',
						price: 0,
						shop: {name: '', id: ''},
					},
				],
			}));

			setAllFields(prev => [
				...prev.slice(0, prev.length - 1),
				`link_url_${numberOfLinks}`,
				`link_price_${numberOfLinks}`,
				`link_shop_${numberOfLinks}`,
				`link_delete_${numberOfLinks}`,
				`save`,
			]);
		} else if (key.return && hoveredField.startsWith('link_shop')) {
			const linkIndex = hoveredField.split('_')[2];
			if (linkIndex === undefined) return;

			setShopIdInternal(newItem.links[+linkIndex]?.uuid || null);
		} else if (key.return && hoveredField.startsWith('link_delete')) {
			const linkIndex = hoveredField.split('_')[2];

			if (linkIndex === undefined) return;

			const lastIndex = newItem.links.length - 1;

			setNewItem(prev => ({
				...prev,
				links: prev.links.filter((_, index) => index !== +linkIndex),
			}));

			setAllFields(prev => {
				return prev.filter(
					item =>
						item !== `link_delete_${lastIndex}` &&
						item !== `link_url_${lastIndex}` &&
						item !== `link_price_${lastIndex}` &&
						item !== `link_shop_${lastIndex}`,
				);
			});

			setHoveredField('add_link');
			setSelectedField('unselected');
		} else if (key.return && hoveredField === 'save') {
			const success = await insertItem(newItem);
			if (success) {
				setStep('home');
			}
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

	const fetchStores = async () => {
		const result = await getAllStores();
		setStores(result);
	};

	useEffect(() => {
		fetchStores();
	}, []);

	return (
		<>
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
				{newItem.links.map(({uuid}, index) => (
					<Box flexDirection="column" key={uuid} paddingTop={1}>
						<Text color="cyan" bold>
							Link {index + 1}
						</Text>
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
						<Box flexDirection="row" gap={1}>
							{hoveredField === `link_shop_${index}` ? (
								<Text color="cyan">❯</Text>
							) : (
								<Text color="cyan"> </Text>
							)}
							<Text color="cyan" bold={hoveredField === `link_shop_${index}`}>
								Select Shop:
							</Text>
							<Text>{newItem.links[index]?.shop.name || ''}</Text>
						</Box>
						<Box flexDirection="row" gap={1}>
							{hoveredField === `link_delete_${index}` ? (
								<Text color="cyan">❯</Text>
							) : (
								<Text color="cyan"> </Text>
							)}
							<Text color="cyan" bold={hoveredField === `link_delete_${index}`}>
								Remove Link
							</Text>
						</Box>
					</Box>
				))}
				<Box flexDirection="row" gap={1} marginY={1}>
					{hoveredField === 'save' ? (
						<Text color="cyan">❯</Text>
					) : (
						<Text color="cyan"> </Text>
					)}
					<Text color="cyan" bold>
						Save
					</Text>
				</Box>
			</Box>
			<ShopModal
				shopIdInternal={shopIdInternal}
				onClose={({value, label}) => {
					const links = newItem.links.map(link => {
						if (link.uuid === shopIdInternal) {
							return {
								...link,
								shop: {
									name: label,
									id: value,
								},
							};
						}
						return link;
					});

					setNewItem(prev => ({
						...prev,
						links,
					}));
					setShopIdInternal(null);
				}}
				shops={stores.map(store => ({
					value: store.id,
					label: store.name,
				}))}
			/>
		</>
	);
};

export default Add;
