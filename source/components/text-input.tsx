import {Box, Text} from 'ink';
import {TextInput as InkTextInput} from '@inkjs/ui';
import {FC} from 'react';

type TextInputProps = {
	onChange: (value: string) => void;
	onSubmit: () => void;
	hoveredField: string;
	selectedField: string;
	fieldName: string;
	fieldTitle: string;
	fieldPlaceholder?: string;
};

const TextInput: FC<TextInputProps> = ({
	onChange,
	onSubmit,
	hoveredField,
	selectedField,
	fieldName,
	fieldTitle,
	fieldPlaceholder,
}) => {
	return (
		<Box flexDirection="row" gap={1}>
			{hoveredField === fieldName ? (
				<Text color="cyan">❯</Text>
			) : (
				<Text color="cyan"> </Text>
			)}
			<Text color="cyan" bold={hoveredField === fieldName}>
				{fieldTitle}:
			</Text>
			<InkTextInput
				isDisabled={selectedField !== fieldName}
				placeholder={fieldPlaceholder}
				onChange={onChange}
				onSubmit={onSubmit}
			/>
		</Box>
	);
};

export default TextInput;
