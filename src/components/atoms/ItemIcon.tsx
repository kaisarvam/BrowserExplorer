import { EmptyFileIcon, FileIcon, FolderIcon, FolderOpenIcon } from './icons';
import { IconTint } from './IconTint';
import { getFileTone } from '@/utils/helpers';

type ItemIconProps = {
	item: WorkspaceItem;
	size: string;

	open?: boolean;
};

export function ItemIcon({ item, size, open = false }: ItemIconProps) {
	if (item.type === 'folder') {
		return (
			<IconTint $tone={open ? 'folderOpen' : 'folder'} $size={size} aria-hidden='true'>
				{open ? <FolderOpenIcon /> : <FolderIcon />}
			</IconTint>
		);
	}

	const isEmpty = item.content === '';

	return (
		<IconTint $tone={getFileTone(item.name, isEmpty)} $size={size} aria-hidden='true'>
			{isEmpty ? <EmptyFileIcon /> : <FileIcon />}
		</IconTint>
	);
}
