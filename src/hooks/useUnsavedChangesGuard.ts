import { useEffect } from 'react';
import { useStoreSelector } from '@/store';
import { selectHasUnsavedChanges, selectOpenFile } from '@/store/selectors';
import { APP_TITLE } from '@/utils/constants';

export function useUnsavedChangesGuard(): void {
	const openFile = useStoreSelector(selectOpenFile);
	const hasUnsavedChanges = useStoreSelector(selectHasUnsavedChanges);
	const fileName = openFile?.name;

	useEffect(() => {
		document.title =
			fileName === undefined
				? APP_TITLE
				: `${hasUnsavedChanges ? '• ' : ''}${fileName} — ${APP_TITLE}`;
	}, [fileName, hasUnsavedChanges]);

	useEffect(() => {
		if (!hasUnsavedChanges) {
			return;
		}

		function handleBeforeUnload(event: BeforeUnloadEvent) {
			event.preventDefault();
		}

		window.addEventListener('beforeunload', handleBeforeUnload);

		return () => window.removeEventListener('beforeunload', handleBeforeUnload);
	}, [hasUnsavedChanges]);
}
