<script lang="ts">
	/**
	 * Canvas poster designer UI.
	 *
	 * PATTERN:
	 * - Keep DOM refs local (canvas + context).
	 * - Use the model for state and history.
	 * - Save snapshots on stroke end, not every move.
	 */

	import { createCanvasModel } from '$lib/canvas/canvas.model.svelte';

	const model = createCanvasModel();

	let canvasEl: HTMLCanvasElement | null = null;
	let ctx: CanvasRenderingContext2D | null = null;
	let isDrawing = $state(false);

	$effect(() => {
		if (!canvasEl) return;
		ctx = canvasEl.getContext('2d');
	});

	function getPoint(event: PointerEvent) {
		const rect = canvasEl?.getBoundingClientRect();
		if (!rect) return { x: 0, y: 0 };
		return { x: event.clientX - rect.left, y: event.clientY - rect.top };
	}

	function handlePointerDown(event: PointerEvent) {
		if (!canvasEl) return;
		isDrawing = true;
		model.startStroke(getPoint(event));
	}

	function handlePointerMove(event: PointerEvent) {
		if (!isDrawing) return;
		model.appendPoint(getPoint(event));
	}

	function handlePointerUp() {
		isDrawing = false;
		// Save snapshot here (use canvasEl.toDataURL()).
	}
</script>

<section class="card border border-base-300 bg-base-100 shadow-sm">
	<div class="card-body space-y-3">
		<h2 class="card-title">Canvas Poster Designer</h2>

		<div class="grid gap-3 md:grid-cols-[1fr_auto]">
			<canvas
				bind:this={canvasEl}
				width="720"
				height="420"
				class="w-full rounded-lg border border-base-300 bg-white"
				onpointerdown={handlePointerDown}
				onpointermove={handlePointerMove}
				onpointerup={handlePointerUp}
				onpointerleave={handlePointerUp}
			></canvas>

			<div class="space-y-2">
				<button class="btn btn-sm">Undo</button>
				<button class="btn btn-sm">Redo</button>
				<button class="btn btn-outline btn-sm">Export</button>
			</div>
		</div>
	</div>
</section>
