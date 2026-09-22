import 'styled-components';
import type { AppTheme } from '@/assets/styles/theme';

declare module 'styled-components' {
	export interface DefaultTheme extends AppTheme {}
}
