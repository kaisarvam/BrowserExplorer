function extensionOf(name: string): string {
	const lastDot = name.lastIndexOf('.');

	if (lastDot <= 0 || lastDot === name.length - 1) {
		return '';
	}

	return name.slice(lastDot + 1).toLocaleLowerCase();
}

export function getTypeLabel(item: WorkspaceItem): string {
	if (item.type === 'folder') {
		return 'Folder';
	}

	const extension = extensionOf(item.name);

	return extension === '' ? 'File' : `${extension.toLocaleUpperCase()} file`;
}
