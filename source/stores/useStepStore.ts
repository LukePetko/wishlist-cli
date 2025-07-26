import {create} from 'zustand';

type CurrentStep = 'home';

type StepState = {
	currentStep: CurrentStep;
};

type StepActions = {
	setStep: (currentStep: CurrentStep) => void;
};

const initialState: StepState = {
	currentStep: 'home',
};

const useStepStore = create<StepState & StepActions>(set => ({
	...initialState,
	setStep: (currentStep: CurrentStep) => set({currentStep}),
}));

export default useStepStore;
