import type { ReactNode } from 'react';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from '@/assets/styles/GlobalStyle';
import { darkTheme, lightTheme } from '@/assets/styles/theme';
import { useSystemPrefersDark } from '@/hooks';
import { useStoreSelector } from '@/store';
import { selectColorScheme } from '@/store/selectors';
import { resolveColorScheme } from '@/utils/helpers';

export function AppThemeProvider({ children }: { children: ReactNode }) {
	const colorScheme = useStoreSelector(selectColorScheme);
	const systemPrefersDark = useSystemPrefersDark();

	const resolved = resolveColorScheme(colorScheme, systemPrefersDark);

	return (
		<ThemeProvider theme={resolved === 'dark' ? darkTheme : lightTheme}>
			<GlobalStyle />
			{children}
		</ThemeProvider>
	);
}
