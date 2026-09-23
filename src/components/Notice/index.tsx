import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { Button, CloseIcon } from '@/components/atoms';
import { useStoreDispatch, useStoreSelector } from '@/store';
import { selectNotice } from '@/store/selectors';
import { deletionUndone, noticeDismissed } from '@/store/workspaceSlice';
import { NOTICE_DURATION_MS } from '@/utils/constants';

const Region = styled.div`
	position: fixed;
	inset: auto 0 0 0;
	z-index: 25;
	display: flex;
	justify-content: center;
	padding: ${({ theme }) => theme.spacing.lg};
	pointer-events: none;
`;

const Toast = styled.div`
	display: flex;
	align-items: center;
	gap: ${({ theme }) => theme.spacing.sm};
	width: min(32rem, 100%);
	padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.sm} ${theme.spacing.sm} ${theme.spacing.lg}`};
	border: 1px solid ${({ theme }) => theme.colors.border};
	border-radius: ${({ theme }) => theme.radii.md};
	background: ${({ theme }) => theme.colors.surfaceRaised};
	box-shadow: ${({ theme }) => theme.shadows.menu};
	font-size: ${({ theme }) => theme.fontSizes.sm};
	pointer-events: auto;
`;

const Message = styled.p`
	flex: 1;
	overflow-wrap: anywhere;
`;

const DismissButton = styled.button`
	display: grid;
	place-items: center;
	width: 1.75rem;
	height: 1.75rem;
	padding: 0;
	border: none;
	border-radius: ${({ theme }) => theme.radii.sm};
	background: none;
	color: ${({ theme }) => theme.colors.textMuted};
	cursor: pointer;

	&:hover {
		background: ${({ theme }) => theme.colors.surface};
		color: ${({ theme }) => theme.colors.text};
	}

	@media (pointer: coarse) {
		width: 2.75rem;
		height: 2.75rem;
	}
`;

type NoticeToastProps = {
	notice: WorkspaceNotice;
	duration: number;
};

function NoticeToast({ notice, duration }: NoticeToastProps) {
	const dispatch = useStoreDispatch();
	const [paused, setPaused] = useState(false);

	useEffect(() => {
		if (paused) {
			return;
		}

		const timer = window.setTimeout(() => dispatch(noticeDismissed()), duration);

		return () => window.clearTimeout(timer);
	}, [dispatch, duration, paused]);

	return (
		<Toast
			onMouseEnter={() => setPaused(true)}
			onMouseLeave={() => setPaused(false)}
			onFocus={() => setPaused(true)}
			onBlur={() => setPaused(false)}
		>
			<Message>{notice.message}</Message>

			{notice.restorable.length > 0 && (
				<Button
					type='button'
					$variant='ghost'
					onClick={() => {
						dispatch(deletionUndone());
						document.querySelector<HTMLElement>('main')?.focus();
					}}
				>
					Undo
				</Button>
			)}

			<DismissButton
				type='button'
				aria-label='Dismiss message'
				onClick={() => dispatch(noticeDismissed())}
			>
				<CloseIcon aria-hidden='true' />
			</DismissButton>
		</Toast>
	);
}

export function Notice({ duration = NOTICE_DURATION_MS }: { duration?: number }) {
	const notice = useStoreSelector(selectNotice);

	return createPortal(
		<Region role='status' aria-live='polite'>
			{notice && <NoticeToast key={notice.id} notice={notice} duration={duration} />}
		</Region>,
		document.body
	);
}
