<script lang="ts">
	import { useStudio } from '$lib/studio/studio.context';
	import type { MovieFormData } from '$lib/studio/types';
	import { Plus } from 'lucide-svelte';

	const studio = useStudio();

	let formData = $state<MovieFormData>({
		title: '',
		year: new Date().getFullYear(),
		rating: 3,
		status: 'queue',
		tags: [],
		notes: ''
	});

	let tagInput = $state('');

	function addTag() {
		const tag = tagInput.trim().toLowerCase();
		if (tag && !formData.tags.includes(tag)) {
			formData.tags = [...formData.tags, tag];
			tagInput = '';
		}
	}

	function removeTag(tag: string) {
		formData.tags = formData.tags.filter((t) => t !== tag);
	}

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		if (!formData.title.trim()) return;

		studio.addMovie(formData);

		// reset it
		formData = {
			title: '',
			year: new Date().getFullYear(),
			rating: 3,
			status: 'queue',
			tags: [],
			notes: ''
		};
	}
</script>

<section
	data-theme="synthwave"
	class="card relative overflow-hidden border-2 border-fuchsia-500/50 bg-linear-to-br from-slate-900 via-purple-950 to-slate-900 shadow-[0_0_30px_rgba(236,72,153,0.3)]"
>
	<!-- Neon grid background effect -->
	<div
		class="pointer-events-none absolute inset-0 opacity-10"
		style="background-image: linear-gradient(rgba(236, 72, 153, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(236, 72, 153, 0.3) 1px, transparent 1px); background-size: 40px 40px;"
	></div>

	<div class="relative z-10 card-body">
		<h2
			class="card-title bg-linear-to-r from-fuchsia-400 via-pink-500 to-cyan-400 bg-clip-text text-2xl font-bold tracking-wider text-transparent drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]"
		>
			🎬 Add Movie
		</h2>

		<form onsubmit={handleSubmit} class="space-y-4">
			<label class="form-control">
				<div class="label">
					<span class="label-text font-semibold tracking-wide text-fuchsia-300">Title</span>
				</div>
				<input
					type="text"
					class="input-bordered input border-fuchsia-500/50 bg-slate-900/80 text-cyan-100 placeholder-fuchsia-300/50 transition-all duration-300 focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.4)] focus:outline-none"
					bind:value={formData.title}
					placeholder="Enter movie title..."
					required
				/>
			</label>

			<div class="grid grid-cols-2 gap-4">
				<label class="form-control">
					<div class="label">
						<span class="label-text font-semibold tracking-wide text-fuchsia-300">Year</span>
					</div>
					<input
						type="number"
						class="input-bordered input border-fuchsia-500/50 bg-slate-900/80 text-cyan-100 transition-all duration-300 focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.4)] focus:outline-none"
						bind:value={formData.year}
						min="1888"
						max={new Date().getFullYear() + 5}
					/>
				</label>

				<label class="form-control">
					<div class="label">
						<span class="label-text font-semibold tracking-wide text-fuchsia-300">Status</span>
					</div>
					<select
						class="select-bordered select border-fuchsia-500/50 bg-slate-900/80 text-cyan-100 transition-all duration-300 focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.4)] focus:outline-none"
						bind:value={formData.status}
					>
						<option value="queue">📋 Queue</option>
						<option value="watching">👁️ Watching</option>
						<option value="watched">✅ Watched</option>
					</select>
				</label>
			</div>

			<label class="form-control">
				<div class="label">
					<span class="label-text font-semibold tracking-wide text-fuchsia-300"
						>Rating: <span class="text-cyan-400">{formData.rating}/5</span> ⭐</span
					>
				</div>
				<input
					type="range"
					min="1"
					max="5"
					bind:value={formData.rating}
					class="range range-primary [--range-shdw:var(--color-fuchsia-500)]"
				/>
				<div class="flex w-full justify-between px-2 text-xs text-fuchsia-400/70">
					<span>1</span>
					<span>2</span>
					<span>3</span>
					<span>4</span>
					<span>5</span>
				</div>
			</label>

			<label class="form-control">
				<div class="label">
					<span class="label-text font-semibold tracking-wide text-fuchsia-300">Tags</span>
				</div>
				<div class="join w-full">
					<input
						type="text"
						bind:value={tagInput}
						placeholder="Add a tag..."
						onkeypress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
						class="input-bordered input join-item flex-1 border-fuchsia-500/50 bg-slate-900/80 text-cyan-100 placeholder-fuchsia-300/50 transition-all duration-300 focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.4)] focus:outline-none"
					/>
					<button
						type="button"
						class="btn join-item border-none bg-linear-to-r from-fuchsia-600 to-pink-600 text-white shadow-[0_0_15px_rgba(236,72,153,0.5)] transition-all duration-300 hover:from-fuchsia-500 hover:to-pink-500 hover:shadow-[0_0_25px_rgba(236,72,153,0.7)]"
						onclick={addTag}>Add</button
					>
				</div>
				{#if formData.tags.length > 0}
					<div class="mt-3 flex flex-wrap gap-2">
						{#each formData.tags as tag}
							<button
								type="button"
								class="badge gap-2 border-none bg-linear-to-r from-cyan-500 to-fuchsia-500 badge-lg text-white shadow-[0_0_10px_rgba(34,211,238,0.5)] transition-all duration-300 hover:shadow-[0_0_20px_rgba(236,72,153,0.7)]"
								onclick={() => removeTag(tag)}
							>
								{tag}
								<span class="text-xs opacity-70">✕</span>
							</button>
						{/each}
					</div>
				{/if}
			</label>

			<label class="form-control">
				<div class="label">
					<span class="label-text font-semibold tracking-wide text-fuchsia-300">Notes</span>
				</div>
				<textarea
					rows="3"
					bind:value={formData.notes}
					class="textarea-bordered textarea border-fuchsia-500/50 bg-slate-900/80 text-cyan-100 placeholder-fuchsia-300/50 transition-all duration-300 focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(34,211,238,0.4)] focus:outline-none"
					placeholder="Optional notes..."
				></textarea>
			</label>

			<button
				type="submit"
				class="btn mt-2 w-full gap-2 border-none bg-linear-to-r from-fuchsia-600 via-pink-600 to-purple-600 text-lg font-bold tracking-wider text-white shadow-[0_0_30px_rgba(236,72,153,0.5)] transition-all duration-300 btn-lg hover:from-fuchsia-500 hover:via-pink-500 hover:to-purple-500 hover:shadow-[0_0_40px_rgba(236,72,153,0.8)]"
			>
				<Plus size={20} />
				Add Movie
			</button>
		</form>
	</div>
</section>
