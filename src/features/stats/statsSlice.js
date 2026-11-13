import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const API_BASE = 'http://localhost:5000/api';

async function fetchStats() {
  const res = await fetch(`${API_BASE}/stats`);
  if (!res.ok) throw new Error('Не удалось загрузить статистику');
  return res.json();
}

export const loadStats = createAsyncThunk('stats/load', async (_, { rejectWithValue }) => {
  try {
    return await fetchStats();
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const statsSlice = createSlice({
  name: 'stats',
  initialState: {
    data: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadStats.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadStats.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(loadStats.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default statsSlice.reducer;
