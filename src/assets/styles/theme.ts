const scale = {
	spacing: {
		xs: '0.25rem',
		sm: '0.5rem',
		md: '0.75rem',
		lg: '1rem',
		xl: '1.5rem',
	},
	fontSizes: {
		xs: '0.75rem',
		sm: '0.875rem',
		md: '1rem',
		lg: '1.125rem',
	},
	radii: {
		sm: '4px',
		md: '8px',
	},
} as const;

export const lightTheme = {
	...scale,
	colors: {
		background: '#ffffff',
		surface: '#f5f6f8',
		surfaceRaised: '#ffffff',
		border: '#d5d7dd',
		borderStrong: '#b4b7c0',
		text: '#16171c',
		textMuted: '#5f6470',
		accent: '#2f5bd4',
		accentSurface: '#e7edfc',
		onAccent: '#ffffff',
		danger: '#b3261e',
		dangerSurface: '#fce8e6',
		onDanger: '#ffffff',
		warning: '#8a5a00',
		warningSurface: '#fdf0d5',
		backdrop: 'rgba(22, 23, 28, 0.45)',
	},
};

export type AppTheme = typeof lightTheme;
