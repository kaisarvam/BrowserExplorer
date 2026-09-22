import styled from 'styled-components';
import { Button, NewFileIcon, NewFolderIcon } from '@/components/atoms';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { FolderContents } from '@/components/FolderContents';
import { useStoreDispatch } from '@/store';
import { dialogOpened } from '@/store/workspaceSlice';

const Panel = styled.main`
	display: flex;
	flex-direction: column;
	gap: ${({ theme }) => theme.spacing.lg};
	padding: ${({ theme }) => theme.spacing.lg};
	overflow: auto;
`;

const Toolbar = styled.div`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-between;
	gap: ${({ theme }) => theme.spacing.md};
`;

const CreateActions = styled.div`
	display: flex;
	gap: ${({ theme }) => theme.spacing.sm};
`;

export function WorkspaceMainPanel() {
	const dispatch = useStoreDispatch();

	return (
		<Panel>
			<Toolbar>
				<Breadcrumbs />
				<CreateActions>
					<Button
						type='button'
						onClick={() => dispatch(dialogOpened({ kind: 'create', itemType: 'folder' }))}
					>
						<NewFolderIcon aria-hidden='true' />
						New folder
					</Button>
					<Button
						type='button'
						onClick={() => dispatch(dialogOpened({ kind: 'create', itemType: 'file' }))}
					>
						<NewFileIcon aria-hidden='true' />
						New file
					</Button>
				</CreateActions>
			</Toolbar>

			<FolderContents />
		</Panel>
	);
}
