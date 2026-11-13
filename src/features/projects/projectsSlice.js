import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { client } from '../../api/client.js';

export const loadProjects = createAsyncThunk('projects/load', async (params, { rejectWithValue }) => {
  try {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return await client.get(`/projects${query}`);
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const projectsSlice = createSlice({
  name: 'projects',
  initialState: {
    list: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadProjects.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadProjects.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(loadProjects.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const selectProjects = (state) => state.projects;
export default projectsSlice.reducer;
