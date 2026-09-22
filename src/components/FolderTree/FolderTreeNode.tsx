import styled from 'styled-components';
import { ChevronIcon, FolderIcon } from '@/components/atoms';
import { useStoreDispatch, useStoreSelector } from '@/store';
import { selectExpandedFolderIds, selectItems, selectSelectedFolderId } from '@/store/selectors';
import { folderExpansionToggled, navigationRequested } from '@/store/workspaceSlice';
import { getChildFolders } from '@/utils/helpers';

const Row = styled.div<{ $depth: number; $selected: boolean }>`
	display: flex;
	align-items: center;
	gap: ${({ theme }) => theme.spacing.xs};
	padding-left: ${({ $depth }) => `${$depth * 0.875}rem`};
	border-radius: ${({ theme }) => theme.radii.sm};
	background: ${({ theme, $selected }) => ($selected ? theme.colors.accentSurface : 'transparent')};

	&:hover {
		background: ${({ theme, $selected }) =>
			$selected ? theme.colors.accentSurface : theme.colors.surface};
	}
`;

const ToggleButton = styled.button<{ $expanded: boolean }>`
	display: grid;
	place-items: center;
	width: 1.25rem;
	height: 1.5rem;
	border: none;
	background: none;
	color: ${({ theme }) => theme.colors.textMuted};
	cursor: pointer;

	svg {
		transform: rotate(${({ $expanded }) => ($expanded ? '90deg' : '0deg')});
		transition: transform 120ms ease;
	}
`;

const ToggleSpacer = styled.span`
	width: 1.25rem;
`;

const NameButton = styled.button<{ $selected: boolean }>`
	display: flex;
	align-items: center;
	gap: ${({ theme }) => theme.spacing.sm};
	flex: 1;
	padding: ${({ theme }) => theme.spacing.xs};
	border: none;
	background: none;
	font-size: ${({ theme }) => theme.fontSizes.sm};
	font-weight: ${({ $selected }) => ($selected ? 600 : 400)};
	text-align: left;
	cursor: pointer;
`;

type FolderTreeNodeProps = {
	folder: FolderItem;
	depth: number;
};

export function FolderTreeNode({ folder, depth }: FolderTreeNodeProps) {
	const dispatch = useStoreDispatch();
	const items = useStoreSelector(selectItems);
	const expandedFolderIds = useStoreSelector(selectExpandedFolderIds);
	const selectedFolderId = useStoreSelector(selectSelectedFolderId);

	const childFolders = getChildFolders(items, folder.id);
	const isExpanded = expandedFolderIds.includes(folder.id);
	const isSelected = folder.id === selectedFolderId;

	return (
		<li>
			<Row
				$depth={depth}
				$selected={isSelected}
				role='treeitem'
				aria-selected={isSelected}
				aria-expanded={childFolders.length > 0 ? isExpanded : undefined}
			>
				{childFolders.length > 0 ? (
					<ToggleButton
						type='button'
						$expanded={isExpanded}
						aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${folder.name}`}
						onClick={() => dispatch(folderExpansionToggled(folder.id))}
					>
						<ChevronIcon aria-hidden='true' />
					</ToggleButton>
				) : (
					<ToggleSpacer />
				)}

				<NameButton
					type='button'
					$selected={isSelected}
					aria-current={isSelected ? 'true' : undefined}
					onClick={() => dispatch(navigationRequested({ kind: 'folder', folderId: folder.id }))}
				>
					<FolderIcon aria-hidden='true' />
					{folder.name}
				</NameButton>
			</Row>

			{isExpanded && childFolders.length > 0 && (
				<ul role='group'>
					{childFolders.map((childFolder) => (
						<FolderTreeNode key={childFolder.id} folder={childFolder} depth={depth + 1} />
					))}
				</ul>
			)}
		</li>
	);
}
