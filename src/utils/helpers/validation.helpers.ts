import { hasSiblingNamed } from './tree.helpers';

type ValidateNameOptions = {
	items: WorkspaceItems;
	parentId: WorkspaceItemId;
	name: string;

	ignoreItemId?: WorkspaceItemId;
};

export function validateItemName({
	items,
	parentId,
	name,
	ignoreItemId,
}: ValidateNameOptions): NameValidationResult {
	const trimmedName = name.trim();

	if (trimmedName === '') {
		return { status: 'invalid', message: 'Name cannot be empty.' };
	}

	if (hasSiblingNamed(items, parentId, trimmedName, ignoreItemId)) {
		return { status: 'invalid', message: 'An item with this name already exists in this folder.' };
	}

	return { status: 'valid', name: trimmedName };
}
