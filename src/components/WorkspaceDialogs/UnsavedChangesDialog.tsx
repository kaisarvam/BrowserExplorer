import { Button, Modal } from '@/components/atoms';
import { useStoreDispatch } from '@/store';
import { dialogClosed, unsavedChangesDiscarded, unsavedChangesSaved } from '@/store/workspaceSlice';

export function UnsavedChangesDialog({ fileName }: { fileName: string }) {
	const dispatch = useStoreDispatch();

	return (
		<Modal
			title='You have unsaved changes'
			onClose={() => dispatch(dialogClosed())}
			actions={
				<>
					<Button type='button' onClick={() => dispatch(dialogClosed())}>
						Cancel
					</Button>
					<Button type='button' onClick={() => dispatch(unsavedChangesDiscarded())}>
						Discard changes
					</Button>
					<Button type='button' $variant='primary' onClick={() => dispatch(unsavedChangesSaved())}>
						Save and continue
					</Button>
				</>
			}
		>
			<p>{fileName} has changes that have not been saved yet.</p>
		</Modal>
	);
}
