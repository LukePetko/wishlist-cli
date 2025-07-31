import {Box} from 'ink';
import SelectInput from 'ink-select-input';
import {FC} from 'react';

type ShopModalProps = {
	shopIdInternal: string | null;
	onClose: (item: {value: string; label: string}) => void;
	shops: {
		value: string;
		label: string;
	}[];
};

const ShopModal: FC<ShopModalProps> = ({shopIdInternal, onClose, shops}) => {
	if (!shopIdInternal) return null;

	return (
		<Box
			borderStyle="round"
			borderColor="cyan"
			padding={1}
			flexDirection="column"
			width={40}
			alignSelf="center"
			justifyContent="center"
			alignItems="center"
			backgroundColor="black"
		>
			<SelectInput items={shops} onSelect={onClose} />
		</Box>
	);
};

export default ShopModal;
