import styled, { useTheme } from 'styled-components';
import { EmptyState, ItemIcon, TypeBadge, VisuallyHidden } from '@/components/atoms';
import { CreateContextMenu } from '@/components/ContextMenu/CreateContextMenu';
import { ItemContextMenu } from '@/components/ContextMenu/ItemContextMenu';
import { useContextMenu } from '@/hooks';
import { useStoreDispatch, useStoreSelector } from '@/store';
import { selectFolderContents, selectIconSize, selectViewMode } from '@/store/selectors';
import { dialogOpened, navigationRequested } from '@/store/workspaceSlice';
import { getTypeLabel } from '@/utils/helpers';
import { ItemActions } from './ItemActions';

const Surface = styled.div`
	min-height: 12rem;
`;

const Table = styled.table`
	width: 100%;
	border-collapse: collapse;
	border: 1px solid ${({ theme }) => theme.colors.border};
	border-radius: ${({ theme }) => theme.radii.md};
	background: ${({ theme }) => theme.colors.surfaceRaised};
	overflow: hidden;
`;

const HeaderCell = styled.th`
	padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
	border-bottom: 1px solid ${({ theme }) => theme.colors.border};
	background: ${({ theme }) => theme.colors.surface};
	color: ${({ theme }) => theme.colors.textMuted};
	font-size: ${({ theme }) => theme.fontSizes.xs};
	font-weight: 600;
	letter-spacing: 0.04em;
	text-align: left;
	text-transform: uppercase;
`;

const Cell = styled.td`
	padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
	vertical-align: middle;
`;

const Row = styled.tr`
	&:nth-child(even) > td {
		background: ${({ theme }) => theme.colors.surface};
	}

	&:not(:last-child) > td {
		border-bottom: 1px solid ${({ theme }) => theme.colors.border};
	}

	&:hover > td {
		background: ${({ theme }) => theme.colors.accentSurface};
	}
`;

const TypeCell = styled(Cell)`
	width: 1%;
	color: ${({ theme }) => theme.colors.textMuted};
	font-size: ${({ theme }) => theme.fontSizes.sm};
	white-space: nowrap;
`;

const ActionCell = styled(Cell)`
	width: 1%;
	white-space: nowrap;
`;

const NameButton = styled.button`
	display: flex;
	align-items: center;
	gap: ${({ theme }) => theme.spacing.md};
	width: 100%;
	padding: ${({ theme }) => `${theme.spacing.sm} 0`};
	border: none;
	background: none;
	font-size: ${({ theme }) => theme.fontSizes.sm};
	text-align: left;
	overflow-wrap: anywhere;
	cursor: pointer;
`;

const TableWrapper = styled.div`
	@media (max-width: ${({ theme }) => theme.compactBreakpoint}) {
		${Table} {
			border: none;
			background: none;
		}

		thead {
			display: none;
		}

		${Row} {
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			gap: ${({ theme }) => theme.spacing.xs};
			margin-bottom: ${({ theme }) => theme.spacing.sm};
			padding: ${({ theme }) => theme.spacing.sm};
			border: 1px solid ${({ theme }) => theme.colors.border};
			border-radius: ${({ theme }) => theme.radii.sm};
			background: ${({ theme }) => theme.colors.surfaceRaised};
		}

		${Row}:nth-child(even) > td {
			background: none;
		}

		${Cell} {
			width: auto;
			padding: 0;
			border: none;
		}

		${ActionCell} {
			white-space: normal;
		}

		${ActionCell} > div {
			flex-wrap: wrap;
			justify-content: flex-start;
		}
	}
`;

const Grid = styled.ul<{ $tileWidth: string }>`
	display: grid;
	grid-template-columns: ${({ $tileWidth }) => `repeat(auto-fill, minmax(${$tileWidth}, 1fr))`};
	gap: ${({ theme }) => theme.spacing.md};
`;

const GridTile = styled.li`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: ${({ theme }) => theme.spacing.sm};
	height: 100%;
	padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.sm}`};
	border: 1px solid ${({ theme }) => theme.colors.border};
	border-radius: ${({ theme }) => theme.radii.md};
	background: ${({ theme }) => theme.colors.surfaceRaised};
	text-align: center;

	&:hover {
		border-color: ${({ theme }) => theme.colors.borderStrong};
	}
`;

const TileFooter = styled.div`
	margin-top: auto;
	padding-top: ${({ theme }) => theme.spacing.xs};
`;

const TileButton = styled.button`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: ${({ theme }) => theme.spacing.sm};
	width: 100%;
	padding: 0;
	border: none;
	background: none;
	font-size: ${({ theme }) => theme.fontSizes.sm};
	overflow-wrap: anywhere;
	cursor: pointer;
`;

const TileGlyph = styled.span<{ $slot: string }>`
	display: grid;
	place-items: center;
	min-height: ${({ $slot }) => $slot};
`;

export function FolderContents() {
	const dispatch = useStoreDispatch();
	const theme = useTheme();
	const contents = useStoreSelector(selectFolderContents);
	const viewMode = useStoreSelector(selectViewMode);
	const iconSize = useStoreSelector(selectIconSize);
	const { menu, openAt, close } = useContextMenu<WorkspaceItem | null>();

	const isGrid = viewMode === 'grid';
	const isLarge = iconSize === 'large';

	const glyphSize = isGrid
		? isLarge
			? theme.iconSizes.gridLarge
			: theme.iconSizes.gridSmall
		: isLarge
			? theme.iconSizes.listLarge
			: theme.iconSizes.listSmall;

	function open(item: WorkspaceItem) {
		dispatch(
			item.type === 'folder'
				? navigationRequested({ kind: 'folder', folderId: item.id })
				: dialogOpened({ kind: 'preview', fileId: item.id })
		);
	}

	function openLabel(item: WorkspaceItem) {
		return item.type === 'folder' ? `Open folder ${item.name}` : `Preview file ${item.name}`;
	}

	return (
		<Surface onContextMenu={(event) => openAt(event, null)}>
			{contents.length === 0 ? (
				<EmptyState>This folder is empty. Use New folder or New file to add something.</EmptyState>
			) : isGrid ? (
				<Grid $tileWidth={isLarge ? '12rem' : '10.5rem'} aria-label='Folder contents'>
					{contents.map((item) => (
						<GridTile key={item.id} onContextMenu={(event) => openAt(event, item)}>
							<TileButton type='button' aria-label={openLabel(item)} onClick={() => open(item)}>
								<TileGlyph $slot={glyphSize}>
									<ItemIcon item={item} size={glyphSize} />
								</TileGlyph>
								{item.name}
							</TileButton>
							<TypeBadge item={item} />
							<TileFooter>
								<ItemActions item={item} compact />
							</TileFooter>
						</GridTile>
					))}
				</Grid>
			) : (
				<TableWrapper>
					<Table aria-label='Folder contents'>
						<thead>
							<tr>
								<HeaderCell scope='col'>Name</HeaderCell>
								<HeaderCell scope='col'>Type</HeaderCell>
								<HeaderCell scope='col'>
									<VisuallyHidden>Actions</VisuallyHidden>
								</HeaderCell>
							</tr>
						</thead>
						<tbody>
							{contents.map((item) => (
								<Row key={item.id} onContextMenu={(event) => openAt(event, item)}>
									<Cell>
										<NameButton
											type='button'
											aria-label={openLabel(item)}
											onClick={() => open(item)}
										>
											<ItemIcon item={item} size={glyphSize} />
											{item.name}
										</NameButton>
									</Cell>
									<TypeCell>{getTypeLabel(item)}</TypeCell>
									<ActionCell>
										<ItemActions item={item} compact={false} />
									</ActionCell>
								</Row>
							))}
						</tbody>
					</Table>
				</TableWrapper>
			)}

			{menu &&
				(menu.target ? (
					<ItemContextMenu item={menu.target} x={menu.x} y={menu.y} onClose={close} />
				) : (
					<CreateContextMenu x={menu.x} y={menu.y} onClose={close} />
				))}
		</Surface>
	);
}
