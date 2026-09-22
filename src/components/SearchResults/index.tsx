import styled from 'styled-components';
import { EmptyState, ItemIcon, TypeBadge } from '@/components/atoms';
import { useStoreDispatch, useStoreSelector } from '@/store';
import { selectItems, selectSearchQuery, selectSearchResults } from '@/store/selectors';
import { navigationRequested, pathExpanded } from '@/store/workspaceSlice';
import { getPath } from '@/utils/helpers';

const List = styled.ul`
	display: flex;
	flex-direction: column;
	gap: ${({ theme }) => theme.spacing.xs};
`;

const Row = styled.li`
	display: flex;
	align-items: center;
	gap: ${({ theme }) => theme.spacing.md};
	padding: ${({ theme }) => theme.spacing.sm};
	border: 1px solid ${({ theme }) => theme.colors.border};
	border-radius: ${({ theme }) => theme.radii.sm};
	background: ${({ theme }) => theme.colors.surfaceRaised};
`;

const OpenButton = styled.button`
	flex: 1;
	min-width: 0;
	border: none;
	background: none;
	text-align: left;
	cursor: pointer;
`;

const Name = styled.span`
	display: flex;
	align-items: center;
	gap: ${({ theme }) => theme.spacing.sm};
	font-size: ${({ theme }) => theme.fontSizes.sm};
	overflow-wrap: anywhere;
`;

const Location = styled.span`
	display: block;
	color: ${({ theme }) => theme.colors.textMuted};
	font-size: ${({ theme }) => theme.fontSizes.xs};
`;

export function SearchResults() {
	const dispatch = useStoreDispatch();
	const items = useStoreSelector(selectItems);
	const results = useStoreSelector(selectSearchResults);
	const searchQuery = useStoreSelector(selectSearchQuery);

	if (results.length === 0) {
		return <EmptyState>No folders or files match &ldquo;{searchQuery.trim()}&rdquo;.</EmptyState>;
	}

	return (
		<List>
			{results.map((item) => {
				const location = getPath(items, item.id)
					.slice(0, -1)
					.map((ancestor) => ancestor.name)
					.join(' / ');

				return (
					<Row key={item.id}>
						<TypeBadge item={item} />

						<OpenButton
							type='button'
							onClick={() => {
								dispatch(pathExpanded(item.id));
								dispatch(
									navigationRequested(
										item.type === 'folder'
											? { kind: 'folder', folderId: item.id }
											: { kind: 'file', fileId: item.id }
									)
								);
							}}
						>
							<Name>
								<ItemIcon item={item} size='1.25rem' />
								{item.name}
							</Name>
							<Location>{location}</Location>
						</OpenButton>
					</Row>
				);
			})}
		</List>
	);
}
