<script lang="ts">
	import { createCanvasModel } from '$lib/canvas/canvas.model.svelte';
	import type { Point, Tool } from '$lib/canvas/types';
	import { Download, Eraser, Pencil, Redo2, Square, Trash2, Undo2 } from 'lucide-svelte';

	const model = createCanvasModel();

	let canvasEl: HTMLCanvasElement | null = null;
	let canvasWrapEl: HTMLDivElement | null = null;
	let ctx: CanvasRenderingContext2D | null = null;
	let isDrawing = $state(false);
	let startPoint = $state<Point | null>(null);
	let baseImage = $state<ImageData | null>(null);
	let canvasWidth = $state(900);
	let canvasHeight = $state(520);
	let isPopout = $state(false);
	let layoutMode = $state<'split' | 'stacked'>('split');
	let isStacked = $derived(isPopout || layoutMode === 'stacked');

	const tools: Array<{ id: Tool; label: string; icon: typeof Pencil }> = [
		{ id: 'brush', label: 'Brush', icon: Pencil },
		{ id: 'eraser', label: 'Eraser', icon: Eraser },
		{ id: 'line', label: 'Line', icon: Pencil },
		{ id: 'rect', label: 'Rect', icon: Square },
		{ id: 'ellipse', label: 'Ellipse', icon: Square }
	];

	function drawSnapshot(snapshot: string) {
		if (!ctx || !canvasEl) return;
		const img = new Image();
		img.onload = () => {
			if (!ctx || !canvasEl) return;
			ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
			ctx.drawImage(img, 0, 0, canvasEl.width, canvasEl.height);
		};
		img.src = snapshot;
	}

	$effect(() => {
		if (!canvasEl) return;
		ctx = canvasEl.getContext('2d');
		if (!ctx) return;
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';
	});

	$effect(() => {
		if (!canvasWrapEl || !canvasEl) return;

		const updateSize = () => {
			const width = Math.max(1, Math.floor(canvasWrapEl?.clientWidth ?? 0));
			const heightFromViewport = Math.floor(window.innerHeight * 0.6);
			const heightFromWidth = Math.floor(width * 0.6);
			const height = Math.max(520, heightFromViewport, heightFromWidth);

			canvasWidth = width;
			canvasHeight = height;
			canvasEl.width = width;
			canvasEl.height = height;

			if (ctx && model.currentSnapshot) {
				drawSnapshot(model.currentSnapshot);
			}
		};

		updateSize();

		const observer = new ResizeObserver(() => updateSize());
		observer.observe(canvasWrapEl);
		window.addEventListener('resize', updateSize);

		return () => {
			observer.disconnect();
			window.removeEventListener('resize', updateSize);
		};
	});

	$effect(() => {
		if (!ctx || !canvasEl) return;
		if (model.history.length > 0) return;
		ctx.fillStyle = '#ffffff';
		ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);
		model.pushSnapshot(canvasEl.toDataURL('image/png'));
	});

	$effect(() => {
		if (!ctx || !canvasEl) return;
		const snapshot = model.currentSnapshot;
		if (!snapshot) return;
		drawSnapshot(snapshot);
	});

	function getPoint(event: MouseEvent): Point {
		const rect = canvasEl?.getBoundingClientRect();
		if (!rect) return { x: 0, y: 0 };
		return { x: event.clientX - rect.left, y: event.clientY - rect.top };
	}

	function beginFreehand(point: Point) {
		if (!ctx) return;
		ctx.lineWidth = model.size;
		ctx.strokeStyle = model.tool === 'eraser' ? '#000000' : model.color;
		ctx.globalCompositeOperation = model.tool === 'eraser' ? 'destination-out' : 'source-over';
		ctx.beginPath();
		ctx.moveTo(point.x, point.y);
		ctx.lineTo(point.x, point.y);
		ctx.stroke();
	}

	function drawFreehand(point: Point) {
		if (!ctx) return;
		ctx.lineTo(point.x, point.y);
		ctx.stroke();
	}

	function drawShape(current: Point) {
		if (!ctx || !canvasEl || !startPoint || !baseImage) return;
		ctx.putImageData(baseImage, 0, 0);
		ctx.strokeStyle = model.color;
		ctx.lineWidth = model.size;
		ctx.globalCompositeOperation = 'source-over';

		const x = Math.min(startPoint.x, current.x);
		const y = Math.min(startPoint.y, current.y);
		const w = Math.abs(startPoint.x - current.x);
		const h = Math.abs(startPoint.y - current.y);

		switch (model.tool) {
			case 'line':
				ctx.beginPath();
				ctx.moveTo(startPoint.x, startPoint.y);
				ctx.lineTo(current.x, current.y);
				ctx.stroke();
				break;
			case 'rect':
				ctx.strokeRect(x, y, w, h);
				break;
			case 'ellipse':
				ctx.beginPath();
				ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
				ctx.stroke();
				break;
		}
	}

	function handlePointerDown(event: MouseEvent) {
		if (!ctx || !canvasEl) return;
		isDrawing = true;

		const point = getPoint(event);
		startPoint = point;

		if (model.tool === 'brush' || model.tool === 'eraser') {
			beginFreehand(point);
			return;
		}

		baseImage = ctx.getImageData(0, 0, canvasEl.width, canvasEl.height);
	}

	function handlePointerMove(event: MouseEvent) {
		if (!isDrawing || !ctx) return;
		const point = getPoint(event);

		if (model.tool === 'brush' || model.tool === 'eraser') {
			drawFreehand(point);
			return;
		}

		drawShape(point);
	}

	function handlePointerUp(event?: MouseEvent) {
		if (!canvasEl || !ctx) return;
		if (!isDrawing) return;

		isDrawing = false;

		if (model.tool !== 'brush' && model.tool !== 'eraser' && startPoint) {
			const point = event ? getPoint(event) : startPoint;
			drawShape(point);
		}

		startPoint = null;
		baseImage = null;

		model.pushSnapshot(canvasEl.toDataURL('image/png'));
		ctx.globalCompositeOperation = 'source-over';
	}

	function handleUndo() {
		model.undo();
	}

	function handleRedo() {
		model.redo();
	}

	function handleClear() {
		if (!ctx || !canvasEl) return;
		ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
		ctx.fillStyle = '#ffffff';
		ctx.fillRect(0, 0, canvasEl.width, canvasEl.height);
		model.clear();
		model.pushSnapshot(canvasEl.toDataURL('image/png'));
	}

	function handleExport() {
		if (!canvasEl) return;
		const link = document.createElement('a');
		link.download = 'filmflow-poster.png';
		link.href = canvasEl.toDataURL('image/png');
		link.click();
	}

	function setTool(tool: Tool) {
		model.tool = tool;
	}

	function togglePopout() {
		isPopout = !isPopout;
	}
</script>

{#if isPopout}
	<div class="fixed inset-0 z-40 bg-base-300/70 backdrop-blur-sm" on:click={togglePopout}></div>
{/if}

<section
	data-theme="synthwave"
	class={`card border border-base-300 bg-base-100 shadow-sm ${isPopout ? 'fixed inset-6 z-50 max-h-[calc(100vh-3rem)] overflow-auto shadow-2xl' : ''}`}
>
	<div class="card-body space-y-4">
		<div class="flex flex-wrap items-center justify-between gap-3">
			<h2 class="card-title">Canvas Poster Designer</h2>
			<div class="flex flex-wrap items-center gap-2">
				<div class="join">
					<button
						class="btn btn-sm join-item {isStacked ? 'btn-primary' : 'btn-ghost'}"
						on:click={() => (layoutMode = 'stacked')}
					>
						Stack
					</button>
					<button
						class="btn btn-sm join-item {!isStacked ? 'btn-primary' : 'btn-ghost'}"
						on:click={() => (layoutMode = 'split')}
					>
						Split
					</button>
				</div>
				<button class="btn btn-sm btn-outline" on:click={togglePopout}>
					{isPopout ? 'Close' : 'Pop out'}
				</button>
			</div>
		</div>

		<div class="flex flex-wrap items-center gap-2">
			<button class="btn btn-sm" disabled={!model.canUndo} on:click={handleUndo}>
				<Undo2 size={16} />
				Undo
			</button>
			<button class="btn btn-sm" disabled={!model.canRedo} on:click={handleRedo}>
				<Redo2 size={16} />
				Redo
			</button>
			<button class="btn btn-outline btn-sm" on:click={handleClear}>
				<Trash2 size={16} />
				Clear
			</button>
			<button class="btn btn-sm btn-primary" on:click={handleExport}>
				<Download size={16} />
				Export
			</button>
		</div>

		<div class={`grid gap-4 ${isStacked ? '' : 'lg:grid-cols-[1fr_auto]'}`}>
			<div bind:this={canvasWrapEl} class={`w-full ${isStacked ? 'order-2' : ''}`}>
				<canvas
					bind:this={canvasEl}
					width={canvasWidth}
					height={canvasHeight}
					class="w-full touch-none rounded-lg border border-base-300 bg-white shadow-inner"
					style:height={`${canvasHeight}px`}
					on:mousedown={handlePointerDown}
					on:mousemove={handlePointerMove}
					on:mouseup={handlePointerUp}
					on:mouseleave={() => handlePointerUp()}
				></canvas>
			</div>

			<div class={`space-y-4 ${isStacked ? 'order-1' : ''}`}>
				<div class="space-y-2">
					<p class="text-xs font-semibold tracking-[0.2em] text-base-content/60 uppercase">Tools</p>
					<div class="grid grid-cols-2 gap-2">
						{#each tools as tool}
							<button
								on:click={() => setTool(tool.id)}
								class="btn btn-sm {model.tool === tool.id ? 'btn-primary' : 'btn-ghost'}"
							>
								<svelte:component this={tool.icon} size={16} />
								{tool.label}
							</button>
						{/each}
					</div>
				</div>

				<label class="form-control gap-2">
					<span
						class="label-text text-xs font-semibold tracking-[0.2em] text-base-content/60 uppercase"
						>Color</span
					>
					<input type="color" bind:value={model.color} class="h-10 w-full cursor-pointer" />
				</label>

				<label class="form-control gap-2">
					<span
						class="label-text text-xs font-semibold tracking-[0.2em] text-base-content/60 uppercase"
						>Brush Size</span
					>
					<input type="range" min="2" max="30" bind:value={model.size} class="range" />
				</label>
			</div>
		</div>
	</div>
</section>
