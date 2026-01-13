<script lang="ts">
	import { useStudio } from '$lib/studio/studio.context';

	const studio = useStudio();
	const filters = studio.filters;
</script>

<section
	data-theme="synthwave"
	class="card relative overflow-hidden border-2 border-cyan-500/50 bg-linear-to-br from-slate-900 via-purple-950 to-slate-900 shadow-[0_0_25px_rgba(34,211,238,0.3)]"
>
	<!-- Neon grid background effect -->
	<div
		class="pointer-events-none absolute inset-0 opacity-10"
		style="background-image: linear-gradient(rgba(34, 211, 238, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.3) 1px, transparent 1px); background-size: 40px 40px;"
	></div>

	<div class="relative z-10 card-body">
		<h2
			class="card-title bg-linear-to-r from-cyan-400 via-blue-400 to-fuchsia-400 bg-clip-text text-xl font-bold tracking-wider text-transparent"
		>
			🔍 Filters
		</h2>

		<div class="grid gap-4 sm:grid-cols-2">
			<label class="form-control">
				<div class="label">
					<span class="label-text font-semibold tracking-wide text-cyan-300">Search</span>
				</div>
				<input
					class="input-bordered input border-cyan-500/50 bg-slate-900/80 text-cyan-100 placeholder-cyan-300/50 transition-all duration-300 focus:border-fuchsia-400 focus:shadow-[0_0_15px_rgba(236,72,153,0.4)] focus:outline-none"
					placeholder="Title or tags..."
					bind:value={filters.search.value}
				/>
			</label>

			<label class="form-control">
				<div class="label">
					<span class="label-text font-semibold tracking-wide text-cyan-300">Status</span>
				</div>
				<select
					class="select-bordered select border-cyan-500/50 bg-slate-900/80 text-cyan-100 transition-all duration-300 focus:border-fuchsia-400 focus:shadow-[0_0_15px_rgba(236,72,153,0.4)] focus:outline-none"
					bind:value={filters.status.value}
				>
					<option value="all"> All Movies</option>
					<option value="queue">Queue</option>
					<option value="watching"> Watching</option>
					<option value="watched">Watched</option>
				</select>
			</label>
		</div>
	</div>
</section>
