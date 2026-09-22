import { STORAGE_KEY } from '@/utils/constants';

export function loadWorkspace(): Workspace | null {
	let storedValue: string | null;

	try {
		storedValue = window.localStorage.getItem(STORAGE_KEY);
	} catch {
		return null;
	}

	if (storedValue === null) {
		return null;
	}

	try {
		return parseWorkspace(JSON.parse(storedValue));
	} catch {
		return null;
	}
}

export function saveWorkspace(workspace: Workspace): void {
	try {
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(workspace));
	} catch {
		return;
	}
}

function parseWorkspace(value: unknown): Workspace | null {
	if (!isRecord(value) || typeof value.rootId !== 'string' || !isRecord(value.items)) {
		return null;
	}

	const items: WorkspaceItems = {};

	for (const [key, rawItem] of Object.entries(value.items)) {
		const item = parseItem(rawItem);

		if (item === null || item.id !== key) {
			return null;
		}

		items[key] = item;
	}

	const root = items[value.rootId];

	if (!root || root.type !== 'folder' || root.parentId !== null) {
		return null;
	}

	for (const item of Object.values(items)) {
		if (item.id === root.id) {
			continue;
		}

		const parent = item.parentId === null ? undefined : items[item.parentId];

		if (!parent || parent.type !== 'folder') {
			return null;
		}
	}

	if (!everyItemReachesRoot(items, root.id)) {
		return null;
	}

	return { rootId: root.id, items };
}

function parseItem(value: unknown): WorkspaceItem | null {
	if (!isRecord(value)) {
		return null;
	}

	const { id, name, type, parentId } = value;

	if (typeof id !== 'string' || id === '' || typeof name !== 'string') {
		return null;
	}

	if (parentId !== null && typeof parentId !== 'string') {
		return null;
	}

	if (type === 'folder') {
		return { id, name, type, parentId };
	}

	if (type === 'file' && typeof value.content === 'string') {
		return { id, name, type, parentId, content: value.content };
	}

	return null;
}

function everyItemReachesRoot(items: WorkspaceItems, rootId: string): boolean {
	const itemCount = Object.keys(items).length;

	return Object.values(items).every((item) => {
		let current: WorkspaceItem | undefined = item;

		for (let step = 0; step <= itemCount; step += 1) {
			if (!current) {
				return false;
			}

			if (current.id === rootId) {
				return true;
			}

			current = current.parentId === null ? undefined : items[current.parentId];
		}

		return false;
	});
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}
