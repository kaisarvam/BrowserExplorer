import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Button, CloseIcon } from '@/components/atoms';
import { FolderTree } from '@/components/FolderTree';

const Panel = styled.aside<{ $open: boolean }>`
	display: flex;
	flex-direction: column;
	gap: ${({ theme }) => theme.spacing.md};
	padding: ${({ theme }) => theme.spacing.lg};
	border-right: 1px solid ${({ theme }) => theme.colors.border};
	background: ${({ theme }) => theme.colors.surfaceRaised};
	overflow: auto;

	@media (max-width: ${({ theme }) => theme.compactBreakpoint}) {
		position: fixed;
		inset: 0 auto 0 0;
		width: min(18rem, 85vw);
		z-index: 20;
		visibility: ${({ $open }) => ($open ? 'visible' : 'hidden')};
		transform: translateX(${({ $open }) => ($open ? '0' : '-100%')});
		transition:
			transform 160ms ease,
			visibility 0s linear ${({ $open }) => ($open ? '0s' : '160ms')};
	}
`;

const Backdrop = styled.div`
	display: none;

	@media (max-width: ${({ theme }) => theme.compactBreakpoint}) {
		display: block;
		position: fixed;
		inset: 0;
		background: ${({ theme }) => theme.colors.backdrop};
		z-index: 15;
	}
`;

const CloseRow = styled.div`
	display: none;

	@media (max-width: ${({ theme }) => theme.compactBreakpoint}) {
		display: flex;
		justify-content: flex-end;
	}
`;

type WorkspaceSidebarProps = {
	id: string;
	open: boolean;
	onClose: () => void;
};

export function WorkspaceSidebar({ id, open, onClose }: WorkspaceSidebarProps) {
	const closeButtonRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		if (open) {
			closeButtonRef.current?.focus();
		}
	}, [open]);

	return (
		<>
			{open && <Backdrop onClick={onClose} />}

			<Panel
				id={id}
				$open={open}
				aria-label='Workspace folders'
				onKeyDown={(event) => {
					const target = event.target as HTMLElement;

					if (open && event.key === 'Escape' && !target.closest('[role="menu"]')) {
						onClose();
					}
				}}
			>
				<CloseRow>
					<Button ref={closeButtonRef} type='button' $variant='ghost' onClick={onClose}>
						<CloseIcon aria-hidden='true' />
						Close menu
					</Button>
				</CloseRow>

				<FolderTree onFolderSelected={onClose} />
			</Panel>
		</>
	);
}
