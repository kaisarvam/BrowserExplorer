import { useStoreSelector } from '@/store';
import { selectItems, selectRootId } from '@/store/selectors';
import { FolderTreeNode } from './FolderTreeNode';

export function FolderTree() {
	const items = useStoreSelector(selectItems);
	const rootId = useStoreSelector(selectRootId);
	const root = items[rootId];

	if (root?.type !== 'folder') {
		return null;
	}

	return (
		<ul role='tree' aria-label='Folder tree'>
			<FolderTreeNode folder={root} depth={0} />
		</ul>
	);
}
