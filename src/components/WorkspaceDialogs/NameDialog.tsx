import { useId, useState } from 'react';
import { Button, FieldError, Modal, TextInput } from '@/components/atoms';
import { validateItemName } from '@/utils/helpers';

type NameDialogProps = {
	title: string;
	label: string;
	confirmLabel: string;
	initialName: string;
	items: WorkspaceItems;
	parentId: WorkspaceItemId;
	ignoreItemId?: WorkspaceItemId;
	onCancel: () => void;
	onConfirm: (name: string) => void;
};

export function NameDialog({
	title,
	label,
	confirmLabel,
	initialName,
	items,
	parentId,
	ignoreItemId,
	onCancel,
	onConfirm,
}: NameDialogProps) {
	const formId = useId();
	const errorId = useId();
	const [name, setName] = useState(initialName);
	const [error, setError] = useState<string | null>(null);

	function handleSubmit(event: React.FormEvent) {
		event.preventDefault();

		const validation = validateItemName({ items, parentId, name, ignoreItemId });

		if (validation.status === 'invalid') {
			setError(validation.message);
			return;
		}

		onConfirm(validation.name);
	}

	return (
		<Modal
			title={title}
			onClose={onCancel}
			actions={
				<>
					<Button type='button' onClick={onCancel}>
						Cancel
					</Button>
					<Button type='submit' form={formId} $variant='primary'>
						{confirmLabel}
					</Button>
				</>
			}
		>
			<form id={formId} onSubmit={handleSubmit} noValidate>
				<label htmlFor={`${formId}-name`}>{label}</label>
				<TextInput
					id={`${formId}-name`}
					value={name}
					$invalid={error !== null}
					aria-invalid={error !== null}
					aria-describedby={error === null ? undefined : errorId}
					onChange={(event) => {
						setName(event.target.value);
						setError(null);
					}}
				/>
				{error !== null && (
					<FieldError id={errorId} role='alert'>
						Error: {error}
					</FieldError>
				)}
			</form>
		</Modal>
	);
}
