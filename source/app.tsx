import {Box} from 'ink';
import useStepStore from './stores/useStepStore.js';
import Home from './screens/home.js';
import Gradient from 'ink-gradient';
import BigText from 'ink-big-text';
import Detail from './screens/detail.js';

export default function App() {
	const currentStep = useStepStore(state => state.currentStep);

	return (
		<Box flexDirection="column">
			<Gradient name="vice">
				<BigText text="Wishlist CLI" />
			</Gradient>
			{currentStep === 'home' && <Home />}
			{currentStep === 'detail' && <Detail />}
		</Box>
	);
}
