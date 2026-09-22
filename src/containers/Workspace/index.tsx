import { useState } from 'react';
import styled from 'styled-components';
import { Button, MenuIcon } from '@/components/atoms';
import { ThemeControls } from '@/components/ThemeControls';
import { WorkspaceDialogs } from '@/components/WorkspaceDialogs';
import { WorkspaceMainPanel } from './WorkspaceMainPanel';
import { WorkspaceSidebar } from './WorkspaceSidebar';

const Shell = styled.div`
	display: flex;
	flex-direction: column;
	min-height: 100vh;
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
	flex: 1;
	min-height: 0;

	@media (max-width: ${({ theme }) => theme.compactBreakpoint}) {
		grid-template-columns: 1fr;
	}
`;

export function Workspace() {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	return (
		<Shell>
			<Header>
				<MenuButton type='button' aria-expanded={sidebarOpen} onClick={() => setSidebarOpen(true)}>
					<MenuIcon aria-hidden='true' />
					Folders
				</MenuButton>
				<Title>Mini Workspace Explorer</Title>
				<ThemeControls />
			</Header>

			<Body>
				<WorkspaceSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
				<WorkspaceMainPanel />
			</Body>

			<WorkspaceDialogs />
		</Shell>
	);
}
