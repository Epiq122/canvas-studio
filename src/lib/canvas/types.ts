export type Tool = 'brush' | 'eraser' | 'rect' | 'ellipse' | 'line';

export interface Point {
	x: number;
	y: number;
}

export interface Stroke {
	tool: Tool;
	color: string;
	size: number;
	points: Point[];
}
