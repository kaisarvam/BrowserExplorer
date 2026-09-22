export function getChildren(items: WorkspaceItems, parentId: WorkspaceItemId): WorkspaceItem[] {
	return Object.values(items)
		.filter((item) => item.parentId === parentId)
		.sort(compareItems);
}

export function getChildFolders(items: WorkspaceItems, parentId: WorkspaceItemId): FolderItem[] {
	return getChildren(items, parentId).filter(isFolder);
}

export function isFolder(item: WorkspaceItem): item is FolderItem {
	return item.type === 'folder';
}

function compareItems(left: WorkspaceItem, right: WorkspaceItem): number {
	if (left.type !== right.type) {
		return left.type === 'folder' ? -1 : 1;
	}

	return left.name.localeCompare(right.name, undefined, { sensitivity: 'base' });
}

export function getPath(items: WorkspaceItems, id: WorkspaceItemId): WorkspaceItem[] {
	const path: WorkspaceItem[] = [];
	let current = items[id];

	while (current) {
		path.unshift(current);
		current = current.parentId === null ? undefined : items[current.parentId];
	}

	return path;
}

export function hasSiblingNamed(
	items: WorkspaceItems,
	parentId: WorkspaceItemId,
	name: string,
	ignoreItemId?: WorkspaceItemId
): boolean {
	return getChildren(items, parentId).some(
		(sibling) => sibling.id !== ignoreItemId && namesMatch(sibling.name, name)
	);
}

function namesMatch(left: string, right: string): boolean {
	return left.toLocaleLowerCase() === right.toLocaleLowerCase();
}
