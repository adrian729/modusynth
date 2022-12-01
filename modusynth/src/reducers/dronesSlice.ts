import { createSlice } from '@reduxjs/toolkit';
import { useAppSelector } from 'src/app/hooks';

export interface DronesState {
    freezeCount: number;
}

const initialState: DronesState = {
    freezeCount: 0,
};

export const dronesSlice = createSlice({
    name: 'drones',
    initialState,
    reducers: {
        freeze: (state): void => {
            state.freezeCount += 1;
        },
        relsease: (state): void => {
            state.freezeCount = 0;
        },
    },
});

export const { freeze, relsease } = dronesSlice.actions;
export const getFreezeCount = () =>
    useAppSelector((state) => state.drones.freezeCount);
export const hasDrones = () =>
    useAppSelector((state) => state.drones.freezeCount > 0);
export default dronesSlice.reducer;
