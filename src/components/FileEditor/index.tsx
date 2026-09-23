import { useEffect } from 'react';
import styled from 'styled-components';
import { Button, CloseIcon, DiscardIcon, SaveIcon } from '@/components/atoms';
import { useStoreDispatch, useStoreSelector } from '@/store';
import { selectEditorDraft, selectHasUnsavedChanges, selectOpenFile } from '@/store/selectors';
import {
	draftChanged,
	draftReverted,
	draftSaved,
	navigationRequested,
} from '@/store/workspaceSlice';

const Editor = styled.section`
	display: flex;
	flex-direction: column;
	gap: ${({ theme }) => theme.spacing.md};
	min-height: 0;
`;

const Header = styled.header`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: ${({ theme }) => theme.spacing.md};
`;

const FileName = styled.h2`
	flex: 1;
	min-width: 10rem;
	font-size: ${({ theme }) => theme.fontSizes.md};
	overflow-wrap: anywhere;
`;

const SaveState = styled.span<{ $unsaved: boolean }>`
	padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
	border-radius: ${({ theme }) => theme.radii.sm};
	background: ${({ theme, $unsaved }) =>
		$unsaved ? theme.colors.warningSurface : theme.colors.surface};
	color: ${({ theme, $unsaved }) => ($unsaved ? theme.colors.warning : theme.colors.textMuted)};
	font-size: ${({ theme }) => theme.fontSizes.xs};
`;

const Actions = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: ${({ theme }) => theme.spacing.sm};
`;

const TextArea = styled.textarea`
	width: 100%;
	min-height: 16rem;
	padding: ${({ theme }) => theme.spacing.md};
	border: 1px solid ${({ theme }) => theme.colors.border};
	border-radius: ${({ theme }) => theme.radii.sm};
	background: ${({ theme }) => theme.colors.surfaceRaised};
	font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
	font-size: ${({ theme }) => theme.fontSizes.sm};
	resize: vertical;
`;

export function FileEditor() {
	const dispatch = useStoreDispatch();
	const openFile = useStoreSelector(selectOpenFile);
	const draft = useStoreSelector(selectEditorDraft);
	const hasUnsavedChanges = useStoreSelector(selectHasUnsavedChanges);

	useEffect(() => {
		function handleKeyDown(event: KeyboardEvent) {
			if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== 's') {
				return;
			}

			event.preventDefault();

			if (hasUnsavedChanges) {
				dispatch(draftSaved());
			}
		}

		document.addEventListener('keydown', handleKeyDown);

		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [dispatch, hasUnsavedChanges]);

	if (openFile?.type !== 'file') {
		return null;
	}

	return (
		<Editor aria-label={`Editing ${openFile.name}`}>
			<Header>
				<FileName>{openFile.name}</FileName>
				<SaveState $unsaved={hasUnsavedChanges} role='status'>
					{hasUnsavedChanges ? 'Unsaved changes' : 'All changes saved'}
				</SaveState>
			</Header>

			<TextArea
				value={draft}
				aria-label={`Contents of ${openFile.name}`}
				onChange={(event) => dispatch(draftChanged(event.target.value))}
			/>

			<Actions>
				<Button
					type='button'
					$variant='primary'
					title='Save (Ctrl+S or ⌘S)'
					aria-keyshortcuts='Control+S Meta+S'
					disabled={!hasUnsavedChanges}
					onClick={() => dispatch(draftSaved())}
				>
					<SaveIcon aria-hidden='true' />
					Save
				</Button>
				<Button
					type='button'
					disabled={!hasUnsavedChanges}
					onClick={() => dispatch(draftReverted())}
				>
					<DiscardIcon aria-hidden='true' />
					Discard changes
				</Button>
				<Button type='button' onClick={() => dispatch(navigationRequested({ kind: 'closeFile' }))}>
					<CloseIcon aria-hidden='true' />
					Close file
				</Button>
			</Actions>
		</Editor>
	);
}
