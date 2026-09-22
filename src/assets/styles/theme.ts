type ThemeScheme = 'light' | 'dark';

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

	iconSizes: {
		listSmall: '1.125rem',
		listLarge: '1.75rem',
		gridSmall: '2.25rem',
		gridLarge: '3.5rem',
	},
	radii: {
		sm: '4px',
		md: '8px',
	},

	compactBreakpoint: '48rem',
} as const;

export const lightTheme = {
	...scale,
	scheme: 'light' as ThemeScheme,
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

	iconTones: {
		folder: '#f0b445',
		folderOpen: '#d9962a',
		fileText: '#4a90d9',
		fileMarkdown: '#8b5cf6',
		fileData: '#e8833a',
		fileSheet: '#3fa66a',
		fileLog: '#8a94a6',
		fileGeneric: '#6b7686',
		fileEmpty: '#aab2c0',
		preview: '#4a90d9',
		edit: '#3fa66a',
		rename: '#8b5cf6',
		delete: '#d9534f',
		newFolder: '#f0b445',
		newFile: '#4a90d9',
		save: '#3fa66a',
		discard: '#e8833a',
		search: '#4a90d9',
		neutral: '#6b7686',
	},
	shadows: {
		menu: '0 8px 24px rgba(22, 23, 28, 0.18)',
	},
};

export type AppTheme = typeof lightTheme;

export const darkTheme: AppTheme = {
	...scale,
	scheme: 'dark',
	colors: {
		background: '#14161a',
		surface: '#1b1e24',
		surfaceRaised: '#22262e',
		border: '#333944',
		borderStrong: '#4a515f',
		text: '#e7e9ee',
		textMuted: '#a0a7b4',
		accent: '#7aa2f7',
		accentSurface: '#25304a',
		onAccent: '#12151b',
		danger: '#f2756a',
		dangerSurface: '#3a2422',
		onDanger: '#12151b',
		warning: '#e0b062',
		warningSurface: '#3a2f1c',
		backdrop: 'rgba(5, 6, 8, 0.62)',
	},
	iconTones: {
		folder: '#f2b757',
		folderOpen: '#e0a03a',
		fileText: '#6aa6ef',
		fileMarkdown: '#a98bf5',
		fileData: '#f09553',
		fileSheet: '#59bd85',
		fileLog: '#9aa3b2',
		fileGeneric: '#8b95a5',
		fileEmpty: '#6b7381',
		preview: '#6aa6ef',
		edit: '#59bd85',
		rename: '#a98bf5',
		delete: '#f2756a',
		newFolder: '#f2b757',
		newFile: '#6aa6ef',
		save: '#59bd85',
		discard: '#f09553',
		search: '#6aa6ef',
		neutral: '#a0a7b4',
	},
	shadows: {
		menu: '0 10px 28px rgba(0, 0, 0, 0.5)',
	},
};
