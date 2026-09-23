import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';
import styled from 'styled-components';
import { IconTint } from '@/components/atoms';

const Menu = styled.ul<{ $x: number; $y: number }>`
	position: fixed;
	left: ${({ $x }) => `${$x}px`};
	top: ${({ $y }) => `${$y}px`};
	z-index: 30;
	min-width: 11rem;
	padding: ${({ theme }) => theme.spacing.xs};
	border: 1px solid ${({ theme }) => theme.colors.border};
	border-radius: ${({ theme }) => theme.radii.md};
	background: ${({ theme }) => theme.colors.surfaceRaised};
	box-shadow: ${({ theme }) => theme.shadows.menu};
`;

const MenuButton = styled.button`
	display: flex;
	align-items: center;
	gap: ${({ theme }) => theme.spacing.sm};
	width: 100%;
	padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
	border: none;
	border-radius: ${({ theme }) => theme.radii.sm};
	background: none;
	font-size: ${({ theme }) => theme.fontSizes.sm};
	text-align: left;
	white-space: nowrap;
	cursor: pointer;

	&:hover,
	&:focus-visible {
		background: ${({ theme }) => theme.colors.surface};
	}
`;

const MARGIN = 8;

function findTargetIndex(key: string, labels: string[], current: number): number | null {
	const count = labels.length;

	if (key === 'ArrowDown') {
		return (current + 1) % count;
	}

	if (key === 'ArrowUp') {
		return (current - 1 + count) % count;
	}

	if (key === 'Home') {
		return 0;
	}

	if (key === 'End') {
		return count - 1;
	}

	if (key.length !== 1 || key.trim() === '') {
		return null;
	}

	const letter = key.toLocaleLowerCase();

	for (let step = 1; step <= count; step += 1) {
		const index = (current + step) % count;

		if (labels[index]?.trim().toLocaleLowerCase().startsWith(letter)) {
			return index;
		}
	}

	return null;
}

type ContextMenuProps = {
	x: number;
	y: number;
	label: string;
	actions: ItemAction[];
	onClose: () => void;
};

export function ContextMenu({ x, y, label, actions, onClose }: ContextMenuProps) {
	const menuRef = useRef<HTMLUListElement>(null);
	const [position, setPosition] = useState({ x, y });

	useLayoutEffect(() => {
		const bounds = menuRef.current?.getBoundingClientRect();

		if (!bounds || bounds.width === 0) {
			return;
		}

		setPosition({
			x: Math.max(MARGIN, Math.min(x, window.innerWidth - bounds.width - MARGIN)),
			y: Math.max(MARGIN, Math.min(y, window.innerHeight - bounds.height - MARGIN)),
		});
	}, [x, y]);

	useEffect(() => {
		menuRef.current?.querySelector('button')?.focus();

		function handleKeyDown(event: globalThis.KeyboardEvent) {
			if (event.key === 'Escape') {
				onClose();
			}
		}

		function handlePointerDown(event: PointerEvent) {
			if (!menuRef.current?.contains(event.target as Node)) {
				onClose();
			}
		}

		document.addEventListener('keydown', handleKeyDown);
		document.addEventListener('pointerdown', handlePointerDown);
		window.addEventListener('resize', onClose);
		window.addEventListener('scroll', onClose, true);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
			document.removeEventListener('pointerdown', handlePointerDown);
			window.removeEventListener('resize', onClose);
			window.removeEventListener('scroll', onClose, true);
		};
	}, [onClose]);

	function handleMenuKeyDown(event: KeyboardEvent<HTMLUListElement>) {
		if (event.key === 'Tab') {
			event.preventDefault();
			onClose();
			return;
		}

		const buttons = Array.from(menuRef.current?.querySelectorAll('button') ?? []);
		const current = buttons.indexOf(document.activeElement as HTMLButtonElement);
		const next = findTargetIndex(
			event.key,
			buttons.map((button) => button.textContent ?? ''),
			current
		);

		if (next === null) {
			return;
		}

		event.preventDefault();
		buttons[next]?.focus();
	}

	return (
		<Menu
			ref={menuRef}
			role='menu'
			aria-label={label}
			$x={position.x}
			$y={position.y}
			onKeyDown={handleMenuKeyDown}
		>
			{actions.map(({ key, text, tone, Icon, run }) => (
				<li key={key} role='none'>
					<MenuButton
						type='button'
						role='menuitem'
						onClick={() => {
							run();
							onClose();
						}}
					>
						<IconTint $tone={tone}>
							<Icon aria-hidden='true' />
						</IconTint>
						{text}
					</MenuButton>
				</li>
			))}
		</Menu>
	);
}
