import {
	DeleteIcon,
	EditIcon,
	FolderOpenIcon,
	NewFileIcon,
	NewFolderIcon,
	PreviewIcon,
	RenameIcon,
} from '@/components/atoms';
import { useStoreDispatch } from '@/store';
import { dialogOpened, navigationRequested } from '@/store/workspaceSlice';

export function useItemActions(item: WorkspaceItem): ItemAction[] {
	const dispatch = useStoreDispatch();

	const openAction: ItemAction =
		item.type === 'folder'
			? {
					key: 'open',
					label: `Open folder ${item.name}`,
					text: 'Open',
					tone: 'folderOpen',
					Icon: FolderOpenIcon,
					run: () => dispatch(navigationRequested({ kind: 'folder', folderId: item.id })),
				}
			: {
					key: 'preview',
					label: `Preview ${item.name}`,
					text: 'Preview',
					tone: 'preview',
					Icon: PreviewIcon,
					run: () => dispatch(dialogOpened({ kind: 'preview', fileId: item.id })),
				};

	const editAction: ItemAction[] =
		item.type === 'file'
			? [
					{
						key: 'edit',
						label: `Edit ${item.name}`,
						text: 'Edit',
						tone: 'edit',
						Icon: EditIcon,
						run: () => dispatch(navigationRequested({ kind: 'file', fileId: item.id })),
					},
				]
			: [];

	if (item.parentId === null) {
		return [openAction];
	}

	return [
		openAction,
		...editAction,
		{
			key: 'rename',
			label: `Rename ${item.name}`,
			text: 'Rename',
			tone: 'rename',
			Icon: RenameIcon,
			run: () => dispatch(dialogOpened({ kind: 'rename', itemId: item.id })),
		},
		{
			key: 'delete',
			label: `Delete ${item.name}`,
			text: 'Delete',
			tone: 'delete',
			Icon: DeleteIcon,
			run: () => dispatch(dialogOpened({ kind: 'delete', itemId: item.id })),
		},
	];
}

export function useCreateActions(): ItemAction[] {
	const dispatch = useStoreDispatch();

	return [
		{
			key: 'new-folder',
			label: 'New folder',
			text: 'New folder',
			tone: 'newFolder',
			Icon: NewFolderIcon,
			run: () => dispatch(dialogOpened({ kind: 'create', itemType: 'folder' })),
		},
		{
			key: 'new-file',
			label: 'New file',
			text: 'New file',
			tone: 'newFile',
			Icon: NewFileIcon,
			run: () => dispatch(dialogOpened({ kind: 'create', itemType: 'file' })),
		},
	];
}
