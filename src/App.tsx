import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from '@/assets/styles/GlobalStyle';
import { lightTheme } from '@/assets/styles/theme';
import { Workspace } from '@/containers/Workspace';
import { store } from '@/store';

export default function App() {
	return (
		<Provider store={store}>
			<ThemeProvider theme={lightTheme}>
				<GlobalStyle />
				<Workspace />
			</ThemeProvider>
		</Provider>
	);
}
