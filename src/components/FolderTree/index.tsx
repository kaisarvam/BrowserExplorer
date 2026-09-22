import { ItemContextMenu } from '@/components/ContextMenu/ItemContextMenu';
import { useContextMenu } from '@/hooks';
import { useStoreSelector } from '@/store';
import { selectItems, selectRootId } from '@/store/selectors';
import { FolderTreeNode } from './FolderTreeNode';

export function FolderTree({ onFolderSelected }: { onFolderSelected: () => void }) {
	const items = useStoreSelector(selectItems);
	const rootId = useStoreSelector(selectRootId);
	const { menu, openAt, close } = useContextMenu<FolderItem>();
	const root = items[rootId];

	if (root?.type !== 'folder') {
		return null;
	}

	return (
		<>
			<ul role='tree' aria-label='Folder tree'>
				<FolderTreeNode
					folder={root}
					depth={0}
					onSelect={onFolderSelected}
					onContextMenu={openAt}
				/>
			</ul>

			{menu && <ItemContextMenu item={menu.target} x={menu.x} y={menu.y} onClose={close} />}
		</>
	);
}
