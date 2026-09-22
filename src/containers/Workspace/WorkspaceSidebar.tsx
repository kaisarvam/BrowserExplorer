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
		transform: translateX(${({ $open }) => ($open ? '0' : '-100%')});
		transition: transform 160ms ease;
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
	open: boolean;
	onClose: () => void;
};

export function WorkspaceSidebar({ open, onClose }: WorkspaceSidebarProps) {
	return (
		<>
			{open && <Backdrop onClick={onClose} />}

			<Panel $open={open} aria-label='Workspace folders'>
				<CloseRow>
					<Button type='button' $variant='ghost' onClick={onClose}>
						<CloseIcon aria-hidden='true' />
						Close menu
					</Button>
				</CloseRow>

				<FolderTree onFolderSelected={onClose} />
			</Panel>
		</>
	);
}
