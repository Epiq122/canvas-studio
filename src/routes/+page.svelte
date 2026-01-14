<script lang="ts">
	import ActivityLog from '$lib/components/ActivityLog.svelte';
	import CanvasPosterDesigner from '$lib/components/CanvasPosterDesigner.svelte';
	import FilterPanel from '$lib/components/FilterPanel.svelte';
	import MovieListDisplay from '$lib/components/MovieListDisplay.svelte';
	import MovieManager from '$lib/components/MovieManager.svelte';
	import PreferencesPanel from '$lib/components/PreferencesPanel.svelte';
	import StatsPanel from '$lib/components/StatsPanel.svelte';
	import StudioProvider from '$lib/components/StudioProvider.svelte';
</script>

<svelte:head>
	<title>FilmFlow Studio</title>
</svelte:head>

<StudioProvider>
	<div data-theme="synthwave" class="min-h-screen bg-base-200">
		<!-- PAGE CONTAINER -->
		<div
			class="
				mx-auto
				max-w-360
				space-y-10
				px-6
				py-10
			"
		>
			<!-- HEADER / HERO -->
			<header class="space-y-4">
				<p class="text-xs tracking-[0.4em] text-primary/70 uppercase">Canvas Studio</p>

				<h1 class="text-4xl font-semibold tracking-tight">FilmFlow Studio</h1>

				<p class="max-w-2xl text-base-content/70">
					Canvas poster designer + multi-widget dashboard for your movie workflow.
				</p>
			</header>

			<!-- STATS STRIP -->
			<section>
				<StatsPanel />
			</section>

			<!-- MAIN DASHBOARD -->
			<section
				class="
					grid
					items-start
					gap-8
					lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]
				"
			>
				<!-- PRIMARY COLUMN -->
				<div class="space-y-8">
					<FilterPanel />
					<PreferencesPanel />
					<MovieManager />
				</div>

				<!-- SECONDARY COLUMN -->
				<aside class="space-y-8">
					<CanvasPosterDesigner />
					<ActivityLog />
				</aside>
			</section>

			<!-- MOVIE LIST (FULL WIDTH AGAIN) -->
			<section>
				<MovieListDisplay />
			</section>
		</div>
	</div>
</StudioProvider>
