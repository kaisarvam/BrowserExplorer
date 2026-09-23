import { useEffect, useId, useRef } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
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

const FOCUSABLE = 'input, textarea, button, [href], select, [tabindex]:not([tabindex="-1"])';

type ModalProps = {
	title: string;
	onClose: () => void;
	children: ReactNode;
	actions: ReactNode;
};

export function Modal({ title, onClose, children, actions }: ModalProps) {
	const titleId = useId();
	const panelRef = useRef<HTMLDivElement>(null);
	const onCloseRef = useRef(onClose);

	useEffect(() => {
		onCloseRef.current = onClose;
	}, [onClose]);

	useEffect(() => {
		const previouslyFocused = document.activeElement;
		const appRoot = document.getElementById('root');

		appRoot?.setAttribute('inert', '');

		const focusTarget = panelRef.current?.querySelector<HTMLElement>(
			'input, textarea, button, [href], select'
		);
		focusTarget?.focus();

		function keepFocusInside(event: KeyboardEvent) {
			const focusable = Array.from(
				panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []
			);
			const first = focusable[0];
			const last = focusable.at(-1);

			if (!first || !last) {
				return;
			}

			const focusIsInside = panelRef.current?.contains(document.activeElement) ?? false;

			if (event.shiftKey && (document.activeElement === first || !focusIsInside)) {
				event.preventDefault();
				last.focus();
				return;
			}

			if (!event.shiftKey && (document.activeElement === last || !focusIsInside)) {
				event.preventDefault();
				first.focus();
			}
		}

		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === 'Escape') {
				onCloseRef.current();
				return;
			}

			if (event.key === 'Tab') {
				keepFocusInside(event);
			}
		}

		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
			appRoot?.removeAttribute('inert');

			if (previouslyFocused instanceof HTMLElement && previouslyFocused.isConnected) {
				previouslyFocused.focus();
				return;
			}

			document.querySelector<HTMLElement>('main')?.focus();
		};
	}, []);

	return createPortal(
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
		</Backdrop>,
		document.body
	);
}
