import { createSlice, nanoid } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSampleWorkspace } from '@/utils/constants';
import { validateItemName } from '@/utils/helpers';

function createInitialState(): WorkspaceState {
	const workspace = createSampleWorkspace();

	return {
		rootId: workspace.rootId,
		items: workspace.items,
		selectedFolderId: workspace.rootId,
		expandedFolderIds: [workspace.rootId],
		dialog: { kind: 'none' },
	};
}

function applyNavigation(state: WorkspaceState, target: NavigationTarget): void {
	if (state.items[target.folderId]?.type === 'folder') {
		state.selectedFolderId = target.folderId;
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
			applyNavigation(state, action.payload);
		},

		folderExpansionToggled(state, action: PayloadAction<WorkspaceItemId>) {
			const folderId = action.payload;

			if (state.expandedFolderIds.includes(folderId)) {
				state.expandedFolderIds = state.expandedFolderIds.filter((id) => id !== folderId);
				return;
			}

			state.expandedFolderIds.push(folderId);
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
	},
});

export const {
	navigationRequested,
	folderExpansionToggled,
	dialogOpened,
	dialogClosed,
	itemCreated,
} = workspaceSlice.actions;

export default workspaceSlice;
