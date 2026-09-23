import { useCallback, useId, useRef, useState } from 'react';
import styled from 'styled-components';
import { Button, MenuIcon } from '@/components/atoms';
import { Notice } from '@/components/Notice';
import { ThemeControls } from '@/components/ThemeControls';
import { WorkspaceDialogs } from '@/components/WorkspaceDialogs';
import { useUnsavedChangesGuard } from '@/hooks';
import { APP_TITLE } from '@/utils/constants';
import { WorkspaceMainPanel } from './WorkspaceMainPanel';
import { WorkspaceSidebar } from './WorkspaceSidebar';

const Shell = styled.div`
	display: flex;
	flex-direction: column;
	height: 100vh;
	height: 100dvh;
`;

const Header = styled.header`
	display: flex;
	align-items: center;
	gap: ${({ theme }) => theme.spacing.md};
	padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
	border-bottom: 1px solid ${({ theme }) => theme.colors.border};
	background: ${({ theme }) => theme.colors.surfaceRaised};
`;

const Title = styled.h1`
	flex: 1;
	font-size: ${({ theme }) => theme.fontSizes.md};
`;

const MenuButton = styled(Button)`
	@media (min-width: ${({ theme }) => theme.compactBreakpoint}) {
		display: none;
	}
`;

const Body = styled.div`
	display: grid;
	grid-template-columns: minmax(14rem, 18rem) 1fr;
	grid-template-rows: minmax(0, 1fr);
	flex: 1;
	min-height: 0;

	@media (max-width: ${({ theme }) => theme.compactBreakpoint}) {
		grid-template-columns: 1fr;
	}
`;

export function Workspace() {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const sidebarId = useId();
	const menuButtonRef = useRef<HTMLButtonElement>(null);

	useUnsavedChangesGuard();

	const closeSidebar = useCallback(() => {
		setSidebarOpen(false);
		menuButtonRef.current?.focus();
	}, []);

	return (
		<Shell>
			<Header>
				<MenuButton
					ref={menuButtonRef}
					type='button'
					aria-expanded={sidebarOpen}
					aria-controls={sidebarId}
					onClick={() => setSidebarOpen(true)}
				>
					<MenuIcon aria-hidden='true' />
					Folders
				</MenuButton>
				<Title>{APP_TITLE}</Title>
				<ThemeControls />
			</Header>

			<Body>
				<WorkspaceSidebar id={sidebarId} open={sidebarOpen} onClose={closeSidebar} />
				<WorkspaceMainPanel />
			</Body>

			<WorkspaceDialogs />
			<Notice />
		</Shell>
	);
}
