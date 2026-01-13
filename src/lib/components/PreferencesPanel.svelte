<script lang="ts">
	import { useStudio } from '$lib/studio/studio.context';

	const studio = useStudio();
	const prefs = studio.prefs;
</script>

<section
	data-theme="synthwave"
	class="card relative overflow-hidden border-2 border-violet-500/50 bg-linear-to-br from-slate-900 via-purple-950 to-slate-900 shadow-[0_0_25px_rgba(139,92,246,0.3)]"
>
	<!-- Neon grid background effect -->
	<div
		class="pointer-events-none absolute inset-0 opacity-10"
		style="background-image: linear-gradient(rgba(139, 92, 246, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.3) 1px, transparent 1px); background-size: 40px 40px;"
	></div>

	<div class="relative z-10 card-body">
		<h2
			class="card-title bg-linear-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-xl font-bold tracking-wider text-transparent"
		>
			Preferences
		</h2>
		<p class="text-sm text-violet-300/70">Settings persist via localStorage</p>

		<div class="mt-2 grid gap-4 sm:grid-cols-2">
			<label class="form-control">
				<div class="label">
					<span class="label-text font-semibold tracking-wide text-violet-300">Sort By</span>
				</div>
				<select
					class="select-bordered select border-violet-500/50 bg-slate-900/80 text-violet-100 transition-all duration-300 focus:border-fuchsia-400 focus:shadow-[0_0_15px_rgba(236,72,153,0.4)] focus:outline-none"
					bind:value={prefs.value.sortBy}
				>
					<option value="newest">Newest First</option>
					<option value="oldest">Oldest First</option>
					<option value="rating">Highest Rated</option>
				</select>
			</label>

			<label class="form-control">
				<div class="label">
					<span class="label-text font-semibold tracking-wide text-violet-300">Theme</span>
				</div>
				<select
					class="select-bordered select border-violet-500/50 bg-slate-900/80 text-violet-100 transition-all duration-300 focus:border-fuchsia-400 focus:shadow-[0_0_15px_rgba(236,72,153,0.4)] focus:outline-none"
					bind:value={prefs.value.theme}
				>
					<option value="light">Light Theme</option>
					<option value="dark">Dark Theme</option>
				</select>
			</label>

			<label
				class="label cursor-pointer justify-start gap-3 rounded-lg border border-violet-500/30 bg-slate-900/50 px-4 transition-all duration-300 hover:border-violet-500/50 hover:shadow-[0_0_10px_rgba(139,92,246,0.3)]"
			>
				<input
					type="checkbox"
					class="checkbox border-violet-500/50 [--chkbg:var(--color-fuchsia-500)] [--chkfg:white]"
					bind:checked={prefs.value.hideWatched}
				/>
				<span class="label-text font-semibold tracking-wide text-violet-300"
					>Hide Watched Movies</span
				>
			</label>
		</div>
	</div>
</section>
