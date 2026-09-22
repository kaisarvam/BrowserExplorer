import { useStoreDispatch, useStoreSelector } from '@/store';
import { selectDialog, selectItems, selectSelectedFolderId } from '@/store/selectors';
import { dialogClosed, itemCreated } from '@/store/workspaceSlice';
import { NameDialog } from './NameDialog';

export function WorkspaceDialogs() {
	const dispatch = useStoreDispatch();
	const dialog = useStoreSelector(selectDialog);
	const items = useStoreSelector(selectItems);
	const selectedFolderId = useStoreSelector(selectSelectedFolderId);

	if (dialog.kind === 'none') {
		return null;
	}

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
