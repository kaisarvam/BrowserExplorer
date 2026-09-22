import styled from 'styled-components';
import { FolderTree } from '@/components/FolderTree';

const Panel = styled.aside`
	display: flex;
	flex-direction: column;
	gap: ${({ theme }) => theme.spacing.md};
	padding: ${({ theme }) => theme.spacing.lg};
	border-right: 1px solid ${({ theme }) => theme.colors.border};
	background: ${({ theme }) => theme.colors.surfaceRaised};
	overflow: auto;
`;

export function WorkspaceSidebar() {
	return (
		<Panel aria-label='Workspace folders'>
			<FolderTree />
		</Panel>
	);
}
