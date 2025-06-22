import { createSlice } from '@reduxjs/toolkit';

const inventorySlice = createSlice({
  name: 'inventory',
  initialState: {
    items: [],
    editingItem: null,
    loading: false,
    error: null,
  },
  reducers: {
    setItems: (state, action) => {
      state.items = action.payload;
    },
    addItem: (state, action) => {
      state.items.unshift(action.payload);
    },
    updateItem: (state, action) => {
      const index = state.items.findIndex(item => item.sku === action.payload.sku);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
      }
    },
    deleteItem: (state, action) => {
      state.items = state.items.filter(item => item.sku !== action.payload);
    },
    setEditingItem: (state, action) => {
      state.editingItem = action.payload;
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
  setItems,
  addItem,
  updateItem,
  deleteItem,
  setEditingItem,
  setLoading,
  setError,
} = inventorySlice.actions;
export default inventorySlice.reducer;