import styled from 'styled-components';

export const FieldError = styled.p`
	margin-top: ${({ theme }) => theme.spacing.xs};
	color: ${({ theme }) => theme.colors.danger};
	font-size: ${({ theme }) => theme.fontSizes.sm};
`;
