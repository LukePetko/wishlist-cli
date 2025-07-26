import React, {useEffect, useState} from 'react';
import {Box, Text} from 'ink';
import {db} from './drizzle/index.js';
import useStepStore from './stores/useStepStore.js';

type Props = {
	name: string | undefined;
};

export default function App({name = 'Stranger'}: Props) {
	// const {exit} = useApp();
	// const [x, setX] = useState(1);
	// const [y, setY] = useState(1);

	const [data, setData] = useState('');

	const currentStep = useStepStore(state => state.currentStep);

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

	// useInput((input, key) => {
	// 	if (input === 'q') {
	// 		exit();
	// 	}
	//
	// 	if (key.leftArrow) {
	// 		setX(Math.max(1, x - 1));
	// 	}
	//
	// 	if (key.rightArrow) {
	// 		setX(Math.min(20, x + 1));
	// 	}
	//
	// 	if (key.upArrow) {
	// 		setY(Math.max(1, y - 1));
	// 	}
	//
	// 	if (key.downArrow) {
	// 		setY(Math.min(10, y + 1));
	// 	}
	// });

	if (currentStep === 'home') {
		return (
			<Box flexDirection="column">
				<Text>
					Hello, <Text color="green">{name}</Text>
				</Text>
				<Text>{data}</Text>
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
