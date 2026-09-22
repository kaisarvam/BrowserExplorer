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

type NavigationTarget = { kind: 'folder'; folderId: WorkspaceItemId };

type DialogState = { kind: 'none' } | { kind: 'create'; itemType: WorkspaceItemType };

type WorkspaceState = {
	rootId: WorkspaceItemId;
	items: WorkspaceItems;
	selectedFolderId: WorkspaceItemId;

	expandedFolderIds: WorkspaceItemId[];
	dialog: DialogState;
};

type NameValidationResult =
	{ status: 'valid'; name: string } | { status: 'invalid'; message: string };
