import styled from 'styled-components';
import { Button, IconTint } from '@/components/atoms';
import { useItemActions } from '@/hooks';

const Actions = styled.div<{ $compact: boolean }>`
	display: flex;
	align-items: center;
	gap: ${({ theme }) => theme.spacing.xs};

	flex-wrap: nowrap;
	justify-content: ${({ $compact }) => ($compact ? 'center' : 'flex-end')};
`;

const IconButton = styled.button`
	display: grid;
	place-items: center;
	width: 1.75rem;
	height: 1.75rem;
	padding: 0;
	border: 1px solid transparent;
	border-radius: ${({ theme }) => theme.radii.sm};
	background: none;
	cursor: pointer;

	&:hover {
		border-color: ${({ theme }) => theme.colors.border};
		background: ${({ theme }) => theme.colors.surface};
	}

	@media (pointer: coarse) {
		width: 2.75rem;
		height: 2.75rem;
	}
`;

type ItemActionsProps = {
	item: WorkspaceItem;

	compact: boolean;
};

export function ItemActions({ item, compact }: ItemActionsProps) {
	const actions = useItemActions(item).filter((action) => action.key !== 'open');

	return (
		<Actions $compact={compact}>
			{actions.map(({ key, label, text, tone, Icon, run }) =>
				compact ? (
					<IconButton key={key} type='button' title={text} aria-label={label} onClick={run}>
						<IconTint $tone={tone}>
							<Icon aria-hidden='true' />
						</IconTint>
					</IconButton>
				) : (
					<Button key={key} type='button' $variant='ghost' aria-label={label} onClick={run}>
						<IconTint $tone={tone}>
							<Icon aria-hidden='true' />
						</IconTint>
						{text}
					</Button>
				)
			)}
		</Actions>
	);
}
