import { useCallback, useState } from 'react';
import type { MouseEvent } from 'react';

type ContextMenuState<TTarget> = {
	target: TTarget;
	x: number;
	y: number;
};

export function useContextMenu<TTarget>() {
	const [menu, setMenu] = useState<ContextMenuState<TTarget> | null>(null);

	const openAt = useCallback((event: MouseEvent<HTMLElement>, target: TTarget) => {
		event.preventDefault();
		event.stopPropagation();

		const fromPointer = event.clientX !== 0 || event.clientY !== 0;
		const bounds = event.currentTarget.getBoundingClientRect();

		setMenu({
			target,
			x: fromPointer ? event.clientX : bounds.left + bounds.width / 2,
			y: fromPointer ? event.clientY : bounds.top + bounds.height / 2,
		});
	}, []);

	const close = useCallback(() => setMenu(null), []);

	return { menu, openAt, close };
}
