import styled from 'styled-components';
import { Button, DeleteIcon, EditIcon, PreviewIcon, RenameIcon } from '@/components/atoms';
import { useStoreDispatch } from '@/store';
import { dialogOpened, navigationRequested } from '@/store/workspaceSlice';

const Actions = styled.div`
	display: flex;
	align-items: center;
	gap: ${({ theme }) => theme.spacing.xs};

	flex-wrap: nowrap;
	justify-content: flex-end;
`;

export function ItemActions({ item }: { item: WorkspaceItem }) {
	const dispatch = useStoreDispatch();

	return (
		<Actions>
			{item.type === 'file' && (
				<>
					<Button
						type='button'
						$variant='ghost'
						aria-label={`Preview ${item.name}`}
						onClick={() => dispatch(dialogOpened({ kind: 'preview', fileId: item.id }))}
					>
						<PreviewIcon aria-hidden='true' />
						Preview
					</Button>
					<Button
						type='button'
						$variant='ghost'
						aria-label={`Edit ${item.name}`}
						onClick={() => dispatch(navigationRequested({ kind: 'file', fileId: item.id }))}
					>
						<EditIcon aria-hidden='true' />
						Edit
					</Button>
				</>
			)}
			<Button
				type='button'
				$variant='ghost'
				aria-label={`Rename ${item.name}`}
				onClick={() => dispatch(dialogOpened({ kind: 'rename', itemId: item.id }))}
			>
				<RenameIcon aria-hidden='true' />
				Rename
			</Button>
			<Button
				type='button'
				$variant='ghost'
				aria-label={`Delete ${item.name}`}
				onClick={() => dispatch(dialogOpened({ kind: 'delete', itemId: item.id }))}
			>
				<DeleteIcon aria-hidden='true' />
				Delete
			</Button>
		</Actions>
	);
}
