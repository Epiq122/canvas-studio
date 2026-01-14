<script lang="ts">
	import { provideStudio } from '$lib/studio/studio.context';
	import { createStudioModel } from '$lib/studio/studio.model.svelte';

	// Svelte 5: components receive props explicitly
	const { children } = $props();

	// Create ONE model instance for this component tree
	const model = createStudioModel();

	// Inject model into context during setup
	provideStudio(model);
</script>

{@render children()}
