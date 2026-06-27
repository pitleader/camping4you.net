/**
 * Theme state — 'light' | 'dark', persisted to localStorage. The pre-paint
 * resolver in app.html sets the initial `data-theme` before this runs (no
 * flash); this module owns runtime toggling. Client-only by construction.
 */
type Theme = 'light' | 'dark';

function read(): Theme {
	if (typeof document === 'undefined') return 'dark';
	const attr = document.documentElement.getAttribute('data-theme');
	return attr === 'light' ? 'light' : 'dark';
}

function createTheme() {
	let value = $state<Theme>(read());

	return {
		get value() {
			return value;
		},
		toggle() {
			value = value === 'dark' ? 'light' : 'dark';
			document.documentElement.setAttribute('data-theme', value);
			try {
				localStorage.setItem('theme', value);
			} catch {
				/* private mode — non-fatal */
			}
		}
	};
}

export const theme = createTheme();
