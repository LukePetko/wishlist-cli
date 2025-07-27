import {Box, Newline, Text} from 'ink';

const HomeHeader = () => {
	return (
		<Box flexDirection="column" borderStyle="round" paddingX={1}>
			<Text>
				Welcome to the{' '}
				<Text color="cyan" bold>
					Wishlist CLI
				</Text>
			</Text>
			<Newline />
			<Text>
				Press{' '}
				<Text color="cyan" bold>
					enter
				</Text>{' '}
				to select an item to view/edit.
			</Text>
			<Text>
				Press{' '}
				<Text color="cyan" bold>
					a
				</Text>{' '}
				to add an item.
			</Text>
			<Text>
				Press{' '}
				<Text color="cyan" bold>
					q
				</Text>{' '}
				to exit.
			</Text>
		</Box>
	);
};

export default HomeHeader;
