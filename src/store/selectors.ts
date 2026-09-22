import { createSelector } from '@reduxjs/toolkit';
import { getChildren, getPath } from '@/utils/helpers';
import type { RootState } from '.';

export const selectItems = (state: RootState) => state.workspace.items;

export const selectRootId = (state: RootState) => state.workspace.rootId;

export const selectSelectedFolderId = (state: RootState) => state.workspace.selectedFolderId;

export const selectExpandedFolderIds = (state: RootState) => state.workspace.expandedFolderIds;

export const selectDialog = (state: RootState) => state.workspace.dialog;

export const selectFolderContents = createSelector(
	[selectItems, selectSelectedFolderId],
	(items, selectedFolderId) => getChildren(items, selectedFolderId)
);

export const selectBreadcrumbs = createSelector(
	[selectItems, selectSelectedFolderId],
	(items, selectedFolderId) => getPath(items, selectedFolderId)
);
