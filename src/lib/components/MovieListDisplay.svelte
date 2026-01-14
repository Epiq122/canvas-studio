<script lang="ts">
	import { useStudio } from '$lib/studio/studio.context';
	import { Trash2 } from 'lucide-svelte';

	const studio = useStudio();
	const movies = $derived.by(() => studio.movies.filtered);
</script>

<section
	data-theme="synthwave"
	class="card relative overflow-hidden border-2 border-teal-500/50 bg-linear-to-br from-slate-900 via-purple-950 to-slate-900 shadow-[0_0_25px_rgba(20,184,166,0.3)]"
>
	<!-- Neon grid background effect -->
	<div
		class="pointer-events-none absolute inset-0 opacity-10"
		style="background-image: linear-gradient(rgba(20, 184, 166, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(20, 184, 166, 0.3) 1px, transparent 1px); background-size: 40px 40px;"
	></div>

	<div class="relative z-10 card-body">
		<h2
			class="card-title bg-linear-to-r from-teal-400 via-cyan-400 to-fuchsia-400 bg-clip-text text-xl font-bold tracking-wider text-transparent"
		>
			Movies <span class="text-teal-400">({movies.length})</span>
		</h2>

		{#if movies.length === 0}
			<div
				class="rounded-xl border-2 border-dashed border-teal-500/30 bg-slate-900/50 p-6 text-center"
			>
				<p class="font-semibold text-teal-300">No movies found</p>
				<p class="text-sm text-teal-400/70">Try adjusting filters or add a movie</p>
			</div>
		{:else}
			<ul class="space-y-3">
				{#each movies as movie (movie.id)}
					<li
						class="rounded-xl border border-teal-500/30 bg-slate-900/60 p-4 transition-all duration-300 hover:border-teal-500/50 hover:shadow-[0_0_15px_rgba(20,184,166,0.2)]"
					>
						<div class="flex items-start justify-between gap-4">
							<div class="min-w-0 flex-1">
								<h3 class="truncate text-lg font-bold text-teal-100">{movie.title}</h3>
								<div class="mt-2 flex flex-wrap gap-2">
									<span
										class="badge border-none bg-slate-800 badge-sm text-teal-300 shadow-[0_0_8px_rgba(20,184,166,0.3)]"
										>{movie.year}</span
									>
									<span
										class="badge border-none bg-linear-to-r from-fuchsia-600 to-pink-600 badge-sm text-white shadow-[0_0_8px_rgba(236,72,153,0.4)]"
										>{movie.rating} stars</span
									>
									<span
										class="badge border-none badge-sm {movie.status === 'watched'
											? 'bg-emerald-600 text-white shadow-[0_0_8px_rgba(52,211,153,0.4)]'
											: movie.status === 'watching'
												? 'bg-cyan-600 text-white shadow-[0_0_8px_rgba(34,211,238,0.4)]'
												: 'bg-amber-600 text-white shadow-[0_0_8px_rgba(251,191,36,0.4)]'}"
									>
										{movie.status === 'watched'
											? 'Watched'
											: movie.status === 'watching'
												? 'Watching'
												: 'Queue'}
									</span>
								</div>
								{#if movie.tags.length > 0}
									<div class="mt-2 flex flex-wrap gap-1">
										{#each movie.tags as tag}
											<span
												class="badge border-none bg-linear-to-r from-violet-600/80 to-purple-600/80 badge-xs text-violet-100"
												>{tag}</span
											>
										{/each}
									</div>
								{/if}
								{#if movie.notes}
									<p class="mt-2 text-sm text-teal-300/70">{movie.notes}</p>
								{/if}
							</div>
							<button
								onclick={() => studio.removeMovie(movie.id)}
								class="btn border-none bg-linear-to-r from-red-600 to-rose-600 text-white shadow-[0_0_10px_rgba(239,68,68,0.4)] transition-all duration-300 btn-sm hover:from-red-500 hover:to-rose-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.6)]"
								><Trash2 size={14} /></button
							>
						</div>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</section>
