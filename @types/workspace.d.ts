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
	lastCreatedItemId: WorkspaceItemId | null;
	notice: WorkspaceNotice | null;
};

type WorkspaceNotice = {
	id: number;
	message: string;
	restorable: WorkspaceItem[];
};

type NameValidationResult =
	{ status: 'valid'; name: string } | { status: 'invalid'; message: string };

type WorkspaceViewMode = 'list' | 'grid';

type WorkspaceIconSize = 'small' | 'large';

type ColorSchemePreference = 'system' | 'light' | 'dark';

type PreferencesState = {
	viewMode: WorkspaceViewMode;
	iconSize: WorkspaceIconSize;
	colorScheme: ColorSchemePreference;
};

type IconTone =
	| FileIconTone
	| 'folder'
	| 'folderOpen'
	| 'preview'
	| 'edit'
	| 'rename'
	| 'delete'
	| 'newFolder'
	| 'newFile'
	| 'save'
	| 'discard'
	| 'search'
	| 'neutral';

type FileIconTone =
	'fileText' | 'fileMarkdown' | 'fileData' | 'fileSheet' | 'fileLog' | 'fileGeneric' | 'fileEmpty';

type ItemAction = {
	key: string;

	label: string;

	text: string;
	tone: IconTone;
	Icon: import('react-icons').IconType;
	run: () => void;
};
