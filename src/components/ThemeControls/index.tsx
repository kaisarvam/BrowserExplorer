import styled from 'styled-components';
import { DarkIcon, IconTint, LightIcon, SystemIcon } from '@/components/atoms';
import { useStoreDispatch, useStoreSelector } from '@/store';
import { colorSchemeChanged } from '@/store/preferencesSlice';
import { selectColorScheme } from '@/store/selectors';

const Group = styled.div`
	display: flex;
	border: 1px solid ${({ theme }) => theme.colors.border};
	border-radius: ${({ theme }) => theme.radii.sm};
	overflow: hidden;
`;

const Toggle = styled.button`
	display: inline-flex;
	align-items: center;
	gap: ${({ theme }) => theme.spacing.xs};
	padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
	border: none;
	background: ${({ theme }) => theme.colors.surfaceRaised};
	color: ${({ theme }) => theme.colors.textMuted};
	font-size: ${({ theme }) => theme.fontSizes.sm};
	cursor: pointer;

	& + & {
		border-left: 1px solid ${({ theme }) => theme.colors.border};
	}

	&[aria-pressed='true'] {
		background: ${({ theme }) => theme.colors.accentSurface};
		color: ${({ theme }) => theme.colors.text};
		font-weight: 600;
	}

	@media (max-width: ${({ theme }) => theme.compactBreakpoint}) {
		span:last-child {
			display: none;
		}
	}
`;

const choices = [
	{ value: 'light', text: 'Light', Icon: LightIcon },
	{ value: 'dark', text: 'Dark', Icon: DarkIcon },
	{ value: 'system', text: 'System', Icon: SystemIcon },
] as const;

export function ThemeControls() {
	const dispatch = useStoreDispatch();
	const colorScheme = useStoreSelector(selectColorScheme);

	return (
		<Group role='group' aria-label='Colour scheme'>
			{choices.map(({ value, text, Icon }) => (
				<Toggle
					key={value}
					type='button'
					aria-pressed={colorScheme === value}
					aria-label={text}
					onClick={() => dispatch(colorSchemeChanged(value))}
				>
					<IconTint $tone='neutral'>
						<Icon aria-hidden='true' />
					</IconTint>
					<span>{text}</span>
				</Toggle>
			))}
		</Group>
	);
}
