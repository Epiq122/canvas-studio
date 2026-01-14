<script lang="ts">
	import { useStudio } from '$lib/studio/studio.context';

	const studio = useStudio();

	function formatTime(ts: number): string {
		return new Date(ts).toLocaleTimeString();
	}
</script>

<section
	data-theme="synthwave"
	class="card relative overflow-hidden border-2 border-rose-500/50 bg-linear-to-br from-slate-900 via-purple-950 to-slate-900 shadow-[0_0_25px_rgba(244,63,94,0.3)]"
>
	<!-- Neon grid background effect -->
	<div
		class="pointer-events-none absolute inset-0 opacity-10"
		style="background-image: linear-gradient(rgba(244, 63, 94, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(244, 63, 94, 0.3) 1px, transparent 1px); background-size: 40px 40px;"
	></div>

	<div class="relative z-10 card-body">
		<h2
			class="card-title bg-linear-to-r from-rose-400 via-pink-400 to-fuchsia-400 bg-clip-text text-xl font-bold tracking-wider text-transparent"
		>
			Recent Activity
		</h2>

		<div class="max-h-64 space-y-2 overflow-y-auto pr-2">
			{#each studio.activities as activity (activity.id)}
				<div
					class="flex gap-3 rounded-lg border border-rose-500/20 bg-slate-900/50 px-3 py-2 text-sm transition-all duration-300 hover:border-rose-500/40 hover:shadow-[0_0_10px_rgba(244,63,94,0.2)]"
				>
					<span class="shrink-0 font-mono text-rose-400/70">{formatTime(activity.timestamp)}</span>
					<span class="text-rose-100">{activity.message}</span>
				</div>
			{/each}

			{#if studio.activities.length === 0}
				<p class="text-sm text-rose-300/70">No activity yet</p>
			{/if}
		</div>
	</div>
</section>
