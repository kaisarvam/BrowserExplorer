import styled from 'styled-components';
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

const Body = styled.div`
	display: grid;
	grid-template-columns: minmax(14rem, 18rem) 1fr;
	flex: 1;
	min-height: 0;
`;

export function Workspace() {
	return (
		<Shell>
			<Header>
				<Title>Mini Workspace Explorer</Title>
			</Header>

			<Body>
				<WorkspaceSidebar />
				<WorkspaceMainPanel />
			</Body>

			<WorkspaceDialogs />
		</Shell>
	);
}
