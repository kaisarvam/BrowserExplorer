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

export function collectDescendantIds(
	items: WorkspaceItems,
	folderId: WorkspaceItemId
): WorkspaceItemId[] {
	const descendantIds: WorkspaceItemId[] = [];

	for (const child of getChildren(items, folderId)) {
		descendantIds.push(child.id);

		if (isFolder(child)) {
			descendantIds.push(...collectDescendantIds(items, child.id));
		}
	}

	return descendantIds;
}

export function findNearestSurvivingFolderId(
	workspace: Workspace,
	ancestorIds: WorkspaceItemId[]
): WorkspaceItemId {
	for (const ancestorId of [...ancestorIds].reverse()) {
		const candidate = workspace.items[ancestorId];

		if (candidate && isFolder(candidate)) {
			return candidate.id;
		}
	}

	return workspace.rootId;
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

export function searchItems(
	items: WorkspaceItems,
	query: string,
	rootId: WorkspaceItemId
): WorkspaceItem[] {
	const trimmedQuery = query.trim().toLocaleLowerCase();

	if (trimmedQuery === '') {
		return [];
	}

	return Object.values(items)
		.filter((item) => item.id !== rootId && item.name.toLocaleLowerCase().includes(trimmedQuery))
		.sort(compareItems);
}
