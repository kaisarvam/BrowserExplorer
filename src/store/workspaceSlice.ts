import { createSlice, nanoid } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSampleWorkspace } from '@/utils/constants';
import {
	collectDescendantIds,
	findNearestSurvivingFolderId,
	getPath,
	isFolder,
	loadWorkspace,
	validateItemName,
} from '@/utils/helpers';

function createInitialState(): WorkspaceState {
	const workspace = loadWorkspace() ?? createSampleWorkspace();

	return {
		rootId: workspace.rootId,
		items: workspace.items,
		selectedFolderId: workspace.rootId,
		openFileId: null,
		editorDraft: '',
		expandedFolderIds: [workspace.rootId],
		searchQuery: '',
		dialog: { kind: 'none' },
	};
}

function hasUnsavedChanges(state: WorkspaceState): boolean {
	if (state.openFileId === null) {
		return false;
	}

	const openFile = state.items[state.openFileId];

	return openFile?.type === 'file' && openFile.content !== state.editorDraft;
}

function openFileContent(state: WorkspaceState): string {
	if (state.openFileId === null) {
		return '';
	}

	const openFile = state.items[state.openFileId];

	return openFile?.type === 'file' ? openFile.content : '';
}

function saveDraft(state: WorkspaceState): void {
	if (state.openFileId === null) {
		return;
	}

	const openFile = state.items[state.openFileId];

	if (openFile?.type === 'file') {
		openFile.content = state.editorDraft;
	}
}

function applyNavigation(state: WorkspaceState, target: NavigationTarget): void {
	if (target.kind === 'closeFile') {
		state.openFileId = null;
		state.editorDraft = '';
		return;
	}

	if (target.kind === 'folder') {
		if (state.items[target.folderId]?.type === 'folder') {
			state.selectedFolderId = target.folderId;
			state.openFileId = null;
			state.editorDraft = '';
		}
		return;
	}

	const file = state.items[target.fileId];

	if (file?.type !== 'file') {
		return;
	}

	state.openFileId = file.id;
	state.editorDraft = file.content;

	if (file.parentId !== null && state.items[file.parentId]?.type === 'folder') {
		state.selectedFolderId = file.parentId;
	}
}

function expandFolderIds(state: WorkspaceState, folderIds: WorkspaceItemId[]): void {
	for (const folderId of folderIds) {
		if (!state.expandedFolderIds.includes(folderId)) {
			state.expandedFolderIds.push(folderId);
		}
	}
}

const workspaceSlice = createSlice({
	name: 'workspace',
	initialState: createInitialState,
	reducers: {
		navigationRequested(state, action: PayloadAction<NavigationTarget>) {
			if (hasUnsavedChanges(state)) {
				state.dialog = { kind: 'unsavedChanges', target: action.payload };
				return;
			}

			applyNavigation(state, action.payload);
		},

		unsavedChangesDiscarded(state) {
			if (state.dialog.kind !== 'unsavedChanges') {
				return;
			}

			const { target } = state.dialog;
			state.dialog = { kind: 'none' };
			state.editorDraft = openFileContent(state);
			applyNavigation(state, target);
		},

		unsavedChangesSaved(state) {
			if (state.dialog.kind !== 'unsavedChanges') {
				return;
			}

			const { target } = state.dialog;
			state.dialog = { kind: 'none' };
			saveDraft(state);
			applyNavigation(state, target);
		},

		draftChanged(state, action: PayloadAction<string>) {
			if (state.openFileId !== null) {
				state.editorDraft = action.payload;
			}
		},

		draftSaved(state) {
			saveDraft(state);
		},

		draftReverted(state) {
			state.editorDraft = openFileContent(state);
		},

		folderExpansionToggled(state, action: PayloadAction<WorkspaceItemId>) {
			const folderId = action.payload;

			if (state.expandedFolderIds.includes(folderId)) {
				state.expandedFolderIds = state.expandedFolderIds.filter((id) => id !== folderId);
				return;
			}

			state.expandedFolderIds.push(folderId);
		},

		pathExpanded(state, action: PayloadAction<WorkspaceItemId>) {
			const ancestorIds = getPath(state.items, action.payload)
				.filter(isFolder)
				.map((folder) => folder.id);

			expandFolderIds(state, ancestorIds);
		},

		searchQueryChanged(state, action: PayloadAction<string>) {
			state.searchQuery = action.payload;
		},

		searchCleared(state) {
			state.searchQuery = '';
		},

		dialogOpened(state, action: PayloadAction<DialogState>) {
			state.dialog = action.payload;
		},

		dialogClosed(state) {
			state.dialog = { kind: 'none' };
		},

		itemCreated: {
			reducer(
				state,
				action: PayloadAction<{ id: WorkspaceItemId; name: string; itemType: WorkspaceItemType }>
			) {
				const { id, name, itemType } = action.payload;
				const parentId = state.selectedFolderId;
				const validation = validateItemName({ items: state.items, parentId, name });

				if (validation.status === 'invalid' || state.items[parentId]?.type !== 'folder') {
					return;
				}

				state.items[id] =
					itemType === 'folder'
						? { id, name: validation.name, type: 'folder', parentId }
						: { id, name: validation.name, type: 'file', parentId, content: '' };

				expandFolderIds(state, [parentId]);
				state.dialog = { kind: 'none' };
			},
			prepare(payload: { name: string; itemType: WorkspaceItemType }) {
				return { payload: { ...payload, id: nanoid() } };
			},
		},

		itemRenamed(state, action: PayloadAction<{ itemId: WorkspaceItemId; name: string }>) {
			const { itemId, name } = action.payload;
			const item = state.items[itemId];

			if (!item || item.parentId === null) {
				return;
			}

			const validation = validateItemName({
				items: state.items,
				parentId: item.parentId,
				name,
				ignoreItemId: itemId,
			});

			if (validation.status === 'invalid') {
				return;
			}

			item.name = validation.name;
			state.dialog = { kind: 'none' };
		},

		itemDeleted(state, action: PayloadAction<WorkspaceItemId>) {
			const itemId = action.payload;
			const item = state.items[itemId];

			if (!item || itemId === state.rootId) {
				return;
			}

			const descendantIds = isFolder(item) ? collectDescendantIds(state.items, itemId) : [];
			const removedIds = [itemId, ...descendantIds];
			const ancestorIds = getPath(state.items, itemId)
				.slice(0, -1)
				.map((ancestor) => ancestor.id);

			for (const removedId of removedIds) {
				delete state.items[removedId];
			}

			state.expandedFolderIds = state.expandedFolderIds.filter((id) => !removedIds.includes(id));

			if (state.openFileId !== null && removedIds.includes(state.openFileId)) {
				state.openFileId = null;
				state.editorDraft = '';
			}

			if (removedIds.includes(state.selectedFolderId)) {
				state.selectedFolderId = findNearestSurvivingFolderId(
					{ rootId: state.rootId, items: state.items },
					ancestorIds
				);
			}

			state.dialog = { kind: 'none' };
		},
	},
});

export const {
	navigationRequested,
	unsavedChangesDiscarded,
	unsavedChangesSaved,
	draftChanged,
	draftSaved,
	draftReverted,
	folderExpansionToggled,
	pathExpanded,
	searchQueryChanged,
	searchCleared,
	dialogOpened,
	dialogClosed,
	itemCreated,
	itemRenamed,
	itemDeleted,
} = workspaceSlice.actions;

export default workspaceSlice;
