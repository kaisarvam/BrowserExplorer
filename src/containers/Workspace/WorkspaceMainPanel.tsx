import styled from 'styled-components';
import { Button, NewFileIcon, NewFolderIcon } from '@/components/atoms';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { FileEditor } from '@/components/FileEditor';
import { FolderContents } from '@/components/FolderContents';
import { SearchField } from '@/components/SearchField';
import { SearchResults } from '@/components/SearchResults';
import { ViewControls } from '@/components/ViewControls';
import { useStoreDispatch, useStoreSelector } from '@/store';
import { selectIsSearching, selectOpenFileId } from '@/store/selectors';
import { dialogOpened } from '@/store/workspaceSlice';

const Panel = styled.main`
	display: flex;
	flex-direction: column;
	gap: ${({ theme }) => theme.spacing.lg};
	min-height: 0;
	padding: ${({ theme }) => theme.spacing.lg};
	overflow: auto;

	&:focus-visible {
		outline: none;
	}
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
	const isSearching = useStoreSelector(selectIsSearching);
	const openFileId = useStoreSelector(selectOpenFileId);

	return (
		<Panel tabIndex={-1}>
			<SearchField />

			{isSearching ? (
				<SearchResults />
			) : (
				<>
					<Toolbar>
						<Breadcrumbs />
						{openFileId === null && (
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
						)}
					</Toolbar>

					{openFileId === null ? (
						<>
							<ViewControls />
							<FolderContents />
						</>
					) : (
						<FileEditor />
					)}
				</>
			)}
		</Panel>
	);
}
