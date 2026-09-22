import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { saveWorkspace } from '@/utils/helpers';
import reducer from './rootReducers';

const store = configureStore({ reducer });

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

const useStoreDispatch = useDispatch.withTypes<AppDispatch>();
const useStoreSelector = useSelector.withTypes<RootState>();

function persistOnChange(target: typeof store) {
	let persisted: Workspace = {
		rootId: target.getState().workspace.rootId,
		items: target.getState().workspace.items,
	};

	target.subscribe(() => {
		const { rootId, items } = target.getState().workspace;

		if (items !== persisted.items || rootId !== persisted.rootId) {
			persisted = { rootId, items };
			saveWorkspace(persisted);
		}
	});
}

persistOnChange(store);

export { store, useStoreDispatch, useStoreSelector };
export type { RootState, AppDispatch };
