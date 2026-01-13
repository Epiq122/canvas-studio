<script lang="ts">
	import { useStudio } from '$lib/studio/studio.context';

	const studio = useStudio();
	const stats = studio.movies.stats;
</script>

<section data-theme="synthwave" class="grid grid-cols-2 gap-4 md:grid-cols-4">
	<div
		class="stat rounded-xl border-2 border-fuchsia-500/50 bg-linear-to-br from-slate-900 via-purple-950 to-slate-900 shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(236,72,153,0.5)]"
	>
		<div class="stat-title font-semibold tracking-wide text-fuchsia-300">🎬 Total</div>
		<div
			class="stat-value bg-linear-to-r from-fuchsia-400 to-pink-500 bg-clip-text text-3xl text-transparent"
		>
			{stats.total}
		</div>
	</div>

	<div
		class="stat rounded-xl border-2 border-emerald-500/50 bg-linear-to-br from-slate-900 via-emerald-950 to-slate-900 shadow-[0_0_20px_rgba(52,211,153,0.3)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(52,211,153,0.5)]"
	>
		<div class="stat-title font-semibold tracking-wide text-emerald-300">✅ Watched</div>
		<div
			class="stat-value bg-linear-to-r from-emerald-400 to-cyan-400 bg-clip-text text-3xl text-transparent"
		>
			{stats.watched}
		</div>
		<div class="stat-desc text-emerald-400/80">{Math.round(stats.completion * 100)}% complete</div>
	</div>

	<div
		class="stat rounded-xl border-2 border-cyan-500/50 bg-linear-to-br from-slate-900 via-cyan-950 to-slate-900 shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,211,238,0.5)]"
	>
		<div class="stat-title font-semibold tracking-wide text-cyan-300">👁️ Watching</div>
		<div
			class="stat-value bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-3xl text-transparent"
		>
			{stats.watching}
		</div>
	</div>

	<div
		class="stat rounded-xl border-2 border-amber-500/50 bg-linear-to-br from-slate-900 via-amber-950 to-slate-900 shadow-[0_0_20px_rgba(251,191,36,0.3)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(251,191,36,0.5)]"
	>
		<div class="stat-title font-semibold tracking-wide text-amber-300">⭐ Avg Rating</div>
		<div
			class="stat-value bg-linear-to-r from-amber-400 to-orange-400 bg-clip-text text-3xl text-transparent"
		>
			{stats.avgRating > 0 ? stats.avgRating.toFixed(1) : '-'}
		</div>
	</div>
</section>
