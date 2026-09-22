import styled from 'styled-components';

export const EmptyState = styled.p`
	padding: ${({ theme }) => theme.spacing.lg};
	color: ${({ theme }) => theme.colors.textMuted};
	font-size: ${({ theme }) => theme.fontSizes.sm};
	text-align: center;
`;
