import { combineReducers } from '@reduxjs/toolkit';
import preferencesSlice from './preferencesSlice';
import workspaceSlice from './workspaceSlice';

export default combineReducers({
	workspace: workspaceSlice.reducer,
	preferences: preferencesSlice.reducer,
});
