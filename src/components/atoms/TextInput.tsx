import styled from 'styled-components';

export const TextInput = styled.input<{ $invalid?: boolean }>`
	width: 100%;
	padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
	border: 1px solid
		${({ theme, $invalid }) => ($invalid ? theme.colors.danger : theme.colors.border)};
	border-radius: ${({ theme }) => theme.radii.sm};
	background: ${({ theme }) => theme.colors.surfaceRaised};
	font-size: ${({ theme }) => theme.fontSizes.sm};
`;
