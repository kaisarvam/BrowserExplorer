import { useEffect, useState } from 'react';

const DARK_SCHEME_QUERY = '(prefers-color-scheme: dark)';

function readSystemPreference(): boolean {
	return typeof window.matchMedia === 'function' && window.matchMedia(DARK_SCHEME_QUERY).matches;
}

export function useSystemPrefersDark(): boolean {
	const [prefersDark, setPrefersDark] = useState(readSystemPreference);

	useEffect(() => {
		if (typeof window.matchMedia !== 'function') {
			return;
		}

		const query = window.matchMedia(DARK_SCHEME_QUERY);

		function handleChange(event: MediaQueryListEvent) {
			setPrefersDark(event.matches);
		}

		query.addEventListener('change', handleChange);

		return () => query.removeEventListener('change', handleChange);
	}, []);

	return prefersDark;
}
