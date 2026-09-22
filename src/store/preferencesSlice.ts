import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { DEFAULT_PREFERENCES } from '@/utils/constants';
import { loadPreferences } from '@/utils/helpers';

function createInitialState(): PreferencesState {
	return loadPreferences() ?? DEFAULT_PREFERENCES;
}

const preferencesSlice = createSlice({
	name: 'preferences',
	initialState: createInitialState,
	reducers: {
		viewModeChanged(state, action: PayloadAction<WorkspaceViewMode>) {
			state.viewMode = action.payload;
		},

		iconSizeChanged(state, action: PayloadAction<WorkspaceIconSize>) {
			state.iconSize = action.payload;
		},

		colorSchemeChanged(state, action: PayloadAction<ColorSchemePreference>) {
			state.colorScheme = action.payload;
		},
	},
});

export const { viewModeChanged, iconSizeChanged, colorSchemeChanged } = preferencesSlice.actions;

export default preferencesSlice;
