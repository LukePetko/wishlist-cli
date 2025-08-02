import {create} from 'zustand';

export type CurrentStep = 'home' | 'detail' | 'edit' | 'add' | 'add-store';

type StepState = {
	currentStep: CurrentStep;
	selectedId?: string | undefined;
};

type StepActions = {
	setStep: (currentStep: CurrentStep) => void;
	setSelectedId: (selectedId: string | undefined) => void;
};

const initialState: StepState = {
	currentStep: 'home',
	selectedId: undefined,
};

const useStepStore = create<StepState & StepActions>(set => ({
	...initialState,
	setStep: (currentStep: CurrentStep) => set({currentStep}),
	setSelectedId: (selectedId: string | undefined) => set({selectedId}),
}));

export default useStepStore;
