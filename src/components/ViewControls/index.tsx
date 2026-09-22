import styled from 'styled-components';
import {
	GridViewIcon,
	IconTint,
	LargeIconsIcon,
	ListViewIcon,
	SmallIconsIcon,
} from '@/components/atoms';
import { useStoreDispatch, useStoreSelector } from '@/store';
import { selectIconSize, selectViewMode } from '@/store/selectors';
import { iconSizeChanged, viewModeChanged } from '@/store/preferencesSlice';

const Groups = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: ${({ theme }) => theme.spacing.md};
`;

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
`;

export function ViewControls() {
	const dispatch = useStoreDispatch();
	const viewMode = useStoreSelector(selectViewMode);
	const iconSize = useStoreSelector(selectIconSize);

	return (
		<Groups>
			<Group role='group' aria-label='Layout'>
				<Toggle
					type='button'
					aria-pressed={viewMode === 'list'}
					onClick={() => dispatch(viewModeChanged('list'))}
				>
					<IconTint $tone='neutral'>
						<ListViewIcon aria-hidden='true' />
					</IconTint>
					List
				</Toggle>
				<Toggle
					type='button'
					aria-pressed={viewMode === 'grid'}
					onClick={() => dispatch(viewModeChanged('grid'))}
				>
					<IconTint $tone='neutral'>
						<GridViewIcon aria-hidden='true' />
					</IconTint>
					Grid
				</Toggle>
			</Group>

			<Group role='group' aria-label='Icon size'>
				<Toggle
					type='button'
					aria-pressed={iconSize === 'small'}
					onClick={() => dispatch(iconSizeChanged('small'))}
				>
					<IconTint $tone='neutral'>
						<SmallIconsIcon aria-hidden='true' />
					</IconTint>
					Small icons
				</Toggle>
				<Toggle
					type='button'
					aria-pressed={iconSize === 'large'}
					onClick={() => dispatch(iconSizeChanged('large'))}
				>
					<IconTint $tone='neutral'>
						<LargeIconsIcon aria-hidden='true' />
					</IconTint>
					Large icons
				</Toggle>
			</Group>
		</Groups>
	);
}
