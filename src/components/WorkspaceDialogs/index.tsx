import { useStoreDispatch, useStoreSelector } from '@/store';
import {
	selectDialog,
	selectItems,
	selectOpenFile,
	selectSelectedFolderId,
} from '@/store/selectors';
import {
	dialogClosed,
	itemCreated,
	itemDeleted,
	itemRenamed,
	navigationRequested,
} from '@/store/workspaceSlice';
import { DeleteDialog } from './DeleteDialog';
import { FilePreviewDialog } from './FilePreviewDialog';
import { NameDialog } from './NameDialog';
import { UnsavedChangesDialog } from './UnsavedChangesDialog';

export function WorkspaceDialogs() {
	const dispatch = useStoreDispatch();
	const dialog = useStoreSelector(selectDialog);
	const items = useStoreSelector(selectItems);
	const selectedFolderId = useStoreSelector(selectSelectedFolderId);
	const openFile = useStoreSelector(selectOpenFile);

	if (dialog.kind === 'none') {
		return null;
	}

	if (dialog.kind === 'create') {
		const isFolderDialog = dialog.itemType === 'folder';

		return (
			<NameDialog
				title={isFolderDialog ? 'New folder' : 'New file'}
				label={isFolderDialog ? 'Folder name' : 'File name'}
				confirmLabel='Create'
				initialName=''
				items={items}
				parentId={selectedFolderId}
				onCancel={() => dispatch(dialogClosed())}
				onConfirm={(name) => dispatch(itemCreated({ name, itemType: dialog.itemType }))}
			/>
		);
	}

	if (dialog.kind === 'preview') {
		const file = items[dialog.fileId];

		if (file?.type !== 'file') {
			return null;
		}

		return (
			<FilePreviewDialog
				file={file}
				onClose={() => dispatch(dialogClosed())}
				onEdit={() => {
					dispatch(dialogClosed());
					dispatch(navigationRequested({ kind: 'file', fileId: file.id }));
				}}
			/>
		);
	}

	if (dialog.kind === 'rename') {
		const item = items[dialog.itemId];

		if (!item || item.parentId === null) {
			return null;
		}

		return (
			<NameDialog
				title={`Rename ${item.name}`}
				label='New name'
				confirmLabel='Rename'
				initialName={item.name}
				items={items}
				parentId={item.parentId}
				ignoreItemId={item.id}
				keepExtension={item.type === 'file'}
				onCancel={() => dispatch(dialogClosed())}
				onConfirm={(name) => dispatch(itemRenamed({ itemId: item.id, name }))}
			/>
		);
	}

	if (dialog.kind === 'delete') {
		const item = items[dialog.itemId];

		if (!item) {
			return null;
		}

		return (
			<DeleteDialog
				item={item}
				items={items}
				onCancel={() => dispatch(dialogClosed())}
				onConfirm={() => dispatch(itemDeleted(item.id))}
			/>
		);
	}

	return <UnsavedChangesDialog fileName={openFile?.name ?? 'This file'} />;
}
