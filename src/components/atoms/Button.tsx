import styled, { css } from 'styled-components';
import type { DefaultTheme } from 'styled-components';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

const variantStyles = {
	primary: (theme: DefaultTheme) => css`
		background: ${theme.colors.accent};
		color: ${theme.colors.onAccent};

		&:hover:not(:disabled) {
			filter: brightness(0.94);
		}
	`,
	secondary: (theme: DefaultTheme) => css`
		background: ${theme.colors.surfaceRaised};
		border-color: ${theme.colors.border};
		color: ${theme.colors.text};

		&:hover:not(:disabled) {
			border-color: ${theme.colors.borderStrong};
		}
	`,
	danger: (theme: DefaultTheme) => css`
		background: ${theme.colors.danger};
		color: ${theme.colors.onDanger};

		&:hover:not(:disabled) {
			filter: brightness(0.94);
		}
	`,
	ghost: (theme: DefaultTheme) => css`
		background: transparent;
		color: ${theme.colors.textMuted};

		&:hover:not(:disabled) {
			background: ${theme.colors.accentSurface};
			color: ${theme.colors.text};
		}
	`,
} satisfies Record<ButtonVariant, (theme: DefaultTheme) => ReturnType<typeof css>>;

export const Button = styled.button<{ $variant?: ButtonVariant }>`
	display: inline-flex;
	align-items: center;
	gap: ${({ theme }) => theme.spacing.xs};
	padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
	border-radius: ${({ theme }) => theme.radii.sm};
	border: 1px solid transparent;
	font-size: ${({ theme }) => theme.fontSizes.sm};
	cursor: pointer;

	&:disabled {
		cursor: not-allowed;
		opacity: 0.55;
	}

	${({ theme, $variant = 'secondary' }) => variantStyles[$variant](theme)}
`;
