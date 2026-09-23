import { useState } from 'react';
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

const COLLAPSE_AFTER = 4;
const VISIBLE_TAIL = 2;

export function Breadcrumbs() {
	const dispatch = useStoreDispatch();
	const breadcrumbs = useStoreSelector(selectBreadcrumbs);
	const [expandedFor, setExpandedFor] = useState<WorkspaceItemId | null>(null);

	const currentId = breadcrumbs.at(-1)?.id ?? null;
	const isCollapsed = breadcrumbs.length > COLLAPSE_AFTER && expandedFor !== currentId;
	const head = isCollapsed ? breadcrumbs.slice(0, 1) : breadcrumbs;
	const hidden = isCollapsed ? breadcrumbs.slice(1, -VISIBLE_TAIL) : [];
	const tail = isCollapsed ? breadcrumbs.slice(-VISIBLE_TAIL) : [];

	function renderCrumb(item: WorkspaceItem, showSeparator: boolean) {
		const isCurrent = item.id === currentId;

		return (
			<li key={item.id}>
				{showSeparator && <Separator aria-hidden='true'>/</Separator>}
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
	}

	return (
		<nav aria-label='Breadcrumb'>
			<List>
				{head.map((item, index) => renderCrumb(item, index > 0))}

				{isCollapsed && (
					<li>
						<Separator aria-hidden='true'>/</Separator>
						<Crumb
							type='button'
							title={hidden.map((item) => item.name).join(' / ')}
							aria-label={`Show ${hidden.length} hidden folders`}
							onClick={() => setExpandedFor(currentId)}
						>
							&hellip;
						</Crumb>
					</li>
				)}

				{tail.map((item) => renderCrumb(item, true))}
			</List>
		</nav>
	);
}
