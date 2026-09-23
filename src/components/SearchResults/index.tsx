import styled from 'styled-components';
import { EmptyState, ItemIcon, TypeBadge, VisuallyHidden } from '@/components/atoms';
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

const Match = styled.mark`
	padding: 0;
	border-radius: 2px;
	background: ${({ theme }) => theme.colors.warningSurface};
	color: inherit;
	font-weight: 600;
`;

function HighlightedName({ name, query }: { name: string; query: string }) {
	const start = query === '' ? -1 : name.toLocaleLowerCase().indexOf(query);

	if (start === -1) {
		return <>{name}</>;
	}

	const end = start + query.length;

	return (
		<span>
			{name.slice(0, start)}
			<Match>{name.slice(start, end)}</Match>
			{name.slice(end)}
		</span>
	);
}

export function SearchResults() {
	const dispatch = useStoreDispatch();
	const items = useStoreSelector(selectItems);
	const results = useStoreSelector(selectSearchResults);
	const searchQuery = useStoreSelector(selectSearchQuery);
	const normalisedQuery = searchQuery.trim().toLocaleLowerCase();

	return (
		<>
			<VisuallyHidden role='status'>
				{results.length === 1 ? '1 result' : `${results.length} results`}
			</VisuallyHidden>

			{results.length === 0 ? (
				<EmptyState>No folders or files match &ldquo;{searchQuery.trim()}&rdquo;.</EmptyState>
			) : (
				<List>
					{results.map((item) => {
						const location = getPath(items, item.id)
							.slice(0, -1)
							.map((ancestor) => ancestor.name)
							.join(' / ');

						return (
							<Row key={item.id}>
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
										<HighlightedName name={item.name} query={normalisedQuery} />
									</Name>
									<Location>{location}</Location>
								</OpenButton>

								<TypeBadge item={item} />
							</Row>
						);
					})}
				</List>
			)}
		</>
	);
}
