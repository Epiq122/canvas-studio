import { createSubscriber } from 'svelte/reactivity';

export function createPersistedState<T>(key: string, initial: T) {
	function load(): T {
		if (typeof window === 'undefined') return initial;

		try {
			const stored = localStorage.getItem(key);
			return stored ? JSON.parse(stored) : initial;
		} catch {
			return initial;
		}
	}

	let value = $state<T>(load());

	const storageSync = createSubscriber((update) => {
		function handleStorage(e: StorageEvent) {
			if (e.key === key) {
				update();
			}
		}

		window.addEventListener('storage', handleStorage);
		return () => window.removeEventListener('storage', handleStorage);
	});

	// save to local storage when the value changes
	$effect(() => {
		try {
			localStorage.setItem(key, JSON.stringify(value));
		} catch (error) {
			console.log(`Failed to persist: ${key}: `, error);
		}
	});

	// can read and write
	return {
		get value() {
			if (typeof window !== 'undefined') {
				storageSync();
			}
			return value;
		},
		set value(newValue: T) {
			value = newValue;
		}
	};
}
