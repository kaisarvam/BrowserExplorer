import { useEffect, useId, useRef } from 'react';
import type { ReactNode } from 'react';
import styled from 'styled-components';

const Backdrop = styled.div`
	position: fixed;
	inset: 0;
	display: grid;
	place-items: center;
	padding: ${({ theme }) => theme.spacing.lg};
	background: ${({ theme }) => theme.colors.backdrop};
	z-index: 10;
`;

const Panel = styled.div`
	width: min(28rem, 100%);
	padding: ${({ theme }) => theme.spacing.xl};
	border-radius: ${({ theme }) => theme.radii.md};
	background: ${({ theme }) => theme.colors.surfaceRaised};
`;

const Title = styled.h2`
	margin-bottom: ${({ theme }) => theme.spacing.md};
	font-size: ${({ theme }) => theme.fontSizes.lg};
`;

const Actions = styled.div`
	display: flex;
	justify-content: flex-end;
	gap: ${({ theme }) => theme.spacing.sm};
	margin-top: ${({ theme }) => theme.spacing.xl};
`;

type ModalProps = {
	title: string;
	onClose: () => void;
	children: ReactNode;
	actions: ReactNode;
};

export function Modal({ title, onClose, children, actions }: ModalProps) {
	const titleId = useId();
	const panelRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const previouslyFocused = document.activeElement;

		const focusTarget = panelRef.current?.querySelector<HTMLElement>(
			'input, textarea, button, [href], select'
		);
		focusTarget?.focus();

		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === 'Escape') {
				onClose();
			}
		}

		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);

			if (previouslyFocused instanceof HTMLElement) {
				previouslyFocused.focus();
			}
		};
	}, [onClose]);

	return (
		<Backdrop
			onMouseDown={(event) => {
				if (event.target === event.currentTarget) {
					onClose();
				}
			}}
		>
			<Panel ref={panelRef} role='dialog' aria-modal='true' aria-labelledby={titleId}>
				<Title id={titleId}>{title}</Title>
				{children}
				<Actions>{actions}</Actions>
			</Panel>
		</Backdrop>
	);
}
