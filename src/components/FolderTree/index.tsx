import { useRef } from 'react';
import type { KeyboardEvent } from 'react';
import { ItemContextMenu } from '@/components/ContextMenu/ItemContextMenu';
import { useContextMenu } from '@/hooks';
import { useStoreDispatch, useStoreSelector } from '@/store';
import {
	selectExpandedFolderIds,
	selectItems,
	selectRootId,
	selectSelectedFolderId,
} from '@/store/selectors';
import { folderExpansionToggled } from '@/store/workspaceSlice';
import { getChildFolders, getPath } from '@/utils/helpers';
import { FolderTreeNode } from './FolderTreeNode';

export function FolderTree({ onFolderSelected }: { onFolderSelected: () => void }) {
	const dispatch = useStoreDispatch();
	const items = useStoreSelector(selectItems);
	const rootId = useStoreSelector(selectRootId);
	const expandedFolderIds = useStoreSelector(selectExpandedFolderIds);
	const selectedFolderId = useStoreSelector(selectSelectedFolderId);
	const { menu, openAt, close } = useContextMenu<FolderItem>();
	const treeRef = useRef<HTMLUListElement>(null);
	const root = items[rootId];

	if (root?.type !== 'folder') {
		return null;
	}

	const selectedIsVisible = getPath(items, selectedFolderId)
		.slice(0, -1)
		.every((ancestor) => expandedFolderIds.includes(ancestor.id));
	const tabStopId = selectedIsVisible ? selectedFolderId : rootId;

	function focusFolder(folderId: WorkspaceItemId | null) {
		if (folderId === null) {
			return;
		}

		treeRef.current
			?.querySelector<HTMLElement>(`[data-folder-id="${CSS.escape(folderId)}"]`)
			?.focus();
	}

	function handleKeyDown(event: KeyboardEvent<HTMLUListElement>) {
		const current = event.target as HTMLElement;
		const folderId = current.dataset.folderId;

		if (current.getAttribute('role') !== 'treeitem' || folderId === undefined) {
			return;
		}

		const visible = Array.from(
			treeRef.current?.querySelectorAll<HTMLElement>('[role="treeitem"]') ?? []
		);
		const index = visible.indexOf(current);
		const hasChildren = getChildFolders(items, folderId).length > 0;
		const isExpanded = expandedFolderIds.includes(folderId);

		if (event.key === 'ArrowDown') {
			visible[index + 1]?.focus();
		} else if (event.key === 'ArrowUp') {
			visible[index - 1]?.focus();
		} else if (event.key === 'Home') {
			visible[0]?.focus();
		} else if (event.key === 'End') {
			visible.at(-1)?.focus();
		} else if (event.key === 'ArrowRight') {
			if (hasChildren && !isExpanded) {
				dispatch(folderExpansionToggled(folderId));
			} else if (hasChildren) {
				visible[index + 1]?.focus();
			}
		} else if (event.key === 'ArrowLeft') {
			if (hasChildren && isExpanded) {
				dispatch(folderExpansionToggled(folderId));
			} else {
				focusFolder(items[folderId]?.parentId ?? null);
			}
		} else {
			return;
		}

		event.preventDefault();
	}

	return (
		<>
			<ul ref={treeRef} role='tree' aria-label='Folder tree' onKeyDown={handleKeyDown}>
				<FolderTreeNode
					folder={root}
					depth={0}
					tabStopId={tabStopId}
					onSelect={onFolderSelected}
					onContextMenu={openAt}
				/>
			</ul>

			{menu && <ItemContextMenu item={menu.target} x={menu.x} y={menu.y} onClose={close} />}
		</>
	);
}
