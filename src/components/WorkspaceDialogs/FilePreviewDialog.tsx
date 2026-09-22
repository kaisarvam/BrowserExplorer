import styled from 'styled-components';
import { Button, EditIcon, Modal } from '@/components/atoms';

const Content = styled.pre`
	max-height: 18rem;
	padding: ${({ theme }) => theme.spacing.md};
	border: 1px solid ${({ theme }) => theme.colors.border};
	border-radius: ${({ theme }) => theme.radii.sm};
	background: ${({ theme }) => theme.colors.surface};
	font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
	font-size: ${({ theme }) => theme.fontSizes.sm};
	overflow: auto;
	white-space: pre-wrap;
	overflow-wrap: anywhere;
`;

const Placeholder = styled.p`
	color: ${({ theme }) => theme.colors.textMuted};
	font-size: ${({ theme }) => theme.fontSizes.sm};
`;

type FilePreviewDialogProps = {
	file: FileItem;
	onClose: () => void;
	onEdit: () => void;
};

export function FilePreviewDialog({ file, onClose, onEdit }: FilePreviewDialogProps) {
	return (
		<Modal
			title={file.name}
			onClose={onClose}
			actions={
				<>
					<Button type='button' onClick={onClose}>
						Close
					</Button>
					<Button type='button' $variant='primary' onClick={onEdit}>
						<EditIcon aria-hidden='true' />
						Edit
					</Button>
				</>
			}
		>
			{file.content === '' ? (
				<Placeholder>This file is empty.</Placeholder>
			) : (
				<Content aria-label={`Preview of ${file.name}`} tabIndex={0}>
					{file.content}
				</Content>
			)}
		</Modal>
	);
}
