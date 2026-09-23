import { useCallback, useRef, useState } from 'react';
import type { MouseEvent } from 'react';

type ContextMenuState<TTarget> = {
	target: TTarget;
	x: number;
	y: number;
};

const KEYBOARD_ANCHOR_OFFSET = 24;

export function useContextMenu<TTarget>() {
	const [menu, setMenu] = useState<ContextMenuState<TTarget> | null>(null);
	const returnFocusRef = useRef<HTMLElement | null>(null);

	const openAt = useCallback((event: MouseEvent<HTMLElement>, target: TTarget) => {
		event.preventDefault();
		event.stopPropagation();

		returnFocusRef.current =
			document.activeElement instanceof HTMLElement ? document.activeElement : null;

		const fromPointer = event.clientX !== 0 || event.clientY !== 0;
		const bounds = event.currentTarget.getBoundingClientRect();

		setMenu({
			target,
			x: fromPointer ? event.clientX : bounds.left + bounds.width / 2,
			y: fromPointer
				? event.clientY
				: bounds.top + Math.min(bounds.height / 2, KEYBOARD_ANCHOR_OFFSET),
		});
	}, []);

	const close = useCallback(() => {
		const returnFocus = returnFocusRef.current;

		returnFocusRef.current = null;
		setMenu(null);

		if (returnFocus?.isConnected && returnFocus !== document.body) {
			returnFocus.focus();
		}
	}, []);

	return { menu, openAt, close };
}
