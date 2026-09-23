import { useId } from 'react';
import type { MouseEvent } from 'react';
import styled from 'styled-components';
import { ChevronIcon, ItemIcon } from '@/components/atoms';
import { useStoreDispatch, useStoreSelector } from '@/store';
import { selectExpandedFolderIds, selectItems, selectSelectedFolderId } from '@/store/selectors';
import { folderExpansionToggled, navigationRequested } from '@/store/workspaceSlice';
import { getChildFolders } from '@/utils/helpers';

const Row = styled.div<{ $selected: boolean }>`
	display: flex;
	align-items: center;
	gap: ${({ theme }) => theme.spacing.xs};
	min-height: 1.75rem;
	border-radius: ${({ theme }) => theme.radii.sm};
	background: ${({ theme, $selected }) => ($selected ? theme.colors.accentSurface : 'transparent')};
	cursor: pointer;

	&:hover {
		background: ${({ theme, $selected }) =>
			$selected ? theme.colors.accentSurface : theme.colors.surface};
	}

	@media (pointer: coarse) {
		min-height: 2.75rem;
	}
`;

const Toggle = styled.span<{ $expanded: boolean }>`
	display: grid;
	flex-shrink: 0;
	place-items: center;
	width: 1.25rem;
	height: 1.5rem;
	color: ${({ theme }) => theme.colors.textMuted};

	svg {
		transform: rotate(${({ $expanded }) => ($expanded ? '90deg' : '0deg')});
		transition: transform 120ms ease;
	}

	@media (pointer: coarse) {
		width: 2.75rem;
		height: 2.75rem;
	}
`;

const ToggleSpacer = styled.span`
	flex-shrink: 0;
	width: 1.25rem;

	@media (pointer: coarse) {
		width: 2.75rem;
	}
`;

const Name = styled.span<{ $selected: boolean }>`
	display: flex;
	align-items: center;
	gap: ${({ theme }) => theme.spacing.sm};
	flex: 1;
	padding: ${({ theme }) => theme.spacing.xs};
	font-size: ${({ theme }) => theme.fontSizes.sm};
	font-weight: ${({ $selected }) => ($selected ? 600 : 400)};
	overflow-wrap: anywhere;
`;

const Group = styled.ul`
	margin-left: 0.625rem;
	padding-left: 0.25rem;
	border-left: 1px solid ${({ theme }) => theme.colors.border};
`;

const TreeItem = styled.li`
	&:focus-visible {
		outline: none;
	}

	&:focus-visible > ${Row} {
		outline: 2px solid ${({ theme }) => theme.colors.accent};
		outline-offset: -2px;
	}
`;

type FolderTreeNodeProps = {
	folder: FolderItem;
	depth: number;
	tabStopId: WorkspaceItemId;

	onSelect: () => void;
	onContextMenu: (event: MouseEvent<HTMLElement>, folder: FolderItem) => void;
};

export function FolderTreeNode({
	folder,
	depth,
	tabStopId,
	onSelect,
	onContextMenu,
}: FolderTreeNodeProps) {
	const dispatch = useStoreDispatch();
	const items = useStoreSelector(selectItems);
	const expandedFolderIds = useStoreSelector(selectExpandedFolderIds);
	const selectedFolderId = useStoreSelector(selectSelectedFolderId);
	const nameId = useId();

	const childFolders = getChildFolders(items, folder.id);
	const hasChildren = childFolders.length > 0;
	const isExpanded = expandedFolderIds.includes(folder.id);
	const isSelected = folder.id === selectedFolderId;

	function select() {
		dispatch(navigationRequested({ kind: 'folder', folderId: folder.id }));
		onSelect();
	}

	return (
		<TreeItem
			role='treeitem'
			tabIndex={folder.id === tabStopId ? 0 : -1}
			aria-level={depth + 1}
			aria-selected={isSelected}
			aria-current={isSelected ? 'true' : undefined}
			aria-expanded={hasChildren ? isExpanded : undefined}
			aria-labelledby={nameId}
			data-folder-id={folder.id}
			onContextMenu={(event) => onContextMenu(event, folder)}
			onKeyDown={(event) => {
				if (event.target !== event.currentTarget) {
					return;
				}

				if (event.key === 'Enter' || event.key === ' ') {
					event.preventDefault();
					select();
				}
			}}
		>
			<Row $selected={isSelected} onClick={select}>
				{hasChildren ? (
					<Toggle
						$expanded={isExpanded}
						aria-hidden='true'
						onClick={(event) => {
							event.stopPropagation();
							dispatch(folderExpansionToggled(folder.id));
						}}
					>
						<ChevronIcon />
					</Toggle>
				) : (
					<ToggleSpacer />
				)}

				<Name id={nameId} $selected={isSelected}>
					<ItemIcon item={folder} size='1rem' open={isSelected || (hasChildren && isExpanded)} />
					{folder.name}
				</Name>
			</Row>

			{isExpanded && hasChildren && (
				<Group role='group'>
					{childFolders.map((childFolder) => (
						<FolderTreeNode
							key={childFolder.id}
							folder={childFolder}
							depth={depth + 1}
							tabStopId={tabStopId}
							onSelect={onSelect}
							onContextMenu={onContextMenu}
						/>
					))}
				</Group>
			)}
		</TreeItem>
	);
}
