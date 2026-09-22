export function resolveColorScheme(
	preference: ColorSchemePreference,
	systemPrefersDark: boolean
): 'light' | 'dark' {
	if (preference === 'system') {
		return systemPrefersDark ? 'dark' : 'light';
	}

	return preference;
}
