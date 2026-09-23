import { useEffect, useRef } from 'react';
import styled, { useTheme } from 'styled-components';
import {
	Button,
	EmptyState,
	IconTint,
	ItemIcon,
	TypeBadge,
	VisuallyHidden,
} from '@/components/atoms';
import { CreateContextMenu } from '@/components/ContextMenu/CreateContextMenu';
import { ItemContextMenu } from '@/components/ContextMenu/ItemContextMenu';
import { useContextMenu, useCreateActions } from '@/hooks';
import { useStoreDispatch, useStoreSelector } from '@/store';
import {
	selectFolderContents,
	selectIconSize,
	selectLastCreatedItemId,
	selectViewMode,
} from '@/store/selectors';
import { createdItemAcknowledged, dialogOpened, navigationRequested } from '@/store/workspaceSlice';
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

	&:hover > td,
	&:focus-within > td {
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

	@media (hover: hover) and (min-width: ${({ theme }) => theme.compactBreakpoint}) {
		${ActionCell} > div {
			opacity: 0;
			transition: opacity 120ms ease;
		}

		${Row}:hover ${ActionCell} > div,
		${Row}:focus-within ${ActionCell} > div {
			opacity: 1;
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

	&:hover,
	&:focus-within {
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
	cursor: pointer;
`;

const TileName = styled.span`
	display: -webkit-box;
	overflow: hidden;
	overflow-wrap: anywhere;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	line-clamp: 2;
`;

const TileGlyph = styled.span<{ $slot: string }>`
	display: grid;
	place-items: center;
	min-height: ${({ $slot }) => $slot};
`;

const EmptyPanel = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: ${({ theme }) => theme.spacing.sm};
	padding-bottom: ${({ theme }) => theme.spacing.lg};
`;

const EmptyActions = styled.div`
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	gap: ${({ theme }) => theme.spacing.sm};
`;

function revealCreatedItem(element: HTMLElement, highlight: string): void {
	element.querySelector('button')?.focus({ preventScroll: true });
	element.scrollIntoView({ block: 'nearest' });

	if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
		return;
	}

	const targets = element instanceof HTMLTableRowElement ? Array.from(element.cells) : [element];

	for (const target of targets) {
		const resting = window.getComputedStyle(target).backgroundColor;

		target.animate([{ backgroundColor: highlight }, { backgroundColor: resting }], {
			duration: 1200,
			easing: 'ease-out',
		});
	}
}

export function FolderContents() {
	const dispatch = useStoreDispatch();
	const theme = useTheme();
	const contents = useStoreSelector(selectFolderContents);
	const viewMode = useStoreSelector(selectViewMode);
	const iconSize = useStoreSelector(selectIconSize);
	const lastCreatedItemId = useStoreSelector(selectLastCreatedItemId);
	const createActions = useCreateActions();
	const { menu, openAt, close } = useContextMenu<WorkspaceItem | null>();
	const surfaceRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (lastCreatedItemId === null) {
			return;
		}

		const element = surfaceRef.current?.querySelector<HTMLElement>(
			`[data-item-id="${CSS.escape(lastCreatedItemId)}"]`
		);

		if (element) {
			revealCreatedItem(element, theme.colors.accentSurface);
		}

		dispatch(createdItemAcknowledged());
	}, [dispatch, lastCreatedItemId, theme]);

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
		<Surface ref={surfaceRef} onContextMenu={(event) => openAt(event, null)}>
			{contents.length === 0 ? (
				<EmptyPanel>
					<EmptyState>This folder is empty.</EmptyState>
					<EmptyActions>
						{createActions.map(({ key, text, tone, Icon, run }) => (
							<Button key={key} type='button' onClick={run}>
								<IconTint $tone={tone}>
									<Icon aria-hidden='true' />
								</IconTint>
								{text}
							</Button>
						))}
					</EmptyActions>
				</EmptyPanel>
			) : isGrid ? (
				<Grid $tileWidth={isLarge ? '12rem' : '10.5rem'} aria-label='Folder contents'>
					{contents.map((item) => (
						<GridTile
							key={item.id}
							data-item-id={item.id}
							onContextMenu={(event) => openAt(event, item)}
						>
							<TileButton
								type='button'
								title={item.name}
								aria-label={openLabel(item)}
								onClick={() => open(item)}
							>
								<TileGlyph $slot={glyphSize}>
									<ItemIcon item={item} size={glyphSize} />
								</TileGlyph>
								<TileName>{item.name}</TileName>
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
								<Row
									key={item.id}
									data-item-id={item.id}
									onContextMenu={(event) => openAt(event, item)}
								>
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
