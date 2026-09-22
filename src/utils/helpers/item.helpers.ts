export function getFileTone(name: string, isEmpty: boolean): FileIconTone {
	if (isEmpty) {
		return 'fileEmpty';
	}

	return extensionTones[extensionOf(name)] ?? 'fileGeneric';
}

const extensionTones: Record<string, FileIconTone> = {
	txt: 'fileText',
	text: 'fileText',
	md: 'fileMarkdown',
	markdown: 'fileMarkdown',
	json: 'fileData',
	yml: 'fileData',
	yaml: 'fileData',
	csv: 'fileSheet',
	tsv: 'fileSheet',
	log: 'fileLog',
};

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
