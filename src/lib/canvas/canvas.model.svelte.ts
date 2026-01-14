import type { Stroke, Tool, Point } from './types';

export function createCanvasModel() {
	let strokes = $state<Stroke[]>([]);
	let history = $state<string[]>([]);
	let historyIndex = $state(0);

	let tool = $state<Tool>('brush');
	let color = $state('#06b6d4');
	let size = $state(6);

	const canUndo = $derived(historyIndex > 0);
	const canRedo = $derived(historyIndex < history.length - 1);
	const currentSnapshot = $derived(history[historyIndex]);

	function startStroke(point: Point) {
		strokes = [{ tool, color, size, points: [point] }, ...strokes];
	}

	function appendPoint(point: Point) {
		const current = strokes[0];
		if (!current) return;
		current.points = [...current.points, point];
	}
	function pushSnapshot(dataUrl: string) {
		history = history.slice(0, historyIndex + 1);
		history.push(dataUrl);
		historyIndex = history.length - 1;
	}

	function undo() {
		if (historyIndex > 0) historyIndex -= 1;
	}

	function redo() {
		if (historyIndex < history.length - 1) historyIndex += 1;
	}

	function clear() {
		strokes = [];
		history = [];
		historyIndex = 0;
	}
	return {
		get strokes() {
			return strokes;
		},
		get history() {
			return history;
		},
		get historyIndex() {
			return historyIndex;
		},
		get tool() {
			return tool;
		},
		set tool(value: Tool) {
			tool = value;
		},
		get color() {
			return color;
		},
		set color(value: string) {
			color = value;
		},
		get size() {
			return size;
		},
		set size(value: number) {
			size = value;
		},
		get canUndo() {
			return canUndo;
		},
		get canRedo() {
			return canRedo;
		},
		get currentSnapshot() {
			return currentSnapshot;
		},
		startStroke,
		appendPoint,
		pushSnapshot,
		undo,
		redo,
		clear
	};
}
export type CanvasModel = ReturnType<typeof createCanvasModel>;
