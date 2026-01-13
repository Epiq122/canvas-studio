/*! 🌼 daisyUI 5.5.14 */
export type MovieId = string;
export type MovieStatus = 'queue' | 'watching' | 'watched';

export interface Movie {
	id: MovieId;
	title: string;
	year: number;
	rating: number;
	status: MovieStatus;
	tags: string[];
	notes: string;
	createdAt: number;
	updatedAt: number;
}

export interface MovieFormData {
	title: string;
	year: number;
	rating: number;
	status: MovieStatus;
	tags: string[];
	notes: string;
}

export interface StudioPreferences {
	sortBy: 'newest' | 'oldest' | 'rating';
	theme: 'light' | 'dark';
	hideWatched: boolean;
}

export interface Activity {
	id: string;
	message: string;
	timestamp: number;
}
