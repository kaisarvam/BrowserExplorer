import { useCreateActions } from '@/hooks';
import { ContextMenu } from '.';

type CreateContextMenuProps = {
	x: number;
	y: number;
	onClose: () => void;
};

export function CreateContextMenu({ x, y, onClose }: CreateContextMenuProps) {
	const actions = useCreateActions();

	return <ContextMenu x={x} y={y} label='Folder actions' actions={actions} onClose={onClose} />;
}
