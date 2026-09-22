import { Provider } from 'react-redux';
import { AppThemeProvider } from '@/components/providers/AppThemeProvider';
import { Workspace } from '@/containers/Workspace';
import { store } from '@/store';

export default function App() {
	return (
		<Provider store={store}>
			<AppThemeProvider>
				<Workspace />
			</AppThemeProvider>
		</Provider>
	);
}
