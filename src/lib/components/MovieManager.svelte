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
	class="
		card
		border border-fuchsia-500/40
		bg-base-200
		shadow-[0_0_30px_rgba(236,72,153,0.25)]
	"
>
	<div class="card-body">
		<h2
			class="
				mb-2
				card-title
				bg-linear-to-r
				from-fuchsia-400
				via-pink-500
				to-cyan-400
				bg-clip-text
				text-2xl
				font-bold
				text-transparent
			"
		>
			Add Movie
		</h2>

		<form
			onsubmit={handleSubmit}
			class="
				grid
				grid-cols-1
				gap-6
				lg:grid-cols-2
			"
		>
			<!-- TITLE -->
			<label class="form-control lg:col-span-2">
				<div class="label">
					<span class="label-text text-fuchsia-300">Title</span>
				</div>
				<input
					type="text"
					class="input-bordered input bg-base-300"
					bind:value={formData.title}
					placeholder="Enter movie title…"
					required
				/>
			</label>

			<!-- YEAR -->
			<label class="form-control">
				<div class="label">
					<span class="label-text text-fuchsia-300">Year</span>
				</div>
				<input
					type="number"
					class="input-bordered input bg-base-300"
					bind:value={formData.year}
					min="1888"
					max={new Date().getFullYear() + 5}
				/>
			</label>

			<!-- STATUS -->
			<label class="form-control">
				<div class="label">
					<span class="label-text text-fuchsia-300">Status</span>
				</div>
				<select class="select-bordered select bg-base-300" bind:value={formData.status}>
					<option value="queue">Queue</option>
					<option value="watching">Watching</option>
					<option value="watched">Watched</option>
				</select>
			</label>

			<!-- RATING -->
			<label class="form-control lg:col-span-2">
				<div class="label">
					<span class="label-text text-fuchsia-300">
						Rating:
						<span class="text-cyan-400">{formData.rating}/5</span>
					</span>
				</div>

				<div class="mx-auto w-full max-w-sm">
					<input
						type="range"
						min="1"
						max="5"
						step="1"
						bind:value={formData.rating}
						class="range range-primary"
					/>

					<div
						class="
							mt-1
							grid
							grid-cols-5
							text-center
							text-xs
							text-fuchsia-400/70
						"
					>
						<span>1</span>
						<span>2</span>
						<span>3</span>
						<span>4</span>
						<span>5</span>
					</div>
				</div>
			</label>

			<!-- TAGS -->
			<label class="form-control lg:col-span-2">
				<div class="label">
					<span class="label-text text-fuchsia-300">Tags</span>
				</div>

				<div class="join w-full">
					<input
						type="text"
						class="input-bordered input join-item flex-1 bg-base-300"
						bind:value={tagInput}
						placeholder="Add a tag…"
						onkeypress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
					/>
					<button type="button" class="btn join-item btn-primary" onclick={addTag}> Add </button>
				</div>

				{#if formData.tags.length > 0}
					<div class="mt-2 flex flex-wrap gap-2">
						{#each formData.tags as tag}
							<button
								type="button"
								class="badge gap-1 badge-primary"
								onclick={() => removeTag(tag)}
							>
								{tag}
								<span class="text-xs">✕</span>
							</button>
						{/each}
					</div>
				{/if}
			</label>

			<!-- NOTES -->
			<label class="form-control lg:col-span-2">
				<div class="label">
					<span class="label-text text-fuchsia-300">Notes</span>
				</div>
				<textarea
					rows="3"
					class="textarea-bordered textarea bg-base-300"
					bind:value={formData.notes}
					placeholder="Optional notes…"
				></textarea>
			</label>

			<!-- SUBMIT -->
			<button type="submit" class="btn w-full gap-2 btn-lg btn-primary lg:col-span-2">
				<Plus size={18} />
				Add Movie
			</button>
		</form>
	</div>
</section>
