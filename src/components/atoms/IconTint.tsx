import styled from 'styled-components';

export const IconTint = styled.span<{ $tone: IconTone; $size?: string }>`
	display: inline-flex;
	flex-shrink: 0;
	line-height: 1;
	color: ${({ theme, $tone }) => theme.iconTones[$tone]};
	font-size: ${({ $size }) => $size ?? 'inherit'};
`;
