import { createSlice } from '@reduxjs/toolkit';

const requestSlice = createSlice({
  name: 'requests',
  initialState: {
    requests: [],
    myRequests: [],
    loading: false,
    error: null,
  },
  reducers: {
    setRequests: (state, action) => {
      state.requests = action.payload;
    },
    setMyRequests: (state, action) => {
      state.myRequests = action.payload;
    },
    addRequest: (state, action) => {
      state.requests.unshift(action.payload);
      state.myRequests.unshift(action.payload);
    },
    updateRequest: (state, action) => {
      const index = state.requests.findIndex(req => req.id === action.payload.id);
      if (index !== -1) {
        state.requests[index] = { ...state.requests[index], ...action.payload };
      }
      const myIndex = state.myRequests.findIndex(req => req.id === action.payload.id);
      if (myIndex !== -1) {
        state.myRequests[myIndex] = { ...state.myRequests[myIndex], ...action.payload };
      }
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
  setRequests,
  setMyRequests,
  addRequest,
  updateRequest,
  setLoading,
  setError,
} = requestSlice.actions;
export default requestSlice.reducer;