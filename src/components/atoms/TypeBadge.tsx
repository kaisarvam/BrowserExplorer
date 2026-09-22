import styled from 'styled-components';
import { getTypeLabel } from '@/utils/helpers';

const Badge = styled.span`
	display: inline-block;
	padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
	border-radius: ${({ theme }) => theme.radii.sm};
	background: ${({ theme }) => theme.colors.surface};
	color: ${({ theme }) => theme.colors.textMuted};
	font-size: ${({ theme }) => theme.fontSizes.xs};
`;

export function TypeBadge({ item }: { item: WorkspaceItem }) {
	return <Badge>{getTypeLabel(item)}</Badge>;
}
