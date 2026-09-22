import styled from 'styled-components';
import { EmptyState, FileIcon, FolderIcon } from '@/components/atoms';
import { useStoreDispatch, useStoreSelector } from '@/store';
import { selectFolderContents } from '@/store/selectors';
import { navigationRequested } from '@/store/workspaceSlice';
import { getTypeLabel } from '@/utils/helpers';

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

const Name = styled.span`
	display: flex;
	align-items: center;
	gap: ${({ theme }) => theme.spacing.md};
	padding: ${({ theme }) => `${theme.spacing.sm} 0`};
	font-size: ${({ theme }) => theme.fontSizes.sm};
	overflow-wrap: anywhere;
`;

export function FolderContents() {
	const dispatch = useStoreDispatch();
	const contents = useStoreSelector(selectFolderContents);

	return (
		<Surface>
			{contents.length === 0 ? (
				<EmptyState>This folder is empty. Use New folder or New file to add something.</EmptyState>
			) : (
				<Table aria-label='Folder contents'>
					<thead>
						<tr>
							<HeaderCell scope='col'>Name</HeaderCell>
							<HeaderCell scope='col'>Type</HeaderCell>
						</tr>
					</thead>
					<tbody>
						{contents.map((item) => (
							<Row key={item.id}>
								<Cell>
									{item.type === 'folder' ? (
										<NameButton
											type='button'
											aria-label={`Open folder ${item.name}`}
											onClick={() =>
												dispatch(navigationRequested({ kind: 'folder', folderId: item.id }))
											}
										>
											<FolderIcon aria-hidden='true' />
											{item.name}
										</NameButton>
									) : (
										<Name>
											<FileIcon aria-hidden='true' />
											{item.name}
										</Name>
									)}
								</Cell>
								<TypeCell>{getTypeLabel(item)}</TypeCell>
							</Row>
						))}
					</tbody>
				</Table>
			)}
		</Surface>
	);
}
