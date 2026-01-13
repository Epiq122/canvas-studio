import { getContext, setContext } from 'svelte';
import type { StudioModel } from './studio.model.svelte';

const STUDIO_KEY = Symbol('studio');

export function provideStudio(model: StudioModel) {
	setContext(STUDIO_KEY, model);
}

export function useStudio(): StudioModel {
	const model = getContext<StudioModel>(STUDIO_KEY);

	if (!model) {
		throw new Error(
			'useStudio() must be called within <StudioProvider>. ' +
				'Wrap your components with <StudioProvider> at a parent level.'
		);
	}
	return model;
}
