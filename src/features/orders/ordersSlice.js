import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const API_BASE = 'http://localhost:5000/api';

async function fetchOrders() {
  const res = await fetch(`${API_BASE}/orders`);
  if (!res.ok) throw new Error('Не удалось загрузить заказы');
  return res.json();
}

async function createOrder(payload) {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error || 'Не удалось создать заказ');
  }
  return res.json();
}

export const loadOrders = createAsyncThunk('orders/load', async (_, { rejectWithValue }) => {
  try {
    return await fetchOrders();
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const submitOrder = createAsyncThunk('orders/submit', async (payload, { rejectWithValue }) => {
  try {
    return await createOrder(payload);
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    list: [],
    status: 'idle',
    error: null,
    submitStatus: 'idle',
    submitError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadOrders.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(loadOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(submitOrder.pending, (state) => {
        state.submitStatus = 'loading';
        state.submitError = null;
      })
      .addCase(submitOrder.fulfilled, (state) => {
        state.submitStatus = 'succeeded';
      })
      .addCase(submitOrder.rejected, (state, action) => {
        state.submitStatus = 'failed';
        state.submitError = action.payload;
      });
  },
});

export default ordersSlice.reducer;
