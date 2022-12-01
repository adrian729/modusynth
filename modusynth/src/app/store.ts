import { configureStore } from '@reduxjs/toolkit';
import dronesReducer from 'src/reducers/dronesSlice';
import notesReducer from 'src/reducers/notesSlice';

const store = configureStore({
    reducer: {
        notes: notesReducer,
        drones: dronesReducer,
    },
});
export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type of each reducer
export type AppDispatch = typeof store.dispatch;
