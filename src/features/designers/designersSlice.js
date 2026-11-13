import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { client } from '../../api/client.js';

export const loadDesigners = createAsyncThunk('designers/load', async (params, { rejectWithValue }) => {
  try {
    const query = Object.keys(params || {}).length ? `?${new URLSearchParams(params).toString()}` : '';
    return await client.get(`/designers${query}`);
  } catch (error) {
    return rejectWithValue(error.message || String(error));
  }
});

const designersSlice = createSlice({
  name: 'designers',
  initialState: {
    list: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadDesigners.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadDesigners.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(loadDesigners.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const selectDesigners = (state) => state.designers;
export default designersSlice.reducer;
