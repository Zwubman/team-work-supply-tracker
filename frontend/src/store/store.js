import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import inventorySlice from './slices/inventorySlice';
import requestSlice from './slices/requestSlice';
import movementSlice from './slices/movementSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    inventory: inventorySlice,
    requests: requestSlice,
    movements: movementSlice,
  },
});

export default store;