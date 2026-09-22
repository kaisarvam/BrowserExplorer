import { useItemActions } from '@/hooks';
import { ContextMenu } from '.';

type ItemContextMenuProps = {
	item: WorkspaceItem;
	x: number;
	y: number;
	onClose: () => void;
};

export function ItemContextMenu({ item, x, y, onClose }: ItemContextMenuProps) {
	const actions = useItemActions(item);

	return <ContextMenu x={x} y={y} label={item.name} actions={actions} onClose={onClose} />;
}
