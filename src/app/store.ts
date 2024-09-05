import { configureStore } from '@reduxjs/toolkit';
import oscillatorsReducer from 'src/reducers/oscillatorsSlice';
import synthReducer from 'src/reducers/synthSlice';
import synthesisReducer from 'src/reducers/synthesisSlice';

const store = configureStore({
    reducer: {
        synth: synthReducer,
        oscillators: oscillatorsReducer,
        synthesis: synthesisReducer,
    },
});
export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type of each reducer
export type AppDispatch = typeof store.dispatch;
