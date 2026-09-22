type WorkspaceItemId = string;

type WorkspaceItemType = 'folder' | 'file';

type WorkspaceItemBase = {
	id: WorkspaceItemId;
	name: string;
	parentId: WorkspaceItemId | null;
};

type FolderItem = WorkspaceItemBase & {
	type: 'folder';
};

type FileItem = WorkspaceItemBase & {
	type: 'file';
	content: string;
};

type WorkspaceItem = FolderItem | FileItem;

type WorkspaceItems = Record<WorkspaceItemId, WorkspaceItem>;

type Workspace = {
	rootId: WorkspaceItemId;
	items: WorkspaceItems;
};

type NavigationTarget =
	| { kind: 'folder'; folderId: WorkspaceItemId }
	| { kind: 'file'; fileId: WorkspaceItemId }
	| { kind: 'closeFile' };

type DialogState =
	| { kind: 'none' }
	| { kind: 'create'; itemType: WorkspaceItemType }
	| { kind: 'preview'; fileId: WorkspaceItemId }
	| { kind: 'rename'; itemId: WorkspaceItemId }
	| { kind: 'delete'; itemId: WorkspaceItemId }
	| { kind: 'unsavedChanges'; target: NavigationTarget };

type WorkspaceState = {
	rootId: WorkspaceItemId;
	items: WorkspaceItems;
	selectedFolderId: WorkspaceItemId;
	openFileId: WorkspaceItemId | null;

	editorDraft: string;
	expandedFolderIds: WorkspaceItemId[];
	searchQuery: string;
	dialog: DialogState;
};

type NameValidationResult =
	{ status: 'valid'; name: string } | { status: 'invalid'; message: string };
