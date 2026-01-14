import { createPersistedState } from './persisted.svelte';
import type { Activity, StudioPreferences, Movie, MovieStatus, MovieFormData } from './types';

export function createStudioModel() {
	let movies = $state<Movie[]>([
		// seed data for demo
		{
			id: crypto.randomUUID(),
			title: 'Die Hard',
			year: 1988,
			rating: 5,
			status: 'watching',
			tags: ['action', 'thriller'],
			notes: 'Tense and endlessly rewatchable',
			createdAt: Date.now() - 86400000,
			updatedAt: Date.now()
		},
		{
			id: crypto.randomUUID(),
			title: 'Back to the Future',
			year: 1985,
			rating: 5,
			status: 'queue',
			tags: ['sci-fi', 'adventure', 'comedy'],
			notes: 'Perfect time-travel adventure',
			createdAt: Date.now() - 172800000,
			updatedAt: Date.now()
		}
	]);

	let activities = $state<Activity[]>([]);

	const prefs = createPersistedState<StudioPreferences>('studio-prefs', {
		sortBy: 'newest',
		theme: 'light',
		hideWatched: false
	});

	const filters = {
		search: {
			get value() {
				return filterSearch;
			},
			set value(v: string) {
				filterSearch = v;
			}
		},
		status: {
			get value() {
				return filterStatus;
			},
			set value(v: 'all' | MovieStatus) {
				filterStatus = v;
			}
		}
	};

	let filterSearch = $state('');
	let filterStatus = $state<'all' | 'queue' | 'watching' | 'watched'>('all');

	const filteredMovies = $derived.by(() => {
		let result = movies;
		if (filterSearch.trim()) {
			const query = filterSearch.toLowerCase();
			result = result.filter(
				(m) =>
					m.title.toLowerCase().includes(query) ||
					m.tags.some((t) => t.toLowerCase().includes(query))
			);
		}

		if (filterStatus !== 'all') {
			result = result.filter((m) => m.status === filterStatus);
		}
		if (prefs.value.hideWatched) {
			result = result.filter((m) => m.status !== 'watched');
		}

		result = [...result].sort((a, b) => {
			switch (prefs.value.sortBy) {
				case 'newest':
					return b.createdAt - a.createdAt;
				case 'oldest':
					return a.createdAt - b.createdAt;
				case 'rating':
					return b.rating - a.rating;
			}
		});
		return result;
	});

	// Statistics

	const stats = $derived.by(() => {
		const total = movies.length;
		const watched = movies.filter((m) => m.status === 'watched').length;
		const watching = movies.filter((m) => m.status === 'watching').length;
		const queue = movies.filter((m) => m.status === 'queue').length;

		const totalRated = movies.filter((m) => m.rating > 0).length;
		const sumRating = movies.reduce((sum, m) => sum + m.rating, 0);
		const avgRating = totalRated > 0 ? sumRating / totalRated : 0;

		const completion = total > 0 ? watched / total : 0;

		return {
			total,
			watched,
			watching,
			queue,
			avgRating,
			completion
		};
	});

	function logActivity(message: string) {
		activities.unshift({
			id: crypto.randomUUID(),
			message,
			timestamp: Date.now()
		});

		// capping to prevent memory leak
		if (activities.length > 50) {
			activities = activities.slice(0, 50);
		}
	}

	// add a new movie

	function addMovie(data: MovieFormData): Movie {
		const movie: Movie = {
			id: crypto.randomUUID(),
			...data,
			createdAt: Date.now(),
			updatedAt: Date.now()
		};
		movies.unshift(movie);
		logActivity(`Added "${movie.title}"`);
		return movie;
	}

	// updating movie
	function updateMovie(id: string, data: Partial<MovieFormData>): void {
		const movie = movies.find((m) => m.id === id);
		if (!movie) return;

		Object.assign(movie, data, { updatedAt: Date.now() });
		logActivity(`Updated "${movie.title}"`);
	}

	// remove a movie
	function removeMovie(id: string): void {
		const movie = movies.find((m) => m.id === id);
		if (!movie) return;

		movies = movies.filter((m) => m.id !== id);
		logActivity(`Removed "${movie.title}"`);
	}

	// public api

	return {
		movies: {
			all: () => movies,
			get filtered() {
				return filteredMovies;
			},
			get stats() {
				return stats;
			}
		},
		activities,
		prefs,
		filters,

		// the actions
		addMovie,
		updateMovie,
		removeMovie,
		logActivity
	};
}

export type StudioModel = ReturnType<typeof createStudioModel>;
