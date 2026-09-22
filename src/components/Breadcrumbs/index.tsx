import styled from 'styled-components';
import { useStoreDispatch, useStoreSelector } from '@/store';
import { selectBreadcrumbs } from '@/store/selectors';
import { navigationRequested } from '@/store/workspaceSlice';

const List = styled.ol`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: ${({ theme }) => theme.spacing.xs};
	font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const Separator = styled.span`
	color: ${({ theme }) => theme.colors.textMuted};
`;

const Crumb = styled.button`
	border: none;
	background: none;
	padding: ${({ theme }) => theme.spacing.xs};
	border-radius: ${({ theme }) => theme.radii.sm};
	color: ${({ theme }) => theme.colors.accent};
	cursor: pointer;

	&[aria-current='page'] {
		color: ${({ theme }) => theme.colors.text};
		font-weight: 600;
		cursor: default;
	}
`;

export function Breadcrumbs() {
	const dispatch = useStoreDispatch();
	const breadcrumbs = useStoreSelector(selectBreadcrumbs);

	return (
		<nav aria-label='Breadcrumb'>
			<List>
				{breadcrumbs.map((item, index) => {
					const isCurrent = index === breadcrumbs.length - 1;

					return (
						<li key={item.id}>
							{index > 0 && <Separator aria-hidden='true'>/</Separator>}
							<Crumb
								type='button'
								aria-current={isCurrent ? 'page' : undefined}
								disabled={isCurrent}
								onClick={() => dispatch(navigationRequested({ kind: 'folder', folderId: item.id }))}
							>
								{item.name}
							</Crumb>
						</li>
					);
				})}
			</List>
		</nav>
	);
}
