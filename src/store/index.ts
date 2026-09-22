import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import reducer from './rootReducers';

const store = configureStore({ reducer });

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

const useStoreDispatch = useDispatch.withTypes<AppDispatch>();
const useStoreSelector = useSelector.withTypes<RootState>();

export { store, useStoreDispatch, useStoreSelector };
export type { RootState, AppDispatch };
