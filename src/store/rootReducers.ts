import { combineReducers } from '@reduxjs/toolkit';
import workspaceSlice from './workspaceSlice';

export default combineReducers({
	workspace: workspaceSlice.reducer,
});
