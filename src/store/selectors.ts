import { createSelector } from '@reduxjs/toolkit';
import { getChildren, getPath, searchItems } from '@/utils/helpers';
import type { RootState } from '.';

export const selectItems = (state: RootState) => state.workspace.items;

export const selectRootId = (state: RootState) => state.workspace.rootId;

export const selectSelectedFolderId = (state: RootState) => state.workspace.selectedFolderId;

export const selectOpenFileId = (state: RootState) => state.workspace.openFileId;

export const selectEditorDraft = (state: RootState) => state.workspace.editorDraft;

export const selectExpandedFolderIds = (state: RootState) => state.workspace.expandedFolderIds;

export const selectSearchQuery = (state: RootState) => state.workspace.searchQuery;

export const selectDialog = (state: RootState) => state.workspace.dialog;

export const selectFolderContents = createSelector(
	[selectItems, selectSelectedFolderId],
	(items, selectedFolderId) => getChildren(items, selectedFolderId)
);

export const selectBreadcrumbs = createSelector(
	[selectItems, selectSelectedFolderId],
	(items, selectedFolderId) => getPath(items, selectedFolderId)
);

export const selectOpenFile = createSelector(
	[selectItems, selectOpenFileId],
	(items, openFileId) => (openFileId === null ? undefined : items[openFileId])
);

export const selectHasUnsavedChanges = createSelector(
	[selectOpenFile, selectEditorDraft],
	(openFile, editorDraft) => openFile?.type === 'file' && openFile.content !== editorDraft
);

export const selectSearchResults = createSelector(
	[selectItems, selectSearchQuery, selectRootId],
	(items, searchQuery, rootId) => searchItems(items, searchQuery, rootId)
);

export const selectIsSearching = createSelector(
	[selectSearchQuery],
	(searchQuery) => searchQuery.trim() !== ''
);

export const selectViewMode = (state: RootState) => state.preferences.viewMode;

export const selectIconSize = (state: RootState) => state.preferences.iconSize;

export const selectColorScheme = (state: RootState) => state.preferences.colorScheme;
