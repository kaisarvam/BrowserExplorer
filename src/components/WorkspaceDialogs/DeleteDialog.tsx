import { Button, Modal } from '@/components/atoms';
import { collectDescendantIds, isFolder } from '@/utils/helpers';

type DeleteDialogProps = {
	item: WorkspaceItem;
	items: WorkspaceItems;
	onCancel: () => void;
	onConfirm: () => void;
};

export function DeleteDialog({ item, items, onCancel, onConfirm }: DeleteDialogProps) {
	const nestedCount = isFolder(item) ? collectDescendantIds(items, item.id).length : 0;

	return (
		<Modal
			title={`Delete ${item.name}?`}
			onClose={onCancel}
			actions={
				<>
					<Button type='button' onClick={onCancel}>
						Cancel
					</Button>
					<Button type='button' $variant='danger' onClick={onConfirm}>
						Delete
					</Button>
				</>
			}
		>
			<p>
				{nestedCount > 0
					? `This folder and the ${nestedCount} item${nestedCount === 1 ? '' : 's'} inside it will be deleted. You can undo this straight afterwards.`
					: 'You can undo this straight afterwards.'}
			</p>
		</Modal>
	);
}
