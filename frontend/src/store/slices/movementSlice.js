import { createSlice } from '@reduxjs/toolkit';

const movementSlice = createSlice({
  name: 'movements',
  initialState: {
    movements: [],
    loading: false,
    error: null,
  },
  reducers: {
    setMovements: (state, action) => {
      state.movements = action.payload;
    },
    addMovement: (state, action) => {
      state.movements.unshift(action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setMovements,
  addMovement,
  setLoading,
  setError,
} = movementSlice.actions;
export default movementSlice.reducer;